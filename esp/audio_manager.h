#ifndef AUDIO_MANAGER_H
#define AUDIO_MANAGER_H

#include <Arduino.h>
#include "driver/i2s.h"
#include "config.h"

extern QueueHandle_t audioQueue;

void setupI2S();
void ReadI2STask(void* parameter);

#endif