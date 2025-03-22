import { Document } from 'mongoose';

interface IAlert extends Document {
    user: string | object;
    state: string;
    reason: 'BUTTON' | 'ACCELEROMETER' | 'GPS';
    latitude: number;
    longitude: number;
    creationDate: Date;
}

export default IAlert;