import { hash as hashBcrypt } from "bcrypt";

export default async function hashPassword(password: string): Promise<string> {
    return await hashBcrypt(password, 6);
}
