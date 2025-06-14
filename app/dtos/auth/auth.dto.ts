import { z } from "zod"

export const nameSchema = z.string().min(3, "Name is required").max(50, "Name must be less than 50 characters");
export const emailSchema = z.string().email("Invalid email address").min(5, "Email is required");
export const passwordSchema = z.string().min(6, "Password must be at least 6 characters").max(100, "Password must be less than 100 characters");


export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})


export const signUpSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
})
