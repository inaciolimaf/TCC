import { Router } from "express";
import userRouter from "../modules/User/routes/userRoutes";
import loginRouter from "../modules/Login/routes/LoginRoutes";
import audioRouter from "../modules/Audio/routes/audioRoutes";
import gpsRouter from "../modules/Gps/routes/gpsRoutes";

const routes = Router();

routes.use("/api/v1", [userRouter, loginRouter, audioRouter, gpsRouter]);

export default routes;
