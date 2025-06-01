#include <Arduino.h>
#include "driver/i2s.h"
#include "config.h"
#include "wifi_manager.h"
#include "audio_manager.h"
#include "http_client.h"
#include "gps.h"
#include <TinyGPS++.h>
// Crie uma instância do TinyGPS++
TinyGPSPlus gps;
HardwareSerial gpsSerial(2);

void setupGPS() {
    gpsSerial.begin(GPS_BAUD, SERIAL_8N1, RXD2, TXD2);
    Serial.println("GPS inicializado a 9600 baud");
}
void readGPS() {
    while (gpsSerial.available() > 0) {
        char gpsData = gpsSerial.read();
        Serial.print(gpsData);

    }
}