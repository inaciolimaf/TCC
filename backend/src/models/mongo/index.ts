import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const uri: string = process.env.MONGODB_URI || "";

const connectToMongoDatabase = async () => {
    try {
        await mongoose.connect(uri);
        console.log("MongoDB: Connected");
    } catch (error) {
        console.error("MongoDB: Error", error);
        process.exit(1);
    }
};

export default connectToMongoDatabase;
