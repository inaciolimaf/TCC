import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import { Response } from "express";

export class AudioService {
    private streamingBuffers: Buffer[] = [];

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

        return `Chunk armazenado. Tamanho total até agora: ${totalBufferSize} bytes`;
    }

    public async finalizeStream(res: Response): Promise<string> {
        const fullBuffer = Buffer.concat(this.streamingBuffers);
        if (fullBuffer.length === 0) {
            throw new Error("Nenhum dado acumulado.");
        }

        const tmpInputFile = path.join(__dirname, "temp_stream.raw");
        fs.writeFileSync(tmpInputFile, fullBuffer);

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const outputFile = path.join(
            __dirname,
            `audio_stream_${timestamp}.mp3`
        );

        return new Promise((resolve, reject) => {
            ffmpeg(tmpInputFile)
                .inputOptions(["-f s32le", "-ar 16000", "-ac 1"])
                .audioCodec("libmp3lame")
                .audioBitrate("128k")
                .audioFilters(["volume=15dB"])
                .on("error", (err) => {
                    fs.unlinkSync(tmpInputFile);
                    reject(err);
                })
                .on("end", () => {
                    fs.unlinkSync(tmpInputFile);
                    this.streamingBuffers = [];
                    resolve(`OK! Áudio salvo em: ${outputFile}`);
                })
                .save(outputFile);
        });
    }
}
