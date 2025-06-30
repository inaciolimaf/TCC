#include <Arduino.h>
#include <HTTPClient.h>
#include "driver/i2s.h"
#include "config.h"
#include "wifi_manager.h"
#include "audio_manager.h"
#include "http_client.h"
#include "gps.h"
#include "mpu.h"
#include "button.h"
#include "socket_manager.h"  // Novo include
#include <TinyGPS++.h>

QueueHandle_t audioQueue;

TaskHandle_t ReadI2STaskHandle = NULL;
TaskHandle_t SendHTTPTaskHandle = NULL;
TaskHandle_t mpuTaskHandle = NULL;
TaskHandle_t socketTaskHandle = NULL;
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
    setupWiFi();
    setupI2S();
    setupGPS();
    initBuffersPool();
    setupButton();
    checkDangerStatus();
    
    audioQueue = xQueueCreate(QUEUE_SIZE, sizeof(uint8_t*));
    if (audioQueue == NULL) {
        Serial.println("[ERRO] Falha ao criar a fila!");
        while (1);
    }
    
    // Configurar Socket.IO após WiFi estar conectado
    if (ENABLE_SOCKET) {
        setupSocket();
        xTaskCreatePinnedToCore(
            socketTask,
            "socketTask",
            8192,
            NULL,
            1,
            &socketTaskHandle,
            1
        );
    }
    
    if (ENABLE_GPS){
        xTaskCreatePinnedToCore(
          readGPSTask,
          "readGPSTask",
          4096,
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

        // Múltiplas tasks para envio HTTP (como estava antes)
        xTaskCreatePinnedToCore(
            sendHTTPTask,
            "sendHTTPTask1",
            4096,
            NULL,
            1,
            &SendHTTPTaskHandle,
            1
        );
        xTaskCreatePinnedToCore(
            sendHTTPTask,
            "sendHTTPTask2",
            4096,
            NULL,
            1,
            NULL,
            1
        );
        xTaskCreatePinnedToCore(
            sendHTTPTask,
            "sendHTTPTask3",
            4096,
            NULL,
            1,
            NULL,
            1
        );
        xTaskCreatePinnedToCore(
            sendHTTPTask,
            "sendHTTPTask4",
            4096,
            NULL,
            1,
            NULL,
            1
        );    
    }
    
    if (ENABLE_MPU){
      setupMPU();
      xTaskCreatePinnedToCore(
          readMPUTask,
          "readMPUTask",
          4096,
          NULL,
          1,
          &mpuTaskHandle,
          1
      );
    }
}

void loop() {
    vTaskDelay(50 / portTICK_PERIOD_MS);
}