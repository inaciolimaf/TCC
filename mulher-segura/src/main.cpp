#include <Arduino.h>
#include <HTTPClient.h>
#include "driver/i2s.h"
#include "config.h"
#include "wifi_manager.h"
#include "audio_manager.h"
#include "http_client.h"
#include "gps.h"
#include <TinyGPS++.h>

QueueHandle_t audioQueue;

TaskHandle_t ReadI2STaskHandle = NULL;
TaskHandle_t SendHTTPTaskHandle = NULL;

uint8_t* buffersPool[NUM_BUFFERS];
QueueHandle_t buffersQueue;

void initBuffersPool() {
    buffersQueue = xQueueCreate(NUM_BUFFERS, sizeof(uint8_t*));
    for (int i = 0; i < NUM_BUFFERS; i++) {
        buffersPool[i] = (uint8_t*)malloc(CHUNK_SIZE);
        if (buffersPool[i] == NULL) {
            Serial.printf("[ERRO] Falha ao alocar buffer %d\n", i);
        } else {
            xQueueSend(buffersQueue, &buffersPool[i], 0);
        }
    }
}

void setup() {
    Serial.begin(115200);
    delay(1000);
    setupWiFi();
    setupI2S();
    setupGPS();
    initBuffersPool();
    audioQueue = xQueueCreate(QUEUE_SIZE, sizeof(uint8_t*));
    if (audioQueue == NULL) {
        Serial.println("[ERRO] Falha ao criar a fila!");
        while (1);
    }
    if (ENABLE_GPS){
        xTaskCreatePinnedToCore(
          readGPSTask,
          "readGPSTask",
          16486,
          NULL,
          1,
          NULL,
          1
        );
    }
    
    if (ENABLE_MICROFONE) {
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
            sendHTTPTask,
            "sendHTTPTask",
            8192,
            NULL,
            1,
            &SendHTTPTaskHandle,
            1
        );
        xTaskCreatePinnedToCore(
            sendHTTPTask,
            "sendHTTPTask",
            8192,
            NULL,
            1,
            &SendHTTPTaskHandle,
            1
        );
        xTaskCreatePinnedToCore(
            sendHTTPTask,
            "sendHTTPTask",
            8192,
            NULL,
            1,
            &SendHTTPTaskHandle,
            1
        );
        xTaskCreatePinnedToCore(
            sendHTTPTask,
            "sendHTTPTask",
            8192,
            NULL,
            1,
            &SendHTTPTaskHandle,
            1
        );    
    }
}

void loop() {
    vTaskDelay(1000 / portTICK_PERIOD_MS);
}