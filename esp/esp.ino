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
}

void loop() {
    vTaskDelay(pdMS_TO_TICKS(10000));
}
