import type { Request, Response } from "express";
import { productListQuerySchema } from "../contracts/product.contract.js";
import { productService } from "../services/product.service.js";

export const productController = {
  list: async (request: Request, response: Response) => {
    const result = productListQuerySchema.safeParse(request.query);
    if (!result.success) {
      response.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: result.error.issues[0]?.message ?? "Invalid query.",
        },
      });
      return;
    }
    response.json(await productService.list(result.data));
  },

  detail: async (request: Request<{ slug: string }>, response: Response) => {
    response.json({
      product: await productService.findBySlug(request.params.slug),
    });
  },
};
