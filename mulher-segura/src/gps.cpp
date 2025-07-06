#include <Arduino.h>
#include "driver/i2s.h"
#include "config.h"
#include "wifi_manager.h"
#include "audio_manager.h"
#include "http_client.h"
#include "gps.h"
#include <TinyGPS++.h>

TinyGPSPlus gps;
HardwareSerial gpsSerial(2);

struct GPSData {
    double latitude;
    double longitude;
    double altitude;
    float speed_kmh;
    float course;
    int satellites;
    float hdop;
    bool valid;
    String timestamp;
};

GPSData lastGPSData;

void setupGPS() {
    gpsSerial.begin(GPS_BAUD, SERIAL_8N1, RXD2, TXD2);
    Serial.println("GPS inicializado a 9600 baud");
}

void logGPSData(const GPSData& data) {
    Serial.println("=== LOG GPS ===");
    Serial.printf("Posição: %.6f°, %.6f°\n", data.latitude, data.longitude);
    Serial.printf("Altitude: %.1f metros\n", data.altitude);
    Serial.printf("Velocidade: %.2f km/h\n", data.speed_kmh);
    Serial.printf("Direção: %.1f°\n", data.course);
    Serial.printf("Satélites: %d\n", data.satellites);
    Serial.printf("HDOP: %.2f\n", data.hdop);
    Serial.printf("Status: %s\n", data.valid ? "VÁLIDO" : "INVÁLIDO");
    Serial.printf("Horário: %s\n", data.timestamp.c_str());
    Serial.println("===============");
}

void readGPSTask(void * parameter) {
    bool fixFound = false;
    
    for(;;) {
        while (gpsSerial.available() > 0) {
            char gpsData = gpsSerial.read();
            if (gps.encode(gpsData)) {
                if (gps.location.isUpdated()) {
                    lastGPSData.latitude = gps.location.lat();
                    lastGPSData.longitude = gps.location.lng();
                    lastGPSData.valid = gps.location.isValid();

                    if (lastGPSData.valid && !fixFound) {
                        Serial.println("GPS fix encontrado!");
                        fixFound = true;
                    }

                    if (fixFound) {
                        String jsonData = String("{\"latitude\": ") + String(lastGPSData.latitude, 6) +
                                          ", \"longitude\": " + String(lastGPSData.longitude, 6) + "}";

                        vTaskDelay(10000 / portTICK_PERIOD_MS);
                        sendGPS(jsonData.c_str());
                    }
                }
            }
            vTaskDelay(1000 / portTICK_PERIOD_MS);
        }
        
    }
}

// Função para obter dados GPS atuais
GPSData getCurrentGPSData() {
    return lastGPSData;
}