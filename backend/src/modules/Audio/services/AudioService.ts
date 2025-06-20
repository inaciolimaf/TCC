// src/modules/Audio/services/AudioService.ts
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import { Response } from "express";
import { io } from "../../../app";
import { AudioFileService } from "./AudioFileService";

export class AudioService {
    private streamingBuffers: Buffer[] = [];
    private audioFileService = new AudioFileService();

    public startStream(): void {
        this.streamingBuffers = [];
    }

    public async processChunk(chunk: Buffer, res: Response): Promise<string> {
        if (!chunk || chunk.length === 0) {
            throw new Error("Nenhum chunk recebido.");
        }

        this.streamingBuffers.push(chunk);
        const totalBufferSize = this.streamingBuffers.reduce(
            (acc, b) => acc + b.length,
            0
        );

        const ONE_MB = 1 * 1024 * 1024;
        if (totalBufferSize >= ONE_MB) {
            return this.finalizeStream(res);
        }
        console.log(`Tamanho total do buffer: ${totalBufferSize} bytes`);
        
        return `Chunk armazenado. Tamanho total até agora: ${totalBufferSize} bytes`;
    }

    public async finalizeStream(res: Response): Promise<string> {
        const fullBuffer = Buffer.concat(this.streamingBuffers);
        if (fullBuffer.length === 0) {
            throw new Error("Nenhum dado acumulado.");
        }

        // Criar diretório temp se não existir
        const tempDir = path.join(__dirname, "../../../../temp");
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const tmpInputFile = path.join(tempDir, "temp_stream.raw");
        fs.writeFileSync(tmpInputFile, fullBuffer);

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const filename = `audio_stream_${timestamp}.mp3`;
        const outputFile = path.join(tempDir, filename);

        return new Promise((resolve, reject) => {
            ffmpeg(tmpInputFile)
                .inputOptions(["-f s32le", "-ar 16000", "-ac 1"])
                .audioCodec("libmp3lame")
                .audioBitrate("128k")
                .audioFilters(["volume=15dB"])
                .on("error", (err) => {
                    if (fs.existsSync(tmpInputFile)) {
                        fs.unlinkSync(tmpInputFile);
                    }
                    reject(err);
                })
                .on("end", () => {
                    if (fs.existsSync(tmpInputFile)) {
                        fs.unlinkSync(tmpInputFile);
                    }
                    this.streamingBuffers = [];

                    // Notificar clientes conectados sobre o novo áudio
                    const audioInfo = {
                        filename,
                        url: `/audio-files/${filename}`,
                        createdAt: new Date(),
                        size: fs.statSync(outputFile).size
                    };

                    io.emit('new-audio', audioInfo);
                    console.log('Novo áudio disponível:', audioInfo);

                    resolve(`OK! Áudio salvo em: ${outputFile}`);
                })
                .save(outputFile);
        });
    }
}