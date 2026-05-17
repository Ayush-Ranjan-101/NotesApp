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
  updateProfile,
  deleteProfile
} from "../controllers/auth.controllers.js";

import { upload } from "../middlewares/multer.middlewares.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = Router();

// Unsecured routes
router.route("/register").post(validate(registerVSchema), registerUser);
router.route("/login").post(validate(loginVSchema), loginUser);

// Secured routes
router.use(verifyJWT);
router.route("/logout").post(logoutUser);
router.route("/profile").put(
  upload.fields([
    {
      name: "profilePic",
      maxCount: 1,
    },
  ]),
  updateProfile,
);
router.route("/profile").delete(deleteProfile);

export default router;
