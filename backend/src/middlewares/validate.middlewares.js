import { ApiError } from "../utils/api-error.js";
import { ZodError } from "zod";

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    // 1. Check if it's a ZodError OR if it has the 'issues' property
    const isZodError = error instanceof ZodError || error.name === "ZodError";

    if (isZodError && error.issues) {
      const errorMessages = error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));

      // Use next() instead of throw for Express middleware
      return next(new ApiError(400, "Zod validation failed", errorMessages));
    }

    // 2. Fallback for unexpected errors
    console.error("Unexpected Error during validation:", error);
    return next(
      new ApiError(500, error?.message || "Internal Validation Error"),
    );
  }
};

export { validate };
