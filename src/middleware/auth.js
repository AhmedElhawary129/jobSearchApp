import { tokenTypes } from "../DB/enums.js";
import { userModel } from "../DB/models/user.model.js";
import { AppError, asyncHandler } from "../utils/error/index.js";
import { verifyToken } from "../utils/index.js";


export const decodedToken = async({authorization, tokenType, next} = {}) => {

  const [prefix, token] = authorization?.split(" ") || [];
  if (!prefix || !token) {
    return next(new AppError("Token is required", 400));
  }

  let ACCESS_SIGNATURE = undefined;
  let REFRESH_SIGNATURE = undefined;
  if (prefix == process.env.PREFIX_TOKEN_ADMIN) {
    ACCESS_SIGNATURE = process.env.ACCESS_SIGNATURE_ADMIN;
    REFRESH_SIGNATURE = process.env.REFRESH_SIGNATURE_ADMIN;
  } else if (prefix == process.env.PREFIX_TOKEN_USER) {
    ACCESS_SIGNATURE = process.env.ACCESS_SIGNATURE_USER;
    REFRESH_SIGNATURE = process.env.REFRESH_SIGNATURE_USER;
  } else {
    return next(new AppError("Invalid token prefix", 400));
  }

  // verify token
  const decoded = await verifyToken({
    token, 
    SIGNATURE: tokenType == tokenTypes.access ? ACCESS_SIGNATURE : REFRESH_SIGNATURE
  });
  if (!decoded?.id) {
    return next(new AppError("Invalid token payload", 400));
  }

  // check if email exists
  const user = await userModel.findById(decoded?.id).lean();
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (parseInt(user?.passwordChangedAt?.getTime()/1000) > decoded.iat) {
    return next(new AppError("Token expired please logIn again", 401))
  }

  if (parseInt(user?.emailChangedAt?.getTime()/1000) > decoded.iat) {
    return next(new AppError("Token expired please logIn again", 401))
  }

  if (parseInt(user?.bannedAt?.getTime()/1000) > decoded.iat) {
    return next(new AppError("Token expired please logIn again", 401))
  }

  if (user?.isDeleted) {
    return next(new AppError("User Deleted", 401))
  }
  return user
}

//---------------------------------------------------------------------------------------------------------------

// authentication
export const authentication = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  const user = await decodedToken({authorization, tokenType: tokenTypes.access, next});

  req.user = user;
  next();
});

//---------------------------------------------------------------------------------------------------------------

// authorization
export const authorization = (accessRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    if (!accessRoles.includes(req.user.role)) {
      return next(new AppError("Access denied", 403));
    }
    next();
  });
};

//---------------------------------------------------------------------------------------------------------------

// graphql authentication
export const authGraphQL = async({authorization, tokenType = tokenTypes.access, accessRoles = []} = {}) => {

  const [prefix, token] = authorization?.split(" ") || [];
  if (!prefix || !token) {
    throw new AppError("Token is required", 400);
  }

  let ACCESS_SIGNATURE = undefined;
  let REFRESH_SIGNATURE = undefined;
  if (prefix == process.env.PREFIX_TOKEN_ADMIN) {
    ACCESS_SIGNATURE = process.env.ACCESS_SIGNATURE_ADMIN;
    REFRESH_SIGNATURE = process.env.REFRESH_SIGNATURE_ADMIN;
  } else if (prefix == process.env.PREFIX_TOKEN_USER) {
    ACCESS_SIGNATURE = process.env.ACCESS_SIGNATURE_USER;
    REFRESH_SIGNATURE = process.env.REFRESH_SIGNATURE_USER;
  } else {
    throw new AppError("Invalid token prefix", 400);
  }

  // verify token
  const decoded = await verifyToken({
    token, 
    SIGNATURE: tokenType == tokenTypes.access ? ACCESS_SIGNATURE : REFRESH_SIGNATURE
  });
  if (!decoded?.id) {
    throw new AppError("Invalid token payload", 400);
  }

  // check if email exists
  const user = await userModel.findById(decoded?.id).lean();
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (parseInt(user?.passwordChangedAt?.getTime()/1000) > decoded.iat) {
    throw new AppError("Token expired please logIn again", 401)
  }

  if (parseInt(user?.changeEmailAt?.getTime()/1000) > decoded.iat) {
    throw new AppError("Token expired please logIn again", 401)
  }

  if (parseInt(user?.bannedAt?.getTime()/1000) > decoded.iat) {
    throw new AppError("Token expired please logIn again", 401)
  }

  if (user?.isDeleted) {
    throw new AppError("User Deleted", 401)
  }
  if (!accessRoles.includes(user.role)) {
  throw new AppError("Access denied", 403);
  }
  return user
}

//---------------------------------------------------------------------------------------------------------------

// socket authentication
export const authSocket = async({socket}) => {

  const [prefix, token] = socket.handshake.auth?.authorization?.split(" ") || [];
  if (!prefix || !token) {
    return {message: "Token is required", statusCode: 401}
  }

  let ACCESS_SIGNATURE = undefined;
  if (prefix == process.env.PREFIX_TOKEN_ADMIN) {
    ACCESS_SIGNATURE = process.env.ACCESS_SIGNATURE_ADMIN;
  } else if (prefix == process.env.PREFIX_TOKEN_USER) {
    ACCESS_SIGNATURE = process.env.ACCESS_SIGNATURE_USER;
  } else {
    return {message: "Invalid token prefix", statusCode: 400}
  }

  // verify token
  const decoded = await verifyToken({
    token, 
    SIGNATURE: ACCESS_SIGNATURE
  });
  if (!decoded?.id) {
    return {message: "Invalid token payload", statusCode: 400}
  }

  // check if email exists
  const user = await userModel.findById(decoded?.id).lean();
  if (!user) {
    return {message: "User not found", statusCode: 404}
  }

  if (parseInt(user?.passwordChangedAt?.getTime()/1000) > decoded.iat) {
    return {message: "Token expired please logIn again", statusCode: 401}
  }

  if (parseInt(user?.changeEmailAt?.getTime()/1000) > decoded.iat) {
    return {message: "Token expired please logIn again", statusCode: 401}
  }

  if (user?.isDeleted) {
    return {message: "User Deleted", statusCode: 401}
  }
  return {user, statusCode: 200}
}