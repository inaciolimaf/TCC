#include <Arduino.h>
#include <HTTPClient.h>
#include "driver/i2s.h"
#include "config.h"
#include "wifi_manager.h"
#include "audio_manager.h"
#include "http_client.h"
QueueHandle_t audioQueue;
// Definição das tarefas
TaskHandle_t ReadI2STaskHandle = NULL;
TaskHandle_t SendHTTPTaskHandle = NULL;

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
    vTaskDelay(pdMS_TO_TICKS(10000));
}
