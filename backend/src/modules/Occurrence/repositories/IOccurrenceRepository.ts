import { OccurrenceReq } from "../dtos/OccurrenceReq";
import { OccurrenceRes } from "../dtos/OccurrenceRes";

export default interface IOccurrenceRepository {
    createOccurrence(data: OccurrenceReq): Promise<OccurrenceRes>;
    listOccurrences(): Promise<OccurrenceRes[]>;
}
