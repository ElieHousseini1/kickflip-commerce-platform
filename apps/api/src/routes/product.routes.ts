import { Router } from "express";
import { productController } from "../controllers/product.controller.js";

export const productRouter = Router();

productRouter.get("/", productController.list);
productRouter.get("/:slug", productController.detail);
