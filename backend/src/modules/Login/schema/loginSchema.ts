import Zod from "zod";

export const loginSchema = Zod.object({
    email: Zod.string().email(),
    password: Zod.string().min(6),
}).strict();
