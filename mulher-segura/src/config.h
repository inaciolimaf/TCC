#ifndef CONFIG_H
#define CONFIG_H

#include "driver/i2s.h"

#define WIFI_SSID "wifi_inacio."
#define WIFI_PASSWORD "zenilda11"


#define I2S_WS 25
#define I2S_SCK 26
#define I2S_SD 22

extern const char* START_STREAM_URL;
extern const char* UPLOAD_CHUNK_URL;
extern const char* FINISH_STREAM_URL;

#define QUEUE_SIZE 2

extern const size_t CHUNK_SAMPLES;
extern const size_t CHUNK_SIZE;

extern const i2s_config_t i2sConfig;
extern const i2s_pin_config_t pinConfig;

#endif
