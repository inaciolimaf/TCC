import { Router } from "express";
import { ensureAuthenticate } from "../../../middlewares/ensureAuthenticate/ensureAuthenticate";
import userContainer from "../containers/userContainers";

const userRouter = Router();
const userController = userContainer.userController;
userRouter.post("/user/create", userController.create.bind(userController));
userRouter.post(
    "/user/list",
    ensureAuthenticate,
    userController.list.bind(userController)
);
userRouter.get(
    "/user/show",
    ensureAuthenticate,
    userController.list.bind(userController)
);

export default userRouter;
