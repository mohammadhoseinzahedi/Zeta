import { z } from "zod";

export const PostInputFormSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(2000, "Post must be less than 2000 characters"),
  image: z.string().url("Must be a valid URL").or(z.literal("")),
});

export const PostInputDbSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(2000, "Post must be less than 2000 characters"),
  image: z.string().url("Must be a valid URL").nullable(),
});

export type PostInputForm = z.infer<typeof PostInputFormSchema>;
export type PostInputDb = z.infer<typeof PostInputDbSchema>;
