// src/modules/Audio/controllers/AudioController.ts
import { Request, Response } from "express";
import { AudioService } from "../services/AudioService";
import { AudioFileService } from "../services/AudioFileService";

export class AudioController {
    private audioFileService = new AudioFileService();

    constructor(private audioService: AudioService) {}

    async startStream(req: Request, res: Response): Promise<void> {
        try {
            this.audioService.startStream();
            res.status(200).send("OK");
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async uploadChunk(req: Request, res: Response): Promise<void> {
        try {
            const chunk = req.body as Buffer;
            const result = await this.audioService.processChunk(chunk, res);
            res.status(200).send(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async finishStream(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.audioService.finalizeStream(res);
            res.status(200).send(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async listAudioFiles(req: Request, res: Response): Promise<void> {
        try {
            const files = this.audioFileService.listAudioFiles();
            res.status(200).json(files);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getLatestAudio(req: Request, res: Response): Promise<void> {
        try {
            const latestFile = this.audioFileService.getLatestAudioFile();
            if (latestFile) {
                res.status(200).json(latestFile);
            } else {
                res.status(404).json({ message: "Nenhum arquivo de áudio encontrado" });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteAudioFile(req: Request, res: Response): Promise<void> {
        try {
            const { filename } = req.params;
            const deleted = this.audioFileService.deleteAudioFile(filename);
            
            if (deleted) {
                res.status(200).json({ message: "Arquivo deletado com sucesso" });
            } else {
                res.status(404).json({ message: "Arquivo não encontrado" });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}