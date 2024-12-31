import { NextFunction, Request, Response } from "express";
import { AppError } from "./AppError";
import { ZodError } from "zod";

export function errorInterceptor(
    error: Error | AppError,
    request: Request,
    response: Response,
    next: NextFunction
): void {
    if (error instanceof ZodError) {
        response.status(500).json({
            status: "Error",
            message: "Validation error",
            issues: error.issues,
        });
        return;
    }
    
    if (error instanceof AppError) {
        response.status(error.statusCode).json({
            status: "Error",
            message: error.message,
        });
        return;
    }
    
    response.status(500).json({
        status: "Error",
        message: "Internal Server Error",
    });
}