#ifndef CONFIG_H
#define CONFIG_H

#include "driver/i2s.h"

#define WIFI_SSID "wifi_inacio."
#define WIFI_PASSWORD "zenilda11"

#define I2S_WS 25
#define I2S_SCK 26
#define I2S_SD 22

#define QUEUE_SIZE 2
#define NUM_BUFFERS 3
#define ENABLE_MICROFONE 0
#define ENABLE_GPS 1

#define RXD2 16
#define TXD2 17
#define GPS_BAUD 9600

extern QueueHandle_t audioQueue;
extern QueueHandle_t buffersQueue;

extern const char* START_STREAM_URL;
extern const char* UPLOAD_CHUNK_URL;
extern const char* FINISH_STREAM_URL;

extern const size_t CHUNK_SAMPLES;
extern const size_t CHUNK_SIZE;

extern const i2s_config_t i2sConfig;
extern const i2s_pin_config_t pinConfig;

#endif
