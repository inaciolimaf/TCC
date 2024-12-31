import IUser from "../../../models/dtos/IUser";
import IUserRepositoryDTO from "../dtos/IUserRepositoryDTO";

export default interface IUserRepository {
    listUsers(): Promise<IUser[]>;
    showUserByEmail(email: string): Promise<IUser | null>;
    showUserById(id: string): Promise<IUser | null>;
    createUser(data: IUserRepositoryDTO): Promise<IUser>;
}
