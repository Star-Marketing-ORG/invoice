import { Router } from "express";
import { validate } from "../../common/middleware/validate.middleware";
import { paymentController } from "./payment.controller";
import {
  createPaymentSchema,
  updatePaymentSchema,
  updatePaymentStatusSchema,
} from "@invoice/shared";
import { authMiddleware } from "../../common/middleware/auth.middleware";
import { authorize } from "../../common/middleware/authorize.middleware";

const router = Router();

router.get("/", paymentController.getAllPayments);
router.get("/search", paymentController.searchPayments);
router.get("/filter", paymentController.filterPayments);
router.get("/invoice/:invoiceId", paymentController.getPaymentsByInvoice);

router.get("/:id", paymentController.getPaymentById);
router.post(
  "/",
  authMiddleware,
  authorize("ADMIN"),
  validate(createPaymentSchema),
  paymentController.createPayment,
);
router.put(
  "/:id",
  authMiddleware,
  authorize("ADMIN"),
  validate(updatePaymentSchema),
  paymentController.updatePayment,
);
router.patch(
  "/:id/status",
  authMiddleware,
  authorize("ADMIN"),
  validate(updatePaymentStatusSchema),
  paymentController.updatePaymentStatus,
);
router.delete(
  "/:id",
  authMiddleware,
  authorize("ADMIN"),
  paymentController.deletePayment,
);

export { router as paymentRouter };
