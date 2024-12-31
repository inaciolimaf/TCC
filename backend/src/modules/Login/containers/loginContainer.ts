import * as dotenv from "dotenv";
import IUserRepository from "../../User/repositories/IUserRepository";
import UserMongoRepository from "../../User/repositories/UserMongoRepository";
import LoginService from "../services/LoginService";
import { LoginController } from "../controllers/LoginController";

dotenv.config();
let userRepository: IUserRepository;


userRepository = new UserMongoRepository();


const loginService = new LoginService(userRepository);

const loginController = new LoginController(loginService);

const loginContainer = {
    userRepository,
    loginService,
    loginController,
};

export default loginContainer;
