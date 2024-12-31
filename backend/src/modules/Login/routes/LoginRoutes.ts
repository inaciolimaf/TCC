import { Router } from "express";

import loginContainer from "../containers/loginContainer";

const loginRouter = Router();
const loginController = loginContainer.loginController;

loginRouter.post("/login", loginController.login.bind(loginController));

export default loginRouter;
