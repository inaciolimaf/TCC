#include <Arduino.h>
#include "config.h"
#include "http_client.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"

QueueHandle_t panicQueue;

volatile unsigned long lastInterruptTime = 0;


void panicTask(void *parameter) {
    bool panicEvent;
    
    while (true) {
        // Bloqueia aqui até receber um evento (ZERO CPU)
        if (xQueueReceive(panicQueue, &panicEvent, portMAX_DELAY)) {
            Serial.println("Alerta de pânico recebido!");
            
            const char* jsonData = "{\"isInDanger\": true, \"reason\": \"PANIC_BUTTON\"}";
            
            // Pequeno delay para não sobrecarregar
            vTaskDelay(100 / portTICK_PERIOD_MS);
            
            sendOccurence(jsonData);
            
            Serial.println("Alerta enviado!");
        }
        
        // Pequeno delay após processar (opcional)
        vTaskDelay(1000 / portTICK_PERIOD_MS);
    }
}


void IRAM_ATTR buttonISR() {
    unsigned long interruptTime = millis();
    
    if (interruptTime - lastInterruptTime > 200) {
        BaseType_t xHigherPriorityTaskWoken = pdFALSE;
        bool panicEvent = true;
        
        // Envia para a queue sem bloquear
        xQueueSendFromISR(panicQueue, &panicEvent, &xHigherPriorityTaskWoken);
        
        if (xHigherPriorityTaskWoken) {
            portYIELD_FROM_ISR();
        }
    }
    
    lastInterruptTime = interruptTime;
}
void setupButton(){
    panicQueue = xQueueCreate(5, sizeof(bool));
    xTaskCreatePinnedToCore(panicTask, "PanicTask", 1792, NULL, 0, NULL, 1);
    pinMode(BUTTON_PIN, INPUT_PULLUP);
    attachInterrupt(digitalPinToInterrupt(BUTTON_PIN), buttonISR, FALLING);
}