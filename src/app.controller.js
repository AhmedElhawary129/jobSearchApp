import cors from "cors";
import connectionDB from "./DB/connectionDB.js";
import userRouter from "./modules/users/user.controller.js";
import { AppError, globalErrorHandler } from "./utils/error/index.js";
import path from "path";
import { rateLimit } from "express-rate-limit";
import chatRouter from "./modules/chat/chat.controller.js";
import companyRouter from "./modules/companies/company.controller.js";
import jobRouter from "./modules/jobs/job.controller.js";
import applicationRouter from "./modules/applications/application.controller.js";
import { createHandler } from "graphql-http/lib/use/http";
import { schema } from "./modules/graph.schema.js";
import expressPlayground  from "graphql-playground-middleware-express"

// limiter
const limiter = rateLimit({
    limit: 50,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: { error: "Too many requests, please try again after 15 minutes" },
    statusCode: 429,
    handler: (req, res, next) => {
        return next(
        new AppError("Too many requests, please try again after 15 minutes", 429)
        );
    },
});

//---------------------------------------------------------------------------------------------------------------

// bootstrap
const bootstrap = (app, express) => {
    // cors
    app.use(cors());

    // limiter
    app.use(limiter);


    // graphql
    app.use("/graphql", createHandler({schema: schema}))

    // graphql playground (http://localhost:3000/playground)
    app.get("/playground", expressPlayground.default({ endpoint: "/graphql" }))


    // static files
    app.use("/uploads", express.static(path.resolve("src/uploads")));

    // parse incoming data
    app.use(express.json());

    // home route
    app.get("/", (req, res, next) => {
        return res.status(200).json({ msg: "Welcome to my job search app" });
    });

    // DB connection
    connectionDB();

    // routes
    app.use("/users", userRouter);
    app.use("/companies", companyRouter);
    app.use("/jobs", jobRouter);
    app.use("/applications", applicationRouter);
    app.use("/chat", chatRouter);

    // handle URL errors
    app.use("*", (req, res, next) => {
        return next(new AppError(`Invalid URL ${req.originalUrl}`, 404));
    });

    // global error handler
    app.use(globalErrorHandler);
};

export default bootstrap;
