import { Router } from "express";
import { checkoutSchema } from "../contracts/checkout.contract.js";
import { orderController } from "../controllers/order.controller.js";
import { requireAuthentication } from "../middleware/authenticate.js";
import { validateBody } from "../middleware/validate.js";

export const orderRouter = Router();
orderRouter.use(requireAuthentication);
orderRouter.post("/", validateBody(checkoutSchema), orderController.create);
