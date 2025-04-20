import { Router } from "express";
import { AudioController } from "../controllers/AudioController";
import { AudioService } from "../services/AudioService";
import express from "express";

const audioRouter = Router();
const audioService = new AudioService();
const audioController = new AudioController(audioService);

audioRouter.use(
    express.raw({ type: "application/octet-stream", limit: "10mb" })
);

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

export default audioRouter;
