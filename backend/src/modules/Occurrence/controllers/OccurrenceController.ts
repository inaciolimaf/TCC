// src/modules/Occurrence/controllers/OccurrenceController.ts
import { NextFunction, Request, Response } from "express";
import { createOccurrenceSchema } from "../schema/occurrenceSchema";
import { OccurrenceService } from "../services/OccurrenceService";
import { sendEmail } from "../../../utils/sendEmail";
import { io } from "../../../app";

export class OccurrenceController {
    occurrenceService: OccurrenceService;
    constructor(occurrenceService: OccurrenceService) {
        this.occurrenceService = occurrenceService;
    }
    async create(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { isInDanger, reason } = createOccurrenceSchema.parse(
                request.body
            );
            const occurrence = await this.occurrenceService.createOccurrence({
                isInDanger,
                reason,
            });
            
            io.emit('new-occurrence', {
                id: occurrence.id,
                isInDanger: occurrence.isInDanger,
                reason: occurrence.reason,
                creationDate: occurrence.creationDate,
                timestamp: new Date().toISOString()
            });
            
            console.log('Nova ocorrência criada e emitida:', occurrence);
            if (occurrence.isInDanger) {
                const dataFormatada = occurrence.creationDate.toLocaleString("pt-BR", {
                    timeZone: "America/Sao_Paulo",
                    hour12: false,
                });
                sendEmail("inaciofilho.lima@gmail.com", "Alerta de Perigo", 
                    `Alerta de perigo: ${dataFormatada}`,
                    `Alerta de perigo: ${dataFormatada} - Motivo: ${occurrence.reason}`
                );
                console.log('Email de alerta enviado.');
                
            }
            
            response.json(occurrence);
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
            const occurrences = await this.occurrenceService.listOccurrences();
            response.json(occurrences);
        } catch (err) {
            next(err);
        }
    }
}