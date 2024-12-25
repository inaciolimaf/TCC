| Sph0645 | ESP32   | Observação                                                          |
|---------|--------|---------------------------------------------------------------------|
| 3.3V    | 3V3    | Fornecer 3,3 V (atenção: não use 5 V).                              |
| GND     | GND    | Terra comum do circuito.                                            |
| BCLK    | GPIO 26| Neste exemplo, vamos configurar o Bit Clock no GPIO 26.             |
| LRCLK   | GPIO 25| Neste exemplo, vamos usar o GPIO 25 como Word Select (WS).          |
| DOUT    | GPIO 22| Dados de áudio que entram no ESP32 (Data In).                       |
| SEL     | GND    | Definir para canal esquerdo (Left). Geralmente ligue em GND.        |

## TODO

- [] Iniciar a API
- [] Iniciar o front