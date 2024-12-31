import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface TokenPayload {
    sub: string;
}

export function ensureAuthenticate(
    request: Request,
    response: Response,
    next: NextFunction
): void {
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
        response.status(401).json({
            message: "Token required",
        });
        return;
    }

    const token = authHeader.split(" ")[1];
    
    try {
        const decoded = verify(token, "secretIOT") as TokenPayload;
        
        if (typeof decoded.sub === "string") {
            request.params.user_logged_id = decoded.sub;
            next();
        } else {
            response.status(401).json({
                message: "Invalid token",
            });
            return;
        }
    } catch (error) {
        response.status(401).json({
            message: "Token invalid",
        });
        return;
    }
}