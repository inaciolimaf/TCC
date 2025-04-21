import { NextFunction, Request, Response } from "express";
import { GpsService } from "../services/GpsService";
import { gpsSchema } from "../schema/gpsSchema";

export class GpsController {
    gpsService: GpsService;

    constructor(gpsService: GpsService) {
        this.gpsService = gpsService;
    }

    async create(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { latitude, longitude } = gpsSchema.parse(request.body);
            const gps = await this.gpsService.createGps({
                latitude,
                longitude,
            });
            response.json(gps);
        } catch (err) {
            next(err);
        }
    }

    async list(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const gpsData = await this.gpsService.listGps();
            response.json(gpsData);
        } catch (err) {
            next(err);
        }
    }
}
