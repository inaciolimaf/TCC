import { GpsController } from "../controllers/GpsController";
import IGpsRepository from "../repositories/IGpsRepository";
import GpsMongoRepository from "../repositories/GpsMongoRepository";
import { GpsService } from "../services/GpsService";

const gpsRepository: IGpsRepository = new GpsMongoRepository();
const gpsService = new GpsService(gpsRepository);
const gpsController = new GpsController(gpsService);

const gpsContainer = {
    gpsRepository,
    gpsService,
    gpsController,
};

export default gpsContainer;
