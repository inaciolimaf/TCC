import { NextFunction, Request, Response } from "express";
import { loginSchema } from "../schema/loginSchema";
import ILoginService from "../services/ILoginService";

export class LoginController {
    loginService: ILoginService;
    
    constructor(loginService: ILoginService) {
        this.loginService = loginService;
    }
    
    public async login(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { email, password } = loginSchema.parse(request.body);
            const token = await this.loginService.login(email, password);
            
            response.status(200).json(token);
        } catch (err) {
            next(err);
        }
    }
}