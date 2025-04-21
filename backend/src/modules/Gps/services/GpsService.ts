import { AppError } from "../../../middlewares/errors/AppError";
import IGPS from "../../../models/dtos/IGPS";
import { GpsReq } from "../dtos/GpsReq";
import IGpsRepository from "../repositories/IGpsRepository";

export class GpsService {
    gpsRepository: IGpsRepository;

    constructor(gpsRepository: IGpsRepository) {
        this.gpsRepository = gpsRepository;
    }

    public async createGps(dataGps: GpsReq): Promise<IGPS> {
        try {
            const savedGps = await this.gpsRepository.createGps({
                latitude: dataGps.latitude,
                longitude: dataGps.longitude,
            });
            return savedGps;
        } catch (err) {
            throw new AppError(`${err}`, 404);
        }
    }

    public async listGps(): Promise<IGPS[]> {
        try {
            const gpsData = await this.gpsRepository.listGps();
            return gpsData;
        } catch (err) {
            throw new AppError(`${err}`, 404);
        }
    }
}
