import dotenv from "dotenv";
import path from "path";
dotenv.config({path:path.resolve("config/.env")});
import express from "express";
import bootstrap from "./src/app.controller.js";
import { runIo } from "./src/modules/chat/chat.socket.js";

const app = express();
const port = process.env.PORT || 3001;

bootstrap(app, express);

const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// socket
runIo(server)