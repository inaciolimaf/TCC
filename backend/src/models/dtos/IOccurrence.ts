import { Document } from "mongoose";

export default interface IOccurrence extends Document {
    isInDanger: boolean;
    reason: "PANIC_BUTTON" | "FALL";
    creationDate: Date;
}
