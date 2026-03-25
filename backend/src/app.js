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

// This MUST be the last middleware in your app.js
app.use((err, req, res, next) => {
  // If the error has a statusCode (like your ApiError), use it; otherwise 500
  const statusCode = err.statusCode || 500;

  // Send the response as JSON
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [], // This is where your formatted Zod messages live
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export default app;
