import { AppError } from "../../../middlewares/errors/AppError";
import IUser from "../../../models/dtos/IUser";
import hashPassword from "../../../utils/hash";
import { UserReq } from "../dtos/UserReq";
import IUserRepository from "../repositories/IUserRepository";

export class UserService {
    userRepository: IUserRepository;
    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }
    public async createUser(dataUser: UserReq): Promise<IUser> {
        try {
            const password_hash = await hashPassword(dataUser.password);
            const savedUser = await this.userRepository.createUser({
                name: dataUser.name,
                email: dataUser.email,
                passwordHash: password_hash,
            });
            return savedUser;
        } catch (err) {
            throw new AppError(`${err}`, 404);
        }
    }
    public async listUsers(): Promise<IUser[]> {
        try {
            const user = await this.userRepository.listUsers();
            if (!user) {
                throw new AppError("Usuário não encontrado", 404);
            }
            return user;
        } catch (err) {
            throw new AppError(`${err}`, 404);
        }
    }
    public async showUserByEmail(email: string): Promise<IUser> {
        try {
            const user = await this.userRepository.showUserByEmail(email);
            if (!user) {
                throw new AppError("Usuário não encontrado", 404);
            }
            return user;
        } catch (err) {
            throw new AppError(`${err}`, 404);
        }
    }
    public async showUserById(id: string): Promise<IUser> {
        try {
            const user = await this.userRepository.showUserById(id);
            if (!user) {
                throw new AppError("Usuário não encontrado", 404);
            }
            return user;
        } catch (err) {
            throw new AppError(`${err}`, 404);
        }
    }
}
