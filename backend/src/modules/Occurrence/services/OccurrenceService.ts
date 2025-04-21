import { OccurrenceReq } from "../dtos/OccurrenceReq";
import { OccurrenceRes } from "../dtos/OccurrenceRes";
import IOccurrenceRepository from "../repositories/IOccurrenceRepository";
import { AppError } from "../../../middlewares/errors/AppError";

export class OccurrenceService {
    occurrenceRepository: IOccurrenceRepository;
    constructor(occurrenceRepository: IOccurrenceRepository) {
        this.occurrenceRepository = occurrenceRepository;
    }
    public async createOccurrence(data: OccurrenceReq): Promise<OccurrenceRes> {
        try {
            return await this.occurrenceRepository.createOccurrence(data);
        } catch (err) {
            throw new AppError(`${err}`, 400);
        }
    }
    public async listOccurrences(): Promise<OccurrenceRes[]> {
        try {
            return await this.occurrenceRepository.listOccurrences();
        } catch (err) {
            throw new AppError(`${err}`, 400);
        }
    }
}
