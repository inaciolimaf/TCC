#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>

Adafruit_MPU6050 mpu;

// Constantes para detecção de queda
const float THRESHOLD_FALL = 3.0;  // Limiar de aceleração para detectar queda (em G's)
const float THRESHOLD_IMPACT = 3.0; // Limiar de impacto (em G's)
const int TEMPO_MINIMO_QUEDA = 50;  // Tempo mínimo de queda (em ms)

// Variáveis para controle
bool quedaEmProgresso = false;
unsigned long tempoInicioQueda = 0;
bool alertaEnviado = false;

void setup(void) {
  Serial.begin(115200);
  while (!Serial)
    delay(10);

  Serial.println("Sistema de Detecção de Quedas - MPU6050");

  if (!mpu.begin()) {
    Serial.println("Falha ao encontrar o chip MPU6050");
  }
  Serial.println("MPU6050 Encontrado!");

  // Configuração do acelerômetro para ±16G
  mpu.setAccelerometerRange(MPU6050_RANGE_16_G);
  
  // Configuração do giroscópio
  mpu.setGyroRange(MPU6050_RANGE_2000_DEG);
  
  // Configuração do filtro
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);

  delay(100);
}

float calcularAceleracaoTotal(sensors_event_t& a) {
  float accelTotal = sqrt(a.acceleration.x * a.acceleration.x +
                         a.acceleration.y * a.acceleration.y +
                         a.acceleration.z * a.acceleration.z);
  return accelTotal / 9.81; // Converte para G's
}

void verificarQueda(float aceleracaoTotal) {
  if (!quedaEmProgresso && aceleracaoTotal < THRESHOLD_FALL) {
    // Início de possível queda detectado
    quedaEmProgresso = true;
    tempoInicioQueda = millis();
    Serial.println("Possível queda detectada!");
  }
  
  if (quedaEmProgresso) {
    unsigned long tempoDecorrido = millis() - tempoInicioQueda;
    
    if (tempoDecorrido >= TEMPO_MINIMO_QUEDA) {
      if (aceleracaoTotal > THRESHOLD_IMPACT && !alertaEnviado) {
        // Impacto detectado após queda
        Serial.println("ALERTA: QUEDA DETECTADA!");
        Serial.print("Força do impacto (G): ");
        Serial.println(aceleracaoTotal);
        alertaEnviado = true;
        
        // Aqui você pode adicionar outras ações como:
        // - Ativar um buzzer
        // - Enviar uma mensagem SMS
        // - Acionar um LED
      }
    }
    
    // Reset após 1 segundo
    if (tempoDecorrido > 1000) {
      quedaEmProgresso = false;
      alertaEnviado = false;
    }
  }
}

void loop() {
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  float aceleracaoTotal = calcularAceleracaoTotal(a);
  
  verificarQueda(aceleracaoTotal);

  // Debug - imprime valores
  // Serial.print("Aceleração Total (G): ");
  // Serial.println(aceleracaoTotal);

  delay(10); // Pequeno delay para não sobrecarregar a serial
}