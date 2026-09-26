import { z } from "zod";

export const productListQuerySchema = z
  .object({
    q: z.string().trim().max(100).optional().default(""),
    category: z
      .enum(["all", "boards", "hardware", "ramps", "wearables", "accessories"])
      .optional()
      .default("all"),
    sort: z
      .enum(["featured", "price-low", "price-high", "name"])
      .optional()
      .default("featured"),
  })
  .strict();

export type ProductListQuery = z.infer<typeof productListQuerySchema>;
