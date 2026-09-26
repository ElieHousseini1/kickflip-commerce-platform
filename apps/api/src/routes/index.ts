import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { cartRouter } from "./cart.routes.js";
import { orderRouter } from "./order.routes.js";
import { productRouter } from "./product.routes.js";
import { wishlistRouter } from "./wishlist.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/products", productRouter);
apiRouter.use("/cart", cartRouter);
apiRouter.use("/wishlist", wishlistRouter);
apiRouter.use("/orders", orderRouter);
