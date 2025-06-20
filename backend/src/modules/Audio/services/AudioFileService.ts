// src/modules/Audio/services/AudioFileService.ts
import fs from "fs";
import path from "path";

export interface AudioFileInfo {
    filename: string;
    filepath: string;
    size: number;
    createdAt: Date;
    url: string;
}

export class AudioFileService {
    private audioDirectory = path.join(__dirname, "../../../../temp");

    public listAudioFiles(): AudioFileInfo[] {
        try {
            if (!fs.existsSync(this.audioDirectory)) {
                fs.mkdirSync(this.audioDirectory, { recursive: true });
                return [];
            }

            const files = fs.readdirSync(this.audioDirectory);
            const audioFiles = files.filter(file => 
                file.endsWith('.mp3') || file.endsWith('.wav')
            );

            return audioFiles.map(filename => {
                const filepath = path.join(this.audioDirectory, filename);
                const stats = fs.statSync(filepath);
                
                return {
                    filename,
                    filepath,
                    size: stats.size,
                    createdAt: stats.birthtime,
                    url: `/audio-files/${filename}`
                };
            }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        } catch (error) {
            console.error('Erro ao listar arquivos de áudio:', error);
            return [];
        }
    }

    public getLatestAudioFile(): AudioFileInfo | null {
        const files = this.listAudioFiles();
        return files.length > 0 ? files[0] : null;
    }

    public deleteAudioFile(filename: string): boolean {
        try {
            const filepath = path.join(this.audioDirectory, filename);
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Erro ao deletar arquivo:', error);
            return false;
        }
    }
}