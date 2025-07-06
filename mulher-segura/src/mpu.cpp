#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>
#include <math.h>
#include "config.h"
#include "http_client.h"

Adafruit_MPU6050 mpu;

unsigned long lastFallTime = 0;
float previousG = 1.0;

void setupMPU() {
    Wire.begin(SDA_PIN, SCL_PIN);
    Wire.setClock(100000);
    Serial.println("Inicializando MPU6050...");
    mpu.begin();
    Serial.println("MPU6050 inicializado com sucesso!");
    mpu.setAccelerometerRange(MPU6050_RANGE_4_G);
    mpu.setGyroRange(MPU6050_RANGE_500_DEG);
    mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
    delay(1000);
}

void readMPUTask(void* parameter) {
    sensors_event_t a, g, temp;
    for (;;) {
        mpu.getEvent(&a, &g, &temp);
        
        float accelTotal = sqrt(a.acceleration.x * a.acceleration.x +
                                a.acceleration.y * a.acceleration.y +
                                a.acceleration.z * a.acceleration.z);
        
        float totalG = accelTotal / 9.81;        
        // Thresholds mais rigorosos + verificar mudança brusca
        
        if (millis() - lastFallTime > 5000) { // 5 segundos entre detecções
            if ((totalG < 0.25 || totalG > 6.0)&&totalG != 0) {
                lastFallTime = millis();
                Serial.printf("Queda detectada! Aceleração: %.2f g\n", totalG);
                const char* jsonData = "{\"isInDanger\": true, \"reason\": \"FALL\"}";
                sendOccurence(jsonData);
            }
        }
        
        vTaskDelay(100 / portTICK_PERIOD_MS);
    }
}