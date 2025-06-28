// src/app.ts
import express from "express";
import path from "path";
import routes from "./routes/index";
import "express-async-errors";
import cors from "cors";
import { errorInterceptor } from "./middlewares/errors/erorInterceptor";
import connectToMongoDatabase from "./models/mongo";
import * as dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();
const isDebug = process.env.DEBUG !== "false";
const databaseType = process.env.DATABASE_TYPE;
if (databaseType === "mongo") {
    connectToMongoDatabase();
}

const app = express();
const server = createServer(app);

// Configurar Socket.io
export const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["*"]
    }
});

app.use(cors());
app.use(express.json());
app.use(routes);

app.use('/audio-files', express.static(path.join(__dirname, "..", "temp")));
app.use(express.static(path.join(__dirname, "..", "public")));

!isDebug && app.use(errorInterceptor);

// Socket.io connection handler
io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
    
    // Você pode adicionar mais eventos aqui
    socket.on('join-room', (room) => {
        socket.join(room);
        console.log(`Cliente ${socket.id} entrou na sala ${room}`);
    });
});

// Exportar apenas o servidor HTTP, não o app express
export default server;