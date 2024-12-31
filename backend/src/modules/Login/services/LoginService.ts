import { AppError } from "../../../middlewares/errors/AppError";
import { sign } from "jsonwebtoken";
import IUserRepository from "../../User/repositories/IUserRepository";
import comparePassword from "../../../utils/comparePassword";
import ILoginService from "./ILoginService";

export default class LoginService implements ILoginService {
    userRepository: IUserRepository;
    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }
    public async login(email: string, password: string): Promise<string> {
        const user = await this.userRepository.showUserByEmail(email);
        if (!user) {
            throw new AppError("Incorrect email or password", 401);
        }

        const passwordMath = await comparePassword(password, user.passwordHash);
        if (!passwordMath) {
            throw new AppError("Incorrect email or password", 401);
        }

        const token = sign({}, "secretIOT", {
            subject: user._id.toString(),
            expiresIn: "30d",
        });
        return token;
    }
}
