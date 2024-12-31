#include "config.h"

const char* START_STREAM_URL = "http://192.168.3.3:3000/start-stream";
const char* UPLOAD_CHUNK_URL = "http://192.168.3.3:3000/upload-chunk";
const char* FINISH_STREAM_URL = "http://192.168.3.3:3000/finish-stream";

const size_t CHUNK_SAMPLES = 2048 * 6;
const size_t CHUNK_SIZE = CHUNK_SAMPLES * 2;
const i2s_config_t i2sConfig = {
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

const i2s_pin_config_t pinConfig = {
    .bck_io_num = I2S_SCK,
    .ws_io_num = I2S_WS,
    .data_out_num = I2S_PIN_NO_CHANGE,
    .data_in_num = I2S_SD
};