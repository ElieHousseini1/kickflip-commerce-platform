import { Router } from "express";
import { cartController } from "../controllers/cart.controller.js";
import {
  addCartItemSchema,
  removeCartItemSchema,
  updateCartItemSchema,
} from "../contracts/cart.contract.js";
import { requireAuthentication } from "../middleware/authenticate.js";
import { validateBody } from "../middleware/validate.js";

export const cartRouter = Router();
cartRouter.use(requireAuthentication);

cartRouter.get("/", cartController.list);
cartRouter.post("/", validateBody(addCartItemSchema), cartController.add);
cartRouter.patch(
  "/",
  validateBody(updateCartItemSchema),
  cartController.update,
);
cartRouter.delete(
  "/",
  validateBody(removeCartItemSchema),
  cartController.remove,
);
