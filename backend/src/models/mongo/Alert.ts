import mongoose, { Schema, Document } from "mongoose";
import IAlert from "../dtos/IAlert";

// Esquema de alerta
const AlertSchema = new Schema<IAlert>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    state: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        enum: ['BUTTON', 'ACCELEROMETER', 'GPS'],
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
});

// Modelo de alerta
const AlertMongo = mongoose.model<IAlert>("Alert", AlertSchema);

export default AlertMongo;