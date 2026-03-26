import { ZodError } from "zod";
import { ApiError } from "../utils/api-error.js";
import { defaultErrorMap } from "zod/v3";

const errorHandler = (err, req, res, next) => {
  let error = err;

  // 1. Convert ZodError to ApiError
  if (err instanceof ZodError) {
    const errorMessages = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    error = new ApiError(400, "Validation Failed", errorMessages);
  }

  // 2. Fallback: Ensure everything is an ApiError
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    // We pass the original stack here
    error = new ApiError(statusCode, message, [], err.stack);
  }

  // 3. Final Response
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
};

export default errorHandler;
