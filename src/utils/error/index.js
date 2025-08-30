// error handler
export const asyncHandler = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch((error) => {
            return next(error);
        });
    }
}

//----------------------------------------------------------------------------------------------------------------

// global error handler
export const globalErrorHandler = (error, req, res, next) => {
    if (process.env.MODE=="DEV") {
        return res.status(error.statusCode || 500).json({
            msg: "Error",
            message: error.message,
            stack: error.stack
        });
    }else if (process.env.MODE=="PRODUCTION") {
        return res.status(error.statusCode || 500).json({
            msg: "Error",
            message: error.message
        });
    }
};

//----------------------------------------------------------------------------------------------------------------

export class AppError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode;
        this.message = message;
    }
}