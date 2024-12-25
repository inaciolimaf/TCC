#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include "driver/i2s.h"

// Definição das credenciais WiFi
#ifndef WIFI_SSID
#define WIFI_SSID "wifi_inacio."
#endif
#ifndef WIFI_PASSWORD
#define WIFI_PASSWORD "zenilda11"
#endif

// Definição dos pinos I2S
#define I2S_WS 25
#define I2S_SCK 26
#define I2S_SD 22

// Configuração do I2S
static const i2s_config_t i2sConfig = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
    .sample_rate = 16000,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_32BIT,
    .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
    .communication_format = i2s_comm_format_t(I2S_COMM_FORMAT_STAND_I2S),
    .intr_alloc_flags = 0,
    .dma_buf_count = 4,
    .dma_buf_len = 256,
    .use_apll = false,
    .tx_desc_auto_clear = false,
    .fixed_mclk = 0
};

static const i2s_pin_config_t pinConfig = {
    .bck_io_num = I2S_SCK,
    .ws_io_num = I2S_WS,
    .data_out_num = I2S_PIN_NO_CHANGE,
    .data_in_num = I2S_SD
};

// Endpoints do servidor
const char* START_STREAM_URL = "http://192.168.3.3:3000/start-stream";
const char* UPLOAD_CHUNK_URL = "http://192.168.3.3:3000/upload-chunk";
const char* FINISH_STREAM_URL = "http://192.168.3.3:3000/finish-stream";

// Tamanho do bloco em amostras (1024). Cada amostra = 2 bytes, total 2kB por bloco.
const size_t CHUNK_SAMPLES = 2048*8;
const size_t CHUNK_SIZE = CHUNK_SAMPLES * 2; // 2 bytes por amostra

// Definição da fila para armazenar os chunks de dados
#define QUEUE_SIZE 2 // Número de chunks que a fila pode armazenar
QueueHandle_t audioQueue;

// Definição das tarefas
TaskHandle_t ReadI2STaskHandle = NULL;
TaskHandle_t SendHTTPTaskHandle = NULL;

// Função para conectar ao WiFi
void setupWiFi() {
    Serial.printf("Conectando em %s", WIFI_SSID);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.print("\nConectado! IP: ");
    Serial.println(WiFi.localIP());
}

// Função para configurar o I2S
void setupI2S() {
    i2s_driver_install(I2S_NUM_0, &i2sConfig, 0, NULL);
    i2s_set_pin(I2S_NUM_0, &pinConfig);
    i2s_set_clk(I2S_NUM_0, 16000, I2S_BITS_PER_SAMPLE_32BIT, I2S_CHANNEL_MONO);
}

// Função para enviar um POST vazio
bool sendEmptyPOST(const char* url) {
    HTTPClient http;
    http.begin(url);
    int httpCode = http.POST(""); // sem payload
    if (httpCode > 0) {
        Serial.printf("[HTTP] POST %s -> code: %d\n", url, httpCode);
    } else {
        Serial.printf("[ERRO] POST %s falhou: %s\n", url, http.errorToString(httpCode).c_str());
    }
    http.end();
    return (httpCode == 200);
}

// Função para enviar um chunk de dados
bool sendChunk(const uint8_t* data, size_t length) {
    HTTPClient http;
    http.begin(UPLOAD_CHUNK_URL);
    http.addHeader("Content-Type", "application/octet-stream");
    int httpCode = http.POST(const_cast<uint8_t*>(data), length);
    if (httpCode > 0) {
        Serial.printf("[HTTP] POST chunk -> code: %d\n", httpCode);
    } else {
        Serial.printf("[ERRO] POST chunk falhou: %s\n", http.errorToString(httpCode).c_str());
    }
    String resp = http.getString();
    Serial.println("Resposta do servidor: " + resp);
    http.end();
    return (httpCode == 200);
}

// Tarefa para ler dados do I2S e colocar na fila
void ReadI2STask(void* parameter) {
    uint8_t* chunkBuffer = (uint8_t*)malloc(CHUNK_SIZE);
    if (chunkBuffer == NULL) {
        Serial.println("[ERRO] Falha na alocação de memória para chunkBuffer!");
        vTaskDelete(NULL);
    }

    while (true) {
        memset(chunkBuffer, 0, CHUNK_SIZE);
        size_t bytesLeft = CHUNK_SIZE;
        size_t offset = 0;
        
        while (bytesLeft > 0) {
            size_t bytesRead = 0;
            i2s_read(I2S_NUM_0, chunkBuffer + offset, bytesLeft, &bytesRead, portMAX_DELAY);
            offset += bytesRead;
            bytesLeft -= bytesRead;
        }
        
        uint8_t* bufferToSend = (uint8_t*)malloc(CHUNK_SIZE);
        if (bufferToSend == NULL) {
            Serial.println("[ERRO] Falha na alocação de memória para bufferToSend!");
            continue;
        }
        
        // Copia os dados para o novo buffer
        memcpy(bufferToSend, chunkBuffer, CHUNK_SIZE);
        
        // Tenta enviar o chunk para a fila
        if (xQueueSend(audioQueue, &bufferToSend, (TickType_t)10) != pdPASS) {
            Serial.println("[WARN] Fila cheia! Chunk descartado.");
            free(bufferToSend); // Libera a memória se não conseguir enviar
        }
        
        // Pequeno delay para evitar sobrecarga
        vTaskDelay(pdMS_TO_TICKS(1));
    }

    free(chunkBuffer);
    vTaskDelete(NULL);
}// Tarefa para enviar dados da fila via HTTP
void SendHTTPTask(void* parameter) {
    // Inicializa a sessão de streaming
    if (!sendEmptyPOST(START_STREAM_URL)) {
        Serial.println("[ERRO] Falha ao iniciar stream no servidor!");
    }

    while (true) {
        uint8_t* receivedChunk = NULL;

        Serial.printf("Fila vazia");
        // Espera até que haja um chunk na fila
        if (xQueueReceive(audioQueue, &receivedChunk, portMAX_DELAY) == pdTRUE) {
            if (receivedChunk != NULL) {
                Serial.printf("Enviando chunk (%d bytes)...\n", (int)CHUNK_SIZE);
                if (!sendChunk(receivedChunk, CHUNK_SIZE)) {
                    Serial.println("[ERRO] Falha ao enviar chunk!");
                    // Opcional: Re-tentar envio ou implementar lógica de recuperação
                }
                free(receivedChunk);
            }
        }
    }

    // Finaliza a sessão de streaming (nunca será alcançado neste exemplo)
    if (!sendEmptyPOST(FINISH_STREAM_URL)) {
        Serial.println("[ERRO] Falha ao finalizar stream no servidor!");
    }

    vTaskDelete(NULL);
}

void setup() {
    Serial.begin(115200);
    delay(1000);
    setupWiFi();
    setupI2S();

    // Cria a fila para armazenar os chunks de áudio
    audioQueue = xQueueCreate(QUEUE_SIZE, sizeof(uint8_t*));
    if (audioQueue == NULL) {
        Serial.println("[ERRO] Falha ao criar a fila!");
        while (1); // Hang se a fila não puder ser criada
    }

    // Cria a tarefa de leitura do I2S
    xTaskCreatePinnedToCore(
        ReadI2STask,       // Função da tarefa
        "ReadI2STask",     // Nome da tarefa
        8192,              // Tamanho da pilha
        NULL,              // Parâmetro
        1,                 // Prioridade
        &ReadI2STaskHandle,// Handle da tarefa
        0                  // Núcleo
    );

    // Cria a tarefa de envio HTTP
    xTaskCreatePinnedToCore(
        SendHTTPTask,
        "SendHTTPTask",
        8192,
        NULL,
        1,
        &SendHTTPTaskHandle,
        1 // Executa em outro núcleo para melhor performance
    );
}

void loop() {
    // O loop está vazio porque as tarefas estão sendo gerenciadas pelo FreeRTOS
    vTaskDelay(pdMS_TO_TICKS(10000)); // Delay de 1000ms
}
