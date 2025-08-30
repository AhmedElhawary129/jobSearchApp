import jwt from "jsonwebtoken"

export const generateToken = async({payload = {}, SIGNETURE, option}) => {
    return jwt.sign(
            payload,
            SIGNETURE,
            option
        )
}