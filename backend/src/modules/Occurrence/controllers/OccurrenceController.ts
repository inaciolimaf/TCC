import { NextFunction, Request, Response } from "express";
import { createOccurrenceSchema } from "../schema/occurrenceSchema";
import { OccurrenceService } from "../services/OccurrenceService";

export class OccurrenceController {
    occurrenceService: OccurrenceService;
    constructor(occurrenceService: OccurrenceService) {
        this.occurrenceService = occurrenceService;
    }
    async create(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { isInDanger, reason } = createOccurrenceSchema.parse(
                request.body
            );
            const occurrence = await this.occurrenceService.createOccurrence({
                isInDanger,
                reason,
            });
            response.json(occurrence);
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
            const occurrences = await this.occurrenceService.listOccurrences();
            response.json(occurrences);
        } catch (err) {
            next(err);
        }
    }
}
