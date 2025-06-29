#include "http_client.h"
#include "audio_manager.h"
#include "config.h"
#include <ArduinoJson.h>

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

bool checkDangerStatus() {
    HTTPClient http;
    http.begin("http://192.168.3.52:3000/api/v1/occurrence/list");
    
    int httpCode = http.GET();
    
    if (httpCode == 200) {
        String response = http.getString();
        
        StaticJsonDocument<2048> doc;
        DeserializationError error = deserializeJson(doc, response);
        
        if (!error && doc.size() > 0) {
            JsonObject firstOccurrence = doc[0];
            bool isInDanger = firstOccurrence["isInDanger"].as<bool>();
            
            shouldTransmitAudio = isInDanger;
            Serial.printf("Status de perigo: %s\n", isInDanger ? "EM PERIGO" : "SEGURO");
            
            http.end();
            return true;
        }
        else {
            Serial.printf("[ERRO] Falha ao analisar JSON: %s\n", error.c_str());
        }
    }
    else {
        Serial.printf("[ERRO] GET falhou: %s\n", http.errorToString(httpCode).c_str());
    }
    http.end();
    return false;
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

bool sendOccurence(const char* json) {
    HTTPClient http;
    http.begin(CREATE_OCCURENCE);
    http.addHeader("Content-Type", "application/json");
    int httpCode = http.POST(json);
    if (httpCode <= 0) {
        Serial.printf("[ERRO] POST occurrence falhou: %s\n", http.errorToString(httpCode).c_str());
    }
    String resp = http.getString();
    Serial.println("Resposta do servidor: " + resp);
    http.end();
    return (httpCode == 200);
}