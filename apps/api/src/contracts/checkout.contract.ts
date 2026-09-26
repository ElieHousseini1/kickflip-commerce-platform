import { z } from "zod";

const customer = {
  name: z.string().trim().min(2).max(100),
  email: z.email().trim().toLowerCase().max(254),
  phone: z
    .string()
    .regex(/^\+961[0-9]{7,8}$/)
    .optional(),
  payment: z.literal("pay_on_delivery").optional(),
};

export const checkoutSchema = z.union([
  z
    .object({
      ...customer,
      deliveryMethod: z.literal("ship").optional(),
      address: z.string().trim().min(3).max(200),
      city: z.string().trim().min(1).max(100),
      apartment: z.string().trim().max(200).optional(),
      postalCode: z.string().trim().max(30).optional(),
      country: z.literal("Lebanon"),
    })
    .strict(),
  z
    .object({
      ...customer,
      deliveryMethod: z.literal("pickup"),
    })
    .strict(),
]);

export type CheckoutInput = z.infer<typeof checkoutSchema>;
