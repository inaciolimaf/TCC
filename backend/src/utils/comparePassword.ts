import { compare } from "bcrypt";

export default async function comparePassword(
    password: string,
    passwordHash: string
) {
    const passwordMath = await compare(password, passwordHash);
    return passwordMath;
}
