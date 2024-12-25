#include "config.h"

const char* START_STREAM_URL = "http://192.168.3.3:3000/start-stream";
const char* UPLOAD_CHUNK_URL = "http://192.168.3.3:3000/upload-chunk";
const char* FINISH_STREAM_URL = "http://192.168.3.3:3000/finish-stream";

const size_t CHUNK_SAMPLES = 2048*6;
const size_t CHUNK_SIZE = CHUNK_SAMPLES * 2;