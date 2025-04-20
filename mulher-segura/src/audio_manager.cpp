#include "audio_manager.h"
#include "driver/i2s.h"
#include "config.h"

void setupI2S() {
    i2s_driver_install(I2S_NUM_0, &i2sConfig, 0, NULL);
    i2s_set_pin(I2S_NUM_0, &pinConfig);
    i2s_set_clk(I2S_NUM_0, 16000, I2S_BITS_PER_SAMPLE_32BIT, I2S_CHANNEL_MONO);
}

void ReadI2STask(void* parameter) {
    uint8_t* chunkBuffer = (uint8_t*)malloc(CHUNK_SIZE);
    if (chunkBuffer == NULL) {
        Serial.println("[ERRO] Falha na alocação de memória para chunkBuffer!");
        vTaskDelete(NULL);
    }

    while (true) {
        memset(chunkBuffer, 0, CHUNK_SIZE);
        size_t bytesLeft = CHUNK_SIZE;
        size_t offset = 0;
        
        while (bytesLeft > 0) {
            size_t bytesRead = 0;
            i2s_read(I2S_NUM_0, chunkBuffer + offset, bytesLeft, &bytesRead, portMAX_DELAY);
            offset += bytesRead;
            bytesLeft -= bytesRead;
        }
        
        uint8_t* bufferToSend = NULL;
        // Tenta obter um buffer do pool; se não houver, aguarda um tempo ou trata o erro
        if (xQueueReceive(buffersQueue, &bufferToSend, pdMS_TO_TICKS(10)) != pdPASS) {
            Serial.println("[ERRO] Nenhum buffer disponível no pool!");
            continue;
        }
        
        memcpy(bufferToSend, chunkBuffer, CHUNK_SIZE);
        
        if (xQueueSend(audioQueue, &bufferToSend, (TickType_t)10) != pdPASS) {
            Serial.println("[WARN] Fila cheia! Chunk descartado.");
            // Devolve o buffer para o pool para reutilização
            xQueueSend(buffersQueue, &bufferToSend, 0);
        }
        
        vTaskDelay(pdMS_TO_TICKS(1));
    }

    free(chunkBuffer);
    vTaskDelete(NULL);
}