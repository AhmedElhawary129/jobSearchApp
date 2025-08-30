import joi from "joi"
import { generalRules } from "../../utils/index.js"

export const getChatSchema = {
    params: joi.object({
        userId: generalRules.objectId.required()
    }).required()
};