#include "http_client.h"
#include "audio_manager.h"
#include "config.h"

bool sendEmptyPOST(const char* url) {
    HTTPClient http;
    http.begin(url);
    int httpCode = http.POST("");
    if (httpCode <= 0) {
        Serial.printf("[ERRO] POST %s falhou: %s\n", url, http.errorToString(httpCode).c_str());
    }
    http.end();
    return (httpCode == 200);
}

bool sendChunk(const uint8_t* data, size_t length) {
    HTTPClient http;
    http.begin(UPLOAD_CHUNK_URL);
    http.addHeader("Content-Type", "application/octet-stream");
    int httpCode = http.POST(const_cast<uint8_t*>(data), length);
    if (httpCode <= 0) {
        Serial.printf("[ERRO] POST chunk falhou: %s\n", http.errorToString(httpCode).c_str());
    }
    String resp = http.getString();
    Serial.println("Resposta do servidor: " + resp);
    http.end();
    return (httpCode == 200);
}

bool startStreamSession() {
    if (!sendEmptyPOST(START_STREAM_URL)) {
        Serial.println("[ERRO] Falha ao iniciar stream no servidor!");
        return false;
    }
    return true;
}

bool endStreamSession() {
    if (!sendEmptyPOST(FINISH_STREAM_URL)) {
        Serial.println("[ERRO] Falha ao finalizar stream no servidor!");
        return false;
    }
    return true;
}

uint8_t* receiveAudioChunk() {
    uint8_t* receivedChunk = NULL;
    
    if (xQueueReceive(audioQueue, &receivedChunk, portMAX_DELAY) != pdTRUE) {
        return NULL;
    }
    
    return receivedChunk;
}

bool processAndSendChunk(uint8_t* chunk) {
    if (chunk == NULL) {
        return false;
    }
    
    Serial.printf("Enviando chunk (%d bytes)...\n", (int)CHUNK_SIZE);
    if (!sendChunk(chunk, CHUNK_SIZE)) {
        Serial.println("[ERRO] Falha ao enviar chunk!");
        return false;
    }
    return true;
}

void returnChunkToPool(uint8_t* chunk) {
    xQueueSend(buffersQueue, &chunk, 0);
}

void sendHTTPTask(void* parameter) {
    startStreamSession();
    while (true) {
        uint8_t* chunk = receiveAudioChunk();
        
        if (chunk != NULL) {
            processAndSendChunk(chunk);
            returnChunkToPool(chunk);
        }
    }
}