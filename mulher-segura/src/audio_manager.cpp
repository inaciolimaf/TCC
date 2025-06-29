#include "audio_manager.h"
#include "driver/i2s.h"
#include "config.h"

void setupI2S() {
    i2s_driver_install(I2S_NUM_0, &i2sConfig, 0, NULL);
    i2s_set_pin(I2S_NUM_0, &pinConfig);
    i2s_set_clk(I2S_NUM_0, 16000, I2S_BITS_PER_SAMPLE_32BIT, I2S_CHANNEL_MONO);
}

bool allocateChunkBuffer(uint8_t** chunkBuffer) {
    *chunkBuffer = (uint8_t*)malloc(CHUNK_SIZE);
    if (*chunkBuffer == NULL) {
        Serial.println("[ERRO] Falha na alocação de memória para chunkBuffer!");
        return false;
    }
    return true;
}

bool getBufferFromPool(uint8_t** bufferToSend) {
    if (xQueueReceive(buffersQueue, bufferToSend, pdMS_TO_TICKS(10)) != pdPASS) {
        Serial.println("[ERRO] Nenhum buffer disponível no pool!");
        return false;
    }
    return true;
}

void sendBufferToQueue(uint8_t* bufferToSend) {
    if (xQueueSend(audioQueue, &bufferToSend, (TickType_t)10) != pdPASS) {
        Serial.println("[WARN] Fila cheia! Chunk descartado.");
        xQueueSend(buffersQueue, &bufferToSend, 0);
    }
}

size_t readAudioChunk(uint8_t* chunkBuffer) {
    memset(chunkBuffer, 0, CHUNK_SIZE);
    size_t bytesLeft = CHUNK_SIZE;
    size_t offset = 0;
    
    while (bytesLeft > 0) {
        size_t bytesRead = 0;
        i2s_read(I2S_NUM_0, chunkBuffer + offset, bytesLeft, &bytesRead, portMAX_DELAY);
        offset += bytesRead;
        bytesLeft -= bytesRead;
    }
    
    return offset;
}

void ReadI2STask(void* parameter) {
    uint8_t* chunkBuffer = NULL;
    
    if (!allocateChunkBuffer(&chunkBuffer)) {
        vTaskDelete(NULL);
        return;
    }
    
    while (true) {
        while (shouldTransmitAudio==0) {
            vTaskDelay(pdMS_TO_TICKS(10));
        }
        
        readAudioChunk(chunkBuffer);
        uint8_t* bufferToSend = NULL;
        if (!getBufferFromPool(&bufferToSend)) {
            continue;
        }
        
        memcpy(bufferToSend, chunkBuffer, CHUNK_SIZE);
        sendBufferToQueue(bufferToSend);
        
        vTaskDelay(pdMS_TO_TICKS(1));
    }

    free(chunkBuffer);
    vTaskDelete(NULL);
}