// src/services/socketService.ts
import io, { Socket } from 'socket.io-client';

export interface AudioFileInfo {
    filename: string;
    url: string;
    createdAt: Date;
    size: number;
}

class SocketService {
    private socket: any = null;
    private listeners: Map<string, Function[]> = new Map();

    connect() {
        if (this.socket?.connected) return;

        this.socket = io('http://localhost:3000', {
            transports: ['websocket'],
            autoConnect: true,
        });

        this.socket.on('connect', () => {
            console.log('Conectado ao servidor WebSocket');
        });

        this.socket.on('disconnect', () => {
            console.log('Desconectado do servidor WebSocket');
        });

        this.socket.on('new-audio', (audioInfo: AudioFileInfo) => {
            console.log('Novo áudio recebido:', audioInfo);
            this.notifyListeners('new-audio', audioInfo);
        });

        this.socket.on('connect_error', (error: Error) => {
            console.error('Erro de conexão WebSocket:', error);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    onNewAudio(callback: (audioInfo: AudioFileInfo) => void) {
        this.addEventListener('new-audio', callback);
    }

    removeNewAudioListener(callback: (audioInfo: AudioFileInfo) => void) {
        this.removeEventListener('new-audio', callback);
    }

    private addEventListener(event: string, callback: Function) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push(callback);
    }

    private removeEventListener(event: string, callback: Function) {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            const index = eventListeners.indexOf(callback);
            if (index > -1) {
                eventListeners.splice(index, 1);
            }
        }
    }

    private notifyListeners(event: string, data: any) {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            eventListeners.forEach(callback => callback(data));
        }
    }
}

export const socketService = new SocketService();