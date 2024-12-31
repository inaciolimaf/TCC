import Zod from "zod";

export const createUserSchema = Zod.object({
    name: Zod.string(),
    email: Zod.string().email(),
    password: Zod.string().min(6),
}).strict();
