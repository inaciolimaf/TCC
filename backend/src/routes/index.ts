import { Router } from "express";
import userRouter from "../modules/User/routes/userRoutes";
import loginRouter from "../modules/Login/routes/LoginRoutes";
import audioRouter from "../modules/Audio/routes/audioRoutes";

const routes = Router();

routes.use("/api/v1", [
    userRouter,
    loginRouter,
    audioRouter,
]);

export default routes;
