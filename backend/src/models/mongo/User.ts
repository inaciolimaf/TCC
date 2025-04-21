import mongoose, { Schema, Document } from "mongoose";
import IUser from "../dtos/IUser";

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    creationDate: {
        type: Date,
        default: Date.now,
    },
});

const UserMongo = mongoose.model<IUser>("User", UserSchema);

export default UserMongo;