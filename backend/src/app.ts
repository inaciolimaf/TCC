import express from "express";
import path from "path";
import routes from "./routes/index";
import "express-async-errors";
import cors from "cors";
import { errorInterceptor } from "./middlewares/errors/erorInterceptor";
import connectToMongoDatabase from "./models/mongo";
import * as dotenv from "dotenv";

dotenv.config();
const isDebug = process.env.DEBUG !== "false";
const databaseType = process.env.DATABASE_TYPE;
if (databaseType === "mongo") {
    connectToMongoDatabase();
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(express.static(path.join(__dirname, "..", "public")));

!isDebug && app.use(errorInterceptor);

export default app;
