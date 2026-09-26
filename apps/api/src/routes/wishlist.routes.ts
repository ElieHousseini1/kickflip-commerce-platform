import { Router } from "express";
import { wishlistItemSchema } from "../contracts/wishlist.contract.js";
import { wishlistController } from "../controllers/wishlist.controller.js";
import { requireAuthentication } from "../middleware/authenticate.js";
import { validateBody } from "../middleware/validate.js";

export const wishlistRouter = Router();
wishlistRouter.use(requireAuthentication);

wishlistRouter.get("/", wishlistController.list);
wishlistRouter.post(
  "/",
  validateBody(wishlistItemSchema),
  wishlistController.add,
);
wishlistRouter.delete(
  "/",
  validateBody(wishlistItemSchema),
  wishlistController.remove,
);
