import Zod from "zod";

export const gpsSchema = Zod.object({
    latitude: Zod.number(),
    longitude: Zod.number(),
}).strict();
