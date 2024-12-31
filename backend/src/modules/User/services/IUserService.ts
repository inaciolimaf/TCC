import IUser from "../../../models/dtos/IUser";
import { UserReq } from "../dtos/UserReq";

export default interface IUserService {
    createUser(dataUser: UserReq): Promise<IUser>;
    listUsers(): Promise<IUser[]>;
    showUserByEmail(email: string): Promise<IUser>;
    showUserById(id: string): Promise<IUser>;
}
