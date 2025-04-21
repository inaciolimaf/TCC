import Zod from "zod";

export const createOccurrenceSchema = Zod.object({
    isInDanger: Zod.boolean(),
    reason: Zod.enum(["PANIC_BUTTON", "FALL"]),
}).strict();
