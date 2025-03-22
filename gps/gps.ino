#define RXD2 16
#define TXD2 17
#define GPS_BAUD 9600

#include <TinyGPS++.h>

// Crie uma instância do TinyGPS++
TinyGPSPlus gps;
HardwareSerial gpsSerial(2);

void setup() {
  // Serial Monitor
  Serial.begin(115200);
  
  // Inicie Serial 2 com os pinos RX/TX definidos e baud rate de 9600
  gpsSerial.begin(GPS_BAUD, SERIAL_8N1, RXD2, TXD2);
  Serial.println("GPS inicializado a 9600 baud");
}

void loop() {
  // Alimente dados para o parser enquanto estiverem disponíveis
  while (gpsSerial.available() > 0) {
    Serial.println("teste:")
    char gpsData = gpsSerial.read();
    Serial.print(gpsData);
    if (gps.encode(gpsSerial.read())) {
      displayInfo();
    }
  }
  
  // Se 5 segundos se passarem e não houver caracteres (pode indicar problemas de conexão)
  if (millis() > 5000 && gps.charsProcessed() < 10) {
    Serial.println("Nenhum dado GPS recebido! Verifique a conexão.");
    delay(5000);
  }
}

void displayInfo() {
  Serial.println("------ Dados GPS ------");
  
  if (gps.location.isValid()) {
    Serial.print("Latitude: ");
    Serial.println(gps.location.lat(), 6);
    Serial.print("Longitude: ");
    Serial.println(gps.location.lng(), 6);
  } else {
    Serial.println("Posição: Não disponível");
  }
  
  if (gps.altitude.isValid()) {
    Serial.print("Altitude: ");
    Serial.print(gps.altitude.meters());
    Serial.println(" m");
  }
  
  if (gps.speed.isValid()) {
    Serial.print("Velocidade: ");
    Serial.print(gps.speed.kmph());
    Serial.println(" km/h");
  }
  
  if (gps.satellites.isValid()) {
    Serial.print("Satélites: ");
    Serial.println(gps.satellites.value());
  }
  
  if (gps.time.isValid()) {
    Serial.print("Hora: ");
    if (gps.time.hour() < 10) Serial.print("0");
    Serial.print(gps.time.hour());
    Serial.print(":");
    if (gps.time.minute() < 10) Serial.print("0");
    Serial.print(gps.time.minute());
    Serial.print(":");
    if (gps.time.second() < 10) Serial.print("0");
    Serial.println(gps.time.second());
  }
  
  Serial.println("-----------------------");
}