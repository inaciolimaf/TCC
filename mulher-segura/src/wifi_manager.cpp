#include "wifi_manager.h"
#include "driver/i2s.h"
#include "config.h"
#include <WiFi.h>

void setupWiFi() {
    Serial.printf("Conectando em %s", WIFI_SSID);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.print("\nConectado! IP: ");
    Serial.println(WiFi.localIP());
}