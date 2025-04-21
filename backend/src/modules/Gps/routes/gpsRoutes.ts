import { Router } from "express";
import { ensureAuthenticate } from "../../../middlewares/ensureAuthenticate/ensureAuthenticate";
import gpsContainer from "../containers/gpsContainer";

const gpsRouter = Router();
const gpsController = gpsContainer.gpsController;

gpsRouter.post("/gps/create", gpsController.create.bind(gpsController));
gpsRouter.get(
    "/gps/list",
    ensureAuthenticate,
    gpsController.list.bind(gpsController)
);

export default gpsRouter;
