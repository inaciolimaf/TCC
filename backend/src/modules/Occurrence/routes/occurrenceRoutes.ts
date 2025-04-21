import { Router } from "express";
import occurrenceContainer from "../containers/occurrenceContainer";

const occurrenceRouter = Router();
const occurrenceController = occurrenceContainer.occurrenceController;

occurrenceRouter.post(
    "/occurrence/create",
    occurrenceController.create.bind(occurrenceController)
);
occurrenceRouter.get(
    "/occurrence/list",
    occurrenceController.list.bind(occurrenceController)
);

export default occurrenceRouter;
