import { Router } from "express";

import { validate } from "../middlewares/validate.middlewares.js";
import {
  registerVSchema,
  loginVSchema,
} from "../validators/authValidator.validators.js";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/auth.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = Router();

// Unsecured routes
router.route("/register").post(validate(registerVSchema), registerUser);
router.route("/login").post(validate(loginVSchema), loginUser);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
