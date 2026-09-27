import { z } from "zod";

const passwordSchema = z
  .string()
  .min(15, "Password must be at least 15 characters.")
  .max(200)
  .refine((password) => Buffer.byteLength(password, "utf8") <= 72, {
    message: "Password must be at most 72 UTF-8 bytes.",
  })
  .refine((password) => !/^(.)\1+$/.test(password), {
    message: "Password cannot consist of one repeated character.",
  });

export const loginSchema = z
  .object({
    email: z.email().trim().toLowerCase().max(254),
    password: passwordSchema,
    rememberMe: z.boolean().optional().default(false),
  })
  .strict();

export const registerSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    email: z.email().trim().toLowerCase().max(254),
    password: passwordSchema,
  })
  .strict();

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
