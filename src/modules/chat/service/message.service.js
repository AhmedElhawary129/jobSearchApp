import * as dbService from "../../../DB/dbService.js";
import { chatModel } from "../../../DB/models/chat.model.js";
import { connectionUser } from "../../../DB/models/user.model.js";
import { authSocket } from "../../../middleware/auth.js";

// send message
export const sendMessage = async (socket) => {
    socket.on("sendMessage", async (messageInfo) => {
        const {message, destId} = messageInfo;

        const data = await authSocket({socket})
        if (data.statusCode != 200) {
            return socket.emit("authError", data)
        }
        const userId = data.user._id
        
        let chat;
        chat = await dbService.findOneAndUpdate({
            model: chatModel,
            filter: {
                $or: [
                    {mainUser: userId, subParticipant: destId},
                    {mainUser: destId, subParticipant: userId}
                ]
            },
            update: {
                $push: {messages: {senderId: userId, message}}
            },
            options: {new: true}
        })
        if (!chat) {
            chat = await dbService.create({
                model: chatModel,
                query: {
                    mainUser: userId, 
                    subParticipant: destId,
                    messages: [{senderId: userId, message}]
                }
            })
        }
        socket.emit("successMessage", {message})
        socket.to(connectionUser.get(destId.toString())).emit("receiveMessage", {message, chat})
    })
}