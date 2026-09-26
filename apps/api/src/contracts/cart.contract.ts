import { z } from "zod";

const identifier = z.string().trim().min(1).max(140);

export const addCartItemSchema = z
  .object({
    productId: identifier,
    variantId: identifier.optional(),
    quantity: z.number().int().positive().max(99).default(1),
  })
  .strict();

export const updateCartItemSchema = z
  .object({
    productId: identifier,
    variantId: identifier,
    nextVariantId: identifier.optional(),
    quantity: z.number().int().min(0).max(99).optional(),
  })
  .strict()
  .refine(
    ({ nextVariantId, quantity }) =>
      nextVariantId !== undefined || quantity !== undefined,
    { message: "A quantity or replacement variant is required." },
  );

export const removeCartItemSchema = z
  .object({
    productId: identifier,
    variantId: identifier,
  })
  .strict();

export type AddCartItemInput = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type RemoveCartItemInput = z.infer<typeof removeCartItemSchema>;
