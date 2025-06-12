import mongoose, { Schema } from "mongoose";
import IOccurrence from "../dtos/IOccurrence";

const OccurrenceSchema = new Schema<IOccurrence>({
    isInDanger: {
        type: Boolean,
        required: true,
    },
    reason: {
        type: String,
        enum: ["PANIC_BUTTON", "FALL"],
        required: true,
    },
    creationDate: {
        type: Date,
        default: Date.now,
        required: true,
    },
});

const OccurrenceMongo = mongoose.model<IOccurrence>(
    "Occurrence",
    OccurrenceSchema
);

export default OccurrenceMongo;