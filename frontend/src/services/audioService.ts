// src/services/audioService.ts
import axios from 'axios';
import { AudioFileInfo } from './socketService';

class AudioApiService {
    private baseURL = 'http://localhost:3000/api/v1';

    async getAudioFiles(token: string): Promise<AudioFileInfo[]> {
        try {
            const response = await axios.get(`${this.baseURL}/audio/list`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar arquivos de áudio:', error);
            return [];
        }
    }

    async getLatestAudio(token: string): Promise<AudioFileInfo | null> {
        try {
            const response = await axios.get(`${this.baseURL}/audio/latest`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar último áudio:', error);
            return null;
        }
    }

    async deleteAudioFile(filename: string, token: string): Promise<boolean> {
        try {
            await axios.delete(`${this.baseURL}/audio/${filename}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return true;
        } catch (error) {
            console.error('Erro ao deletar arquivo de áudio:', error);
            return false;
        }
    }

    getAudioUrl(filename: string): string {
        return `http://localhost:3000/audio-files/${filename}`;
    }
}

export const audioApiService = new AudioApiService();