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

#define NUM_BUFFERS 3  // Defina de acordo com a taxa de chunks esperada
uint8_t* buffersPool[NUM_BUFFERS];
QueueHandle_t buffersQueue;

void initBuffersPool() {
    buffersQueue = xQueueCreate(NUM_BUFFERS, sizeof(uint8_t*));
    for (int i = 0; i < NUM_BUFFERS; i++) {
        buffersPool[i] = (uint8_t*)malloc(CHUNK_SIZE);
        if (buffersPool[i] == NULL) {
            Serial.printf("[ERRO] Falha ao alocar buffer %d\n", i);
        } else {
            // Enfileira o buffer para que fique disponível para uso
            xQueueSend(buffersQueue, &buffersPool[i], 0);
        }
    }
}

void setup() {
    Serial.begin(115200);
    delay(1000);
    setupWiFi();
    setupI2S();
    initBuffersPool();
    audioQueue = xQueueCreate(QUEUE_SIZE, sizeof(uint8_t*));
    if (audioQueue == NULL) {
        Serial.println("[ERRO] Falha ao criar a fila!");
        while (1);
    }

    xTaskCreatePinnedToCore(
        ReadI2STask,       
        "ReadI2STask",     
        8192,              
        NULL,              
        1,                 
        &ReadI2STaskHandle,
        0                  
    );

    xTaskCreatePinnedToCore(
        SendHTTPTask,
        "SendHTTPTask",
        8192,
        NULL,
        1,
        &SendHTTPTaskHandle,
        1
    );
    xTaskCreatePinnedToCore(
        SendHTTPTask,
        "SendHTTPTask",
        8192,
        NULL,
        1,
        &SendHTTPTaskHandle,
        1
    );
    xTaskCreatePinnedToCore(
        SendHTTPTask,
        "SendHTTPTask",
        8192,
        NULL,
        1,
        &SendHTTPTaskHandle,
        1
    );
    xTaskCreatePinnedToCore(
        SendHTTPTask,
        "SendHTTPTask",
        8192,
        NULL,
        1,
        &SendHTTPTaskHandle,
        1
    );
}

void loop() {
    vTaskDelay(pdMS_TO_TICKS(10000));
}
