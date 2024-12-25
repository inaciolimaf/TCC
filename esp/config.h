#include "driver/i2s.h"

#ifndef CONFIG_H
#define CONFIG_H

#define WIFI_SSID "wifi_inacio."
#define WIFI_PASSWORD "zenilda11"

#define I2S_WS 25
#define I2S_SCK 26
#define I2S_SD 22

// Change extern declarations to just declarations with extern
extern const char* START_STREAM_URL;
extern const char* UPLOAD_CHUNK_URL;
extern const char* FINISH_STREAM_URL;

#define QUEUE_SIZE 2 

static const i2s_config_t i2sConfig = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
    .sample_rate = 16000,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_32BIT,
    .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
    .communication_format = i2s_comm_format_t(I2S_COMM_FORMAT_STAND_I2S),
    .intr_alloc_flags = 0,
    .dma_buf_count = 4,
    .dma_buf_len = 256,
    .use_apll = false,
    .tx_desc_auto_clear = false,
    .fixed_mclk = 0
};

static const i2s_pin_config_t pinConfig = {
    .bck_io_num = I2S_SCK,
    .ws_io_num = I2S_WS,
    .data_out_num = I2S_PIN_NO_CHANGE,
    .data_in_num = I2S_SD
};

extern const size_t CHUNK_SAMPLES;
extern const size_t CHUNK_SIZE;

#endif // CONFIG_H