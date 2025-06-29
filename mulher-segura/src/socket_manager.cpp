#include "socket_manager.h"
#include "config.h"
#include <WiFi.h>
#include <ArduinoJson.h>

SocketIOclient socketIO;

void socketIOEvent(socketIOmessageType_t type, uint8_t* payload, size_t length) {
    switch(type) {
        case sIOtype_DISCONNECT:
            Serial.println("[Socket.IO] Desconectado!");
            break;
            
        case sIOtype_CONNECT:
            Serial.println("[Socket.IO] Conectado!");
            // Quando conectar, pode enviar alguma mensagem se necessário
            socketIO.send(sIOtype_CONNECT, "/");
            break;
            
        case sIOtype_EVENT: {
            Serial.printf("[Socket.IO] Evento recebido: %s\n", payload);
            // Parse do JSON para identificar o tipo de evento
            DynamicJsonDocument doc(1024);
            deserializeJson(doc, payload);
            
            if (doc.is<JsonArray>()) {
                JsonArray array = doc.as<JsonArray>();
                if (array.size() >= 1) {
                    String eventName = array[0];
                    JsonObject eventData = array[1];
                    
                    if (eventName == "new-occurrence") {
                        Serial.println("🚨 [NOTIFICAÇÃO] Nova ocorrência detectada!");
                        Serial.printf("ID: %s\n", eventData["id"].as<String>().c_str());
                        Serial.printf("Em Perigo: %s\n", eventData["isInDanger"].as<bool>() ? "SIM" : "NÃO");
                        Serial.printf("Motivo: %s\n", eventData["reason"].as<String>().c_str());
                        Serial.printf("Data: %s\n", eventData["creationDate"].as<String>().c_str());
                        Serial.println("=======================================");
                        shouldTransmitAudio = eventData["isInDanger"].as<bool>();
                    }
                    else if (eventName == "new-audio") {
                        Serial.println("🎵 [NOTIFICAÇÃO] Novo áudio disponível!");
                        Serial.printf("Arquivo: %s\n", eventData["filename"].as<String>().c_str());
                        Serial.printf("URL: %s\n", eventData["url"].as<String>().c_str());
                        Serial.printf("Tamanho: %d bytes\n", eventData["size"].as<int>());
                        Serial.println("=======================================");
                    }
                    else {
                        Serial.printf("[Socket.IO] Evento desconhecido: %s\n", eventName.c_str());
                    }
                }
            }
            break;
        }
        
        case sIOtype_ACK:
            Serial.printf("[Socket.IO] ACK: %s\n", payload);
            break;
            
        case sIOtype_ERROR:
            Serial.printf("[Socket.IO] ERRO: %s\n", payload);
            break;
            
        case sIOtype_BINARY_EVENT:
            Serial.printf("[Socket.IO] Evento binário recebido\n");
            break;
            
        case sIOtype_BINARY_ACK:
            Serial.printf("[Socket.IO] ACK binário recebido\n");
            break;
            
        default:
            Serial.printf("[Socket.IO] Tipo desconhecido: %d\n", type);
            break;
    }
}

void setupSocket() {
    // Configurar o Socket.IO
    socketIO.begin(SOCKET_SERVER_URL, 3000, "/socket.io/?EIO=4");
    socketIO.onEvent(socketIOEvent);
    
    Serial.println("[Socket.IO] Cliente configurado");
}

void socketTask(void* parameter) {
    while (true) {
        // Verificar se WiFi está conectado
        if (WiFi.status() == WL_CONNECTED) {
            socketIO.loop();
        } else {
            Serial.println("[Socket.IO] WiFi desconectado, aguardando reconexão...");
            vTaskDelay(5000 / portTICK_PERIOD_MS);
        }
        
        // Pequeno delay para não sobrecarregar
        vTaskDelay(10 / portTICK_PERIOD_MS);
    }
}