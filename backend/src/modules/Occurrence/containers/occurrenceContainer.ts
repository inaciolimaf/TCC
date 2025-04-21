import IOccurrenceRepository from "../repositories/IOccurrenceRepository";
import OccurrenceMongoRepository from "../repositories/OccurrenceMongoRepository";
import { OccurrenceService } from "../services/OccurrenceService";
import { OccurrenceController } from "../controllers/OccurrenceController";

const occurrenceRepository: IOccurrenceRepository =
    new OccurrenceMongoRepository();
const occurrenceService = new OccurrenceService(occurrenceRepository);
const occurrenceController = new OccurrenceController(occurrenceService);

const occurrenceContainer = {
    occurrenceRepository,
    occurrenceService,
    occurrenceController,
};

export default occurrenceContainer;
