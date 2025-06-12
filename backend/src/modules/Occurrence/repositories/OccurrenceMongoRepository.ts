import IOccurrenceRepository from "./IOccurrenceRepository";
import { OccurrenceReq } from "../dtos/OccurrenceReq";
import { OccurrenceRes } from "../dtos/OccurrenceRes";
import OccurrenceMongo from "../../../models/mongo/Occurrence";
import { AppError } from "../../../middlewares/errors/AppError";

export default class OccurrenceMongoRepository
    implements IOccurrenceRepository
{
    public async createOccurrence(data: OccurrenceReq): Promise<OccurrenceRes> {
        try {
            const newOccurrence = new OccurrenceMongo({
                isInDanger: data.isInDanger,
                reason: data.reason,
            });
            const savedOccurrence = await newOccurrence.save();
            return {
                id: savedOccurrence._id,
                isInDanger: savedOccurrence.isInDanger,
                reason: savedOccurrence.reason,
                creationDate: savedOccurrence.creationDate,
            };
        } catch (err) {
            throw new AppError("Erro ao salvar ocorrência", 400);
        }
    }
    public async listOccurrences(): Promise<OccurrenceRes[]> {
        try {
            const occurrences = await OccurrenceMongo.find().sort({
                creationDate: -1,
            }).limit(10);
            
            return occurrences.map((occ) => ({
                id: occ._id,
                isInDanger: occ.isInDanger,
                reason: occ.reason,
                creationDate: occ.creationDate,
            }));
        } catch (err) {
            throw new AppError("Erro ao buscar ocorrências", 400);
        }
    }
}
