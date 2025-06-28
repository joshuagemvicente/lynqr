import { z } from "zod";

export const LinkBaseSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters long" })
    .max(50, { message: "Title must not exceed 50 characters" }),

  link: z
    .string({message: "This field is required."})
    .min(3, { message: "Link must be at least 3 characters long" })
    .max(200, { message: "Link must not exceed 200 characters" }),

  icon: z
    .string()
    .optional(),

  description: z
    .string()
    .max(200, { message: "Description must not exceed 200 characters" })
    .optional(),
});

export type LinkBaseDTO = z.infer<typeof LinkBaseSchema>;
