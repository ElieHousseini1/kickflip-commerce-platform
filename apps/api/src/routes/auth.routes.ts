import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { loginSchema, registerSchema } from "../contracts/auth.contract.js";
import { optionalAuthentication } from "../middleware/authenticate.js";
import {
  accountLoginRateLimit,
  loginRateLimit,
  registrationRateLimit,
} from "../middleware/rate-limits.js";
import { validateBody } from "../middleware/validate.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  registrationRateLimit,
  validateBody(registerSchema),
  authController.register,
);
authRouter.post(
  "/login",
  loginRateLimit,
  validateBody(loginSchema),
  accountLoginRateLimit,
  authController.login,
);
authRouter.post("/logout", authController.logout);
authRouter.get("/session", optionalAuthentication, authController.session);
