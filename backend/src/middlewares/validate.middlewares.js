import { asyncHandler } from "../utils/async-handler.js";

const validate = (schema) =>
  asyncHandler(async (req, res, next) => {
    req.body = await schema.parseAsync(req.body);
    next();
  });

export { validate };
