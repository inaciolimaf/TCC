import { NextFunction, Request, Response } from "express";
import { UserRes } from "../dtos/UserRes";
import IUserService from "../services/IUserService";
import { createUserSchema } from "../schema/userSchema";

export class UserController {
    userService: IUserService;

    constructor(userService: IUserService) {
        this.userService = userService;
    }

    async create(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { name, email, password } = createUserSchema.parse(
                request.body
            );

            const user = await this.userService.createUser({
                name,
                email,
                password,
            });

            const userResponse: UserRes = {
                name: user.name,
                email: user.email,
                creationDate: user.creationDate,
                id: user._id,
            };

            response.json(userResponse);
        } catch (err) {
            next(err);
        }
    }

    async list(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const users = await this.userService.listUsers();
            response.json(users);
        } catch (err) {
            next(err);
        }
    }

    async showLogado(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const id = request.params.user_id;
            const user = await this.userService.showUserById(id);
            response.json(user);
        } catch (err) {
            next(err);
        }
    }
}