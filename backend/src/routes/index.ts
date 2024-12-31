import { Router } from "express";
import userRouter from "../modules/User/routes/userRoutes";
import loginRouter from "../modules/Login/routes/LoginRoutes";

const routes = Router();

routes.use("/api/v1", [
    userRouter,
    loginRouter,
    // quadraRouter,
    // agendamentoRouter
]);

export default routes;
