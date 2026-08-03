import { Router } from "express";

import { validate } from "../../common/middleware/validate.middleware";
import { authController } from "./auth.controller";
import { loginSchema } from "./auth.validation";
import { authMiddleware } from "../../common/middleware/auth.middleware";
import { updatePasswordSchema } from "@invoice/shared/schema";

const router = Router();

router.post("/login", validate(loginSchema), authController.login);

router.get("/me", authMiddleware, authController.me); 

router.post("/logout", authMiddleware, authController.logout);

router.patch(
  "/update-password",
  authMiddleware,
  validate(updatePasswordSchema),
  authController.updatePassword,
);

export { router as authRouter };
