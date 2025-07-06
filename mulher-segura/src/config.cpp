#include "config.h"
#include <string>

// IP base centralizado
constexpr const char* BASE_IP = "192.168.3.52";

// URLs compostas dinamicamente
static std::string start_stream_url = std::string("http://") + BASE_IP + ":3000/api/v1/start-stream";
static std::string upload_chunk_url = std::string("http://") + BASE_IP + ":3000/api/v1/upload-chunk";
static std::string finish_stream_url = std::string("http://") + BASE_IP + ":3000/api/v1/finish-stream";
static std::string create_occurence_url = std::string("http://") + BASE_IP + ":3000/api/v1/occurrence/create";
static std::string gps_url = std::string("http://") + BASE_IP + ":3000/api/v1/gps/create";

// Ponteiros const char* expostos
const char* START_STREAM_URL = start_stream_url.c_str();
const char* UPLOAD_CHUNK_URL = upload_chunk_url.c_str();
const char* FINISH_STREAM_URL = finish_stream_url.c_str();
const char* CREATE_OCCURENCE = create_occurence_url.c_str();
const char* GPS_URL = gps_url.c_str();
const char* SOCKET_SERVER_URL = BASE_IP;

const size_t CHUNK_SAMPLES = 2048 * 6;
const size_t CHUNK_SIZE = CHUNK_SAMPLES * 2;
bool shouldTransmitAudio = false;

const i2s_config_t i2sConfig = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
    .sample_rate = 16000,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_32BIT,
    .channel_format = I2S_CHANNEL_FMT_ONLY_RIGHT,
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