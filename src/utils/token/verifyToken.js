import jwt from "jsonwebtoken"

export const verifyToken = async({token, SIGNETURE}) => {
    return jwt.verify(
            token,
            SIGNETURE
        )
}