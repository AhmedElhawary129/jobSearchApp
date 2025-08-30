import { Router } from "express";
import { authentication } from "../../middleware/auth.js";
import * as CS from "./service/chat.service.js";
import { validation } from "../../middleware/validation.js";
import * as CV from "./chat.validation.js";

const chatRouter = Router()

// routes
chatRouter.get("/:userId", validation(CV.getChatSchema), authentication, CS.getChat)

export default chatRouter;