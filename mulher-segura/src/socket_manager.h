#ifndef SOCKET_MANAGER_H
#define SOCKET_MANAGER_H

#include <Arduino.h>
#include <SocketIOclient.h>

void setupSocket();
void socketTask(void* parameter);
void socketIOEvent(socketIOmessageType_t type, uint8_t* payload, size_t length);

extern SocketIOclient socketIO;

#endif