#ifndef HTTP_CLIENT_H
#define HTTP_CLIENT_H

#include <Arduino.h>
#include <HTTPClient.h>
#include "config.h"

bool sendEmptyPOST(const char* url);
bool sendChunk(const uint8_t* data, size_t length);
void sendHTTPTask(void* parameter);
bool sendOccurence(const char* json);

#endif