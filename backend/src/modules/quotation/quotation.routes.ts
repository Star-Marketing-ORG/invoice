import { Router } from "express";
import { validate } from "../../common/middleware/validate.middleware";
import { quotationController } from "./quotation.controller";
import { createQuotationSchema, updateQuotationSchema, updateQuotationStatusSchema } from "@invoice/shared";
import { authMiddleware } from "../../common/middleware/auth.middleware";
import { authorize } from "../../common/middleware/authorize.middleware";

const router = Router();

router.get("/", quotationController.getAllQuotations);
router.get("/search", quotationController.searchQuotations);
router.get("/filter", quotationController.filterQuotations);
router.get("/:id", quotationController.getQuotationById);

router.post("/", authMiddleware, authorize("ADMIN"), validate(createQuotationSchema), quotationController.createQuotation);
router.put("/:id", authMiddleware, authorize("ADMIN"), validate(updateQuotationSchema), quotationController.updateQuotation);
router.patch("/:id/status", authMiddleware, authorize("ADMIN"), validate(updateQuotationStatusSchema), quotationController.updateQuotationStatus);
router.delete("/:id", authMiddleware, authorize("ADMIN"), quotationController.deleteQuotation);

export { router as quotationRouter };