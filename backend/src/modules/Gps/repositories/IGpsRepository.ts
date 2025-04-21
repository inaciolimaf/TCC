import IGPS from "../../../models/dtos/IGPS";

export default interface IGpsRepository {
    listGps(limit?: number): Promise<IGPS[]>;
    createGps(data: { latitude: number; longitude: number }): Promise<IGPS>;
}
