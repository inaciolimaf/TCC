import { Request, Response } from "express";
import { AudioService } from "../services/AudioService";

export class AudioController {
    constructor(private audioService: AudioService) {}

    async startStream(req: Request, res: Response): Promise<void> {
        try {
            this.audioService.startStream();
            res.status(200).send("OK");
        } catch (error:any) {
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
}
