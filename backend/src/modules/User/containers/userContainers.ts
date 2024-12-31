import { UserController } from "../controllers/UserController";
import IUserRepository from "../repositories/IUserRepository";
import UserMongoRepository from "../repositories/UserMongoRepository";
import { UserService } from "../services/UserService";
import * as dotenv from "dotenv";

dotenv.config();
let userRepository: IUserRepository;
userRepository = new UserMongoRepository();

const userService = new UserService(userRepository);

const userController = new UserController(userService);

const userContainer = {
    userRepository,
    userService,
    userController,
};

export default userContainer;