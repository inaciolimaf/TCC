import IGPS from "../../../models/dtos/IGPS";
import GpsMongo from "../../../models/mongo/Gps";
import { AppError } from "../../../middlewares/errors/AppError";
import IGpsRepository from "./IGpsRepository";

export default class GpsMongoRepository implements IGpsRepository {
    public async createGps(data: {
        latitude: number;
        longitude: number;
    }): Promise<IGPS> {
        try {
            const newGps = new GpsMongo({
                latitude: data.latitude,
                longitude: data.longitude,
            });
            const savedGps = await newGps.save();
            return savedGps;
        } catch (err) {
            throw new AppError("Erro ao salvar dados de GPS", 404);
        }
    }

    public async listGps(limit: number = 3): Promise<IGPS[]> {
        try {
            const gpsData = await GpsMongo.find()
                .sort({ creationDate: -1 })
                .limit(limit);
            return gpsData;
        } catch (err) {
            throw new AppError("Erro ao buscar dados de GPS", 404);
        }
    }
}
