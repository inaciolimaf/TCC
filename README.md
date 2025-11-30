# TCC - Mulher Segura
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/inaciolimaf/TCC)

## Overview

Mulher Segura ("Safe Woman") is a comprehensive personal safety system designed to provide a rapid response mechanism for women in distress. The project integrates a custom hardware device, a robust backend service, and a real-time monitoring web application.

The system is composed of three main parts:
1.  **`mulher-segura` (Hardware):** An ESP32-based wearable or portable device equipped with a panic button, an accelerometer for fall detection, a GPS module for location tracking, and a microphone for audio evidence collection.
2.  **`backend` (Server):** A Node.js application built with TypeScript, Express, and MongoDB. It serves as the central hub, processing data from the hardware, managing user authentication, persisting data, and facilitating real-time communication with the frontend via Socket.IO.
3.  **`frontend` (Dashboard):** A Next.js web application that provides a real-time dashboard for monitoring. Authorized users can view the device's location, see alert statuses, listen to live and recorded audio, and review the history of safety-related occurrences.

## Features

### Hardware (ESP32)
-   **Panic Button:** Allows the user to manually trigger an alert.
-   **Fall Detection:** Utilizes an MPU6050 accelerometer to automatically detect falls and trigger an alert.
-   **GPS Tracking:** Continuously sends location data to the backend.
-   **Audio Streaming:** Captures and streams audio to the backend when an alert is active, using an I2S microphone.
-   **Real-time Status Sync:** Communicates with the backend via HTTP and WebSockets to sync alert statuses.

### Backend
-   **RESTful API:** Endpoints for user management, occurrence logging, and GPS data submission.
-   **User Authentication:** Secure JWT-based authentication for dashboard access.
-   **Real-time Communication:** Uses Socket.IO to push live updates (new alerts, new audio files) to the frontend dashboard.
-   **Audio Processing:** Receives raw audio chunks from the hardware, amplifies the volume, converts them to MP3 format, and stores them for playback.
-   **Email Alerts:** Automatically sends email notifications to predefined contacts when a high-priority alert is triggered.
-   **Data Persistence:** Uses MongoDB to store user data, occurrences, GPS coordinates, and audio file metadata.

### Frontend
-   **Secure Login:** A login portal for authorized monitoring personnel.
-   **Real-time Dashboard:** Displays the user's current safety status (Safe/In Danger).
-   **Live Location Tracking:** Integrates Google Maps to show the device's current location.
-   **Live Audio & History:** A tabbed interface to switch between listening to real-time audio streams and browsing a history of recorded audio files.
-   **Occurrence History:** Displays a chronological log of all safety events, such as panic button presses and fall detections.

## Technology Stack

-   **Hardware (`mulher-segura`):**
    -   **Microcontroller:** ESP32
    -   **Framework:** Arduino on PlatformIO
    -   **Sensors:** I2S Microphone (SPH0645), MPU6050 (Accelerometer), GPS Module
    -   **Connectivity:** WiFi, WebSockets

-   **Backend (`backend`):**
    -   **Language/Runtime:** TypeScript, Node.js
    -   **Framework:** Express.js
    -   **Database:** MongoDB with Mongoose
    -   **Real-time:** Socket.IO
    -   **Authentication:** JWT (jsonwebtoken), Bcrypt
    -   **Validation:** Zod

-   **Frontend (`frontend`):**
    -   **Framework:** Next.js, React
    -   **Language:** TypeScript
    -   **Styling:** Tailwind CSS
    -   **Data Fetching:** Axios, SWR
    -   **Mapping:** `@react-google-maps/api`
    -   **Real-time:** `socket.io-client`

## Local Setup and Installation

### Prerequisites
-   Docker and Docker Compose
-   Node.js (v18 or later)
-   PlatformIO extension for Visual Studio Code (for hardware development)

### 1. Clone the Repository

```bash
git clone https://github.com/inaciolimaf/TCC.git
cd TCC
```

### 2. Start the Database
The project uses a `makefile` to simplify Docker commands. Start the MongoDB container:

```bash
make up
```
This command uses `local.yml` to build and run a MongoDB container.

### 3. Configure and Run the Backend

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Create a `.env` file in the `backend` directory and add your configuration. The backend IP should match your machine's local network IP.

    ```env
    # Server Configuration
    PORT=3000

    # Database
    MONGODB_URI="mongodb://admin:password@localhost:27017/seu_banco?authSource=admin"

    # Mailer (for email alerts)
    MAIL_HOST="smtp.example.com"
    MAIL_PORT=587
    MAIL_USER="your-email@example.com"
    MAIL_PASS="your-password"
    MAIL_NAME="Mulher Segura Alert"
    ```

4.  Run the backend server:
    ```bash
    npm run dev
    ```
    The server will be running on `http://localhost:3000`.

### 4. Configure and Run the Frontend

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Create a `.env.local` file in the `frontend` directory and add your Google Maps API key.

    ```env
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY"
    NEXT_PUBLIC_GOOGLE_MAP_ID="YOUR_GOOGLE_MAPS_MAP_ID"
    ```

4.  Run the frontend application:
    ```bash
    npm run dev
    ```
    The dashboard will be accessible at `http://localhost:3001`.

### 5. Configure and Deploy the Hardware

1.  Open the `mulher-segura` directory in Visual Studio Code with the PlatformIO extension installed.

2.  Update the network configuration in `mulher-segura/src/config.h` with your WiFi credentials.
    ```c
    #define WIFI_SSID "YOUR_WIFI_SSID"
    #define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"
    ```

3.  Update the backend server IP address in `mulher-segura/src/config.cpp`. Replace `192.168.3.52` with the local IP address of the machine running the backend.
    ```cpp
    constexpr const char* BASE_IP = "YOUR_BACKEND_IP_ADDRESS";
    ```

4.  **Hardware Wiring (ESP32 & SPH0645 Mic):**
    | SPH0645 Pin | ESP32 Pin | Description                                    |
    | :---------- | :-------- | :--------------------------------------------- |
    | 3.3V        | 3V3       | 3.3V Power Supply                              |
    | GND         | GND       | Common Ground                                  |
    | BCLK        | GPIO 26   | Bit Clock (I2S_SCK)                            |
    | LRCLK       | GPIO 25   | Word Select (I2S_WS)                           |
    | DOUT        | GPIO 22   | Audio Data Out (I2S_SD)                        |
    | SEL         | GND       | Sets to Left Channel. Connect to Ground.       |

5.  Connect the ESP32 to your computer.

6.  Use the PlatformIO CLI or the VS Code extension to build and upload the firmware to the device.



| Sph0645 | ESP32   | Observação                                                          |
|---------|--------|---------------------------------------------------------------------|
| 3.3V    | 3V3    | Fornecer 3,3 V (atenção: não use 5 V).                              |
| GND     | GND    | Terra comum do circuito.                                            |
| BCLK    | GPIO 26| Neste exemplo, vamos configurar o Bit Clock no GPIO 26.             |
| LRCLK   | GPIO 25| Neste exemplo, vamos usar o GPIO 25 como Word Select (WS).          |
| DOUT    | GPIO 22| Dados de áudio que entram no ESP32 (Data In).                       |
| SEL     | GND    | Definir para canal esquerdo (Left). Geralmente ligue em GND.        |
