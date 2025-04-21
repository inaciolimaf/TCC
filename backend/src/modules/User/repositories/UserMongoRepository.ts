import IUser from "../../../models/dtos/IUser";
import IUserRepository from "./IUserRepository";
import UserMongo from "../../../models/mongo/User";
import IUserRepositoryDTO from "../dtos/IUserRepositoryDTO";
import { AppError } from "../../../middlewares/errors/AppError";

export default class UserMongoRepository implements IUserRepository {
    public async createUser(data: IUserRepositoryDTO): Promise<IUser> {
        try {
            const newUser = new UserMongo({
                name: data.name,
                email: data.email,
                passwordHash: data.passwordHash,
            });
            const savedUser = await newUser.save();
            return savedUser;
        } catch (err) {
            throw new AppError("Erro com o banco de dados", 404);
        }
    }
    public async listUsers(): Promise<IUser[]> {
        try {
            const users = await UserMongo.find();
            return users;
        } catch (err) {
            throw new AppError("Erro no banco de dados", 404);
        }
    }
    public async showUserByEmail(email: string): Promise<IUser | null> {
        const users = await UserMongo.findOne({ email });
        return users;
    }
    public async showUserById(id: string): Promise<IUser | null> {
        const users = await UserMongo.findOne({ _id: id });
        return users;
    }
}
