import { z } from "zod";

export const wishlistItemSchema = z
  .object({
    productId: z.string().trim().min(1).max(100),
  })
  .strict();

export type WishlistItemInput = z.infer<typeof wishlistItemSchema>;
