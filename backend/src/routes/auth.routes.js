import { Router } from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/auth.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = Router();

// Unsecured routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
