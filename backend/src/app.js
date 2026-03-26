import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// basic config
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// cors configurations
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

import healthCheckRouter from "./routes/healthCheckRouter.routes.js";
import authRouter from "./routes/auth.routes.js";
import notesRouter from "./routes/note.routes.js";

app.use("/api/v1/healthCheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/notes", notesRouter);

// centralized error handler
import errorHandler from "./middlewares/errorHandler.middlewares.js";
app.use(errorHandler);

export default app;
