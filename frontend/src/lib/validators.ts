import { z } from "zod";

export const emailSchema = z.string().trim().toLowerCase().email("Please enter a valid email");
export const passwordSchema = z.string().min(6, "Password must be at least 6 characters");
export const fullNameSchema = z.string().trim().min(2, "Name must be at least 2 characters");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupSchema = z.object({
  fullName: fullNameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;