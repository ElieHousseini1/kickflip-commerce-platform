import { Router } from "express";
import { assetController } from "../controllers/asset.controller.js";

export const assetRouter = Router();

assetRouter.get("/{*key}", assetController.get);
