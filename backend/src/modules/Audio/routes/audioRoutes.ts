// src/modules/Audio/routes/audioRoutes.ts
import { Router } from "express";
import { AudioController } from "../controllers/AudioController";
import { AudioService } from "../services/AudioService";
import express from "express";
import { ensureAuthenticate } from "../../../middlewares/ensureAuthenticate/ensureAuthenticate";

const audioRouter = Router();
const audioService = new AudioService();
const audioController = new AudioController(audioService);

// Middleware para dados binários
audioRouter.use(
    "/upload-chunk",
    express.raw({ type: "application/octet-stream", limit: "10mb" })
);

// Rotas de streaming
audioRouter.post(
    "/start-stream",
    audioController.startStream.bind(audioController)
);
audioRouter.post(
    "/upload-chunk",
    audioController.uploadChunk.bind(audioController)
);
audioRouter.post(
    "/finish-stream",
    audioController.finishStream.bind(audioController)
);

// Rotas para gerenciar arquivos de áudio
audioRouter.get(
    "/audio/list",
    ensureAuthenticate,
    audioController.listAudioFiles.bind(audioController)
);
audioRouter.get(
    "/audio/latest",
    ensureAuthenticate,
    audioController.getLatestAudio.bind(audioController)
);
audioRouter.delete(
    "/audio/:filename",
    ensureAuthenticate,
    audioController.deleteAudioFile.bind(audioController)
);

export default audioRouter;