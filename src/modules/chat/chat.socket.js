import { Server } from "socket.io";
import { logout, registerAccount } from "./service/chat.socket.service.js";
import { sendMessage } from "./service/message.service.js";

// run io
export const runIo = (server) => {

    const io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    io.on("connection", async (socket) => {
        await registerAccount(socket);
        await sendMessage(socket);
        await logout(socket);
    });
}