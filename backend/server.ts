import express, { Request, Response } from "express";
import multer from "multer";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

const app = express();
const upload = multer();
const PORT = process.env.PORT || 3000;
// Função para finalizar o stream
const finalizeStream = (res: Response) => {
    const fullBuffer = Buffer.concat(streamingBuffers);
    console.log(
        "[LOG] Finalizando stream. Tamanho total:",
        fullBuffer.length,
        "bytes"
    );
    if (fullBuffer.length === 0) {
        return res.status(400).send("Nenhum dado acumulado.");
    }
    const tmpInputFile = path.join(__dirname, "temp_stream.raw");
    fs.writeFileSync(tmpInputFile, fullBuffer);
    console.log("[LOG] Arquivo temporário criado:", tmpInputFile);

    // Nome de saída MP3
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const outputFile = path.join(__dirname, `audio_stream_${timestamp}.mp3`);

    // Chamamos ffmpeg, informando que o input é raw s16le, 16kHz, 1 canal
    ffmpeg(tmpInputFile)
        .inputOptions([
            "-f s32le", // 32 bits PCM
            "-ar 16000", // Sample rate 16k
            "-ac 1", // 1 canal
        ])
        .audioCodec("libmp3lame")
        .audioBitrate("128k")
        .on("start", (cmd) => {
            console.log("[LOG] ffmpeg start:", cmd);
        })
        .on("progress", (progress) => {
            console.log("[LOG] ffmpeg progresso:", progress.timemark);
        })
        .on("error", (err) => {
            console.error("[ERRO] ffmpeg:", err.message);
            // Apaga o arquivo temporário (opcional)
            fs.unlinkSync(tmpInputFile);
            return res.status(500).send("Erro ao converter o áudio.");
        })
        .on("end", () => {
            console.log(
                "[LOG] Conversão finalizada. Arquivo salvo em:",
                outputFile
            );
            // fs.unlinkSync(tmpInputFile); // remove o arquivo .raw
            // Opcionalmente, pode limpar o “streamingBuffers”
            streamingBuffers = [];
            return res.status(200).send(`OK! Áudio salvo em: ${outputFile}`);
        })
        .save(outputFile);
};
// Buffer global para simular um "stream" único.
// Em produção, você pode querer algo multi-cliente (map<id, buffer>) etc.
let streamingBuffers: Buffer[] = [];
app.use(express.raw({ type: "application/octet-stream", limit: "10mb" }));
/** Apenas para log */
app.use((req, res, next) => {
    console.log(`[LOG] ${req.method} ${req.url}`);
    next();
});

/**

Inicia uma nova sessão de streaming, limpando o array
*/
app.post("/start-stream", (req: Request, res: Response) => {
    streamingBuffers = []; // limpa
    console.log("[LOG] Novo stream iniciado. Buffer resetado.");
    return res.status(200).send("OK");
});
/**

2) Recebe um chunk de áudio bruto (raw PCM 16bits). Vamos acumular em “streamingBuffers”.
*/
app.post("/upload-chunk", (req: Request, res: Response) => {
    const chunk = req.body as Buffer; // express.raw retorna Buffer
    console.log("[LOG] Chunk recebido:", chunk);

    if (!chunk || chunk.length === 0) {
        console.error("[ERRO] Nenhum chunk recebido!");
        return res.status(400).send("Nenhum chunk recebido.");
    }

    streamingBuffers.push(chunk);
    const totalBufferSize = streamingBuffers.reduce(
        (acc, b) => acc + b.length,
        0
    );

    console.log("[LOG] Recebido chunk de", chunk.length, "bytes");
    console.log("[LOG] Tamanho total acumulado:", totalBufferSize, "bytes");

    // Verifica se o tamanho acumulado atinge ou excede 1MB (1,048,576 bytes)
    const ONE_MB = 1 * 1024 * 1024; // 1MB em bytes

    if (totalBufferSize >= ONE_MB) {
        console.log(
            "[LOG] Tamanho do buffer atingiu 1MB. Finalizando o stream automaticamente."
        );
        // Como finalizeStream envia uma resposta, retornamos aqui para evitar enviar múltiplas respostas
        return finalizeStream(res);
    }

    return res
        .status(200)
        .send(
            `Chunk armazenado. Tamanho total até agora: ${totalBufferSize} bytes`
        );
}); /**

3) Finaliza o streaming: concatena tudo em um arquivo .raw e invoca ffmpeg
*/
app.post("/finish-stream", async (req: Request, res: Response) => {
    const fullBuffer = Buffer.concat(streamingBuffers);
    console.log(
        "[LOG] Finalizando stream. Tamanho total:",
        fullBuffer.length,
        "bytes"
    );
    if (fullBuffer.length === 0) {
        return res.status(400).send("Nenhum dado acumulado.");
    }
    const tmpInputFile = path.join(__dirname, "temp_stream.raw");
    fs.writeFileSync(tmpInputFile, fullBuffer);
    console.log("[LOG] Arquivo temporário criado:", tmpInputFile);

    // Nome de saída MP3
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const outputFile = path.join(__dirname, `audio_stream_${timestamp}.mp3`);

    // Chamamos ffmpeg, informando que o input é raw s16le, 16kHz, 1 canal
    ffmpeg(tmpInputFile)
        .inputOptions([
            "-f s32le", // 32 bits PCM
            "-ar 16000", // Sample rate 16k
            "-ac 1", // 1 canal
        ])
        .audioCodec("libmp3lame")
        .audioBitrate("128k")
        .on("start", (cmd) => {
            console.log("[LOG] ffmpeg start:", cmd);
        })
        .on("progress", (progress) => {
            console.log("[LOG] ffmpeg progresso:", progress.timemark);
        })
        .on("error", (err) => {
            console.error("[ERRO] ffmpeg:", err.message);
            // Apaga o arquivo temporário (opcional)
            fs.unlinkSync(tmpInputFile);
            return res.status(500).send("Erro ao converter o áudio.");
        })
        .on("end", () => {
            console.log(
                "[LOG] Conversão finalizada. Arquivo salvo em:",
                outputFile
            );
            fs.unlinkSync(tmpInputFile); // remove o arquivo .raw
            // Opcionalmente, pode limpar o “streamingBuffers”
            streamingBuffers = [];
            return res.status(200).send(`OK! Áudio salvo em: ${outputFile}`);
        })
        .save(outputFile);
});

// Inicializa o servidor
app.listen(PORT, () => {
    console.log(`[LOG] Servidor rodando na porta ${PORT}.`);
});
