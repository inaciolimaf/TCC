import mongoose, { Schema } from "mongoose";
import IGPS from "../dtos/IGPS";

const GpsSchema = new Schema<IGPS>({
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    creationDate: {
        type: Date,
        default: Date.now,
    },
});

const GpsMongo = mongoose.model<IGPS>("Gps", GpsSchema);

export default GpsMongo;
