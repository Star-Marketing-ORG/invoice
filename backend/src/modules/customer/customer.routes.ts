import { Router } from "express";
import { validate } from "../../common/middleware/validate.middleware";
import { customerController } from "./customer.controller";
import { createCustomerSchema, updateCustomerSchema } from "@invoice/shared";
import { authMiddleware } from "../../common/middleware/auth.middleware";
import { authorize } from "../../common/middleware/authorize.middleware";

const router = Router();

router.get("/", customerController.getAllCustomers);
router.get("/search", customerController.searchCustomers);
router.get("/filter", customerController.filterCustomers);
router.get("/:id", customerController.getCustomerById);

router.post(
  "/",
  authMiddleware,
  authorize("ADMIN"),
  validate(createCustomerSchema),
  customerController.createCustomer,
);

router.put(
  "/:id",
  authMiddleware,
  authorize("ADMIN"),
  validate(updateCustomerSchema),
  customerController.updateCustomer,
);

router.delete("/:id", authMiddleware, authorize("ADMIN"), customerController.deleteCustomer);

export { router as customerRouter };