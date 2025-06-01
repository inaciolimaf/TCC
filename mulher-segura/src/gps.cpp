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

void setupGPS() {
    gpsSerial.begin(GPS_BAUD, SERIAL_8N1, RXD2, TXD2);
    Serial.println("GPS inicializado a 9600 baud");
}
void readGPSTask(void * parameter) {
    for(;;) {
        while (gpsSerial.available() > 0) {
            char gpsData = gpsSerial.read();
            Serial.print(gpsData);
        }
        vTaskDelay(100 / portTICK_PERIOD_MS);
    }
}