import mongoose, { Schema, Document } from "mongoose";
import IUser from "../dtos/IUser";

// Esquema de usuário
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

// Modelo de usuário
const UserMongo = mongoose.model<IUser>("User", UserSchema);

export default UserMongo;