import { z } from "zod";

export const CommentInputFormSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(500, "Comment must be less than 500 characters"),
});

export const CommentInputDbSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(500, "Comment must be less than 500 characters"),
});

export type CommentInputForm = z.infer<typeof CommentInputFormSchema>;
export type CommentInputDb = z.infer<typeof CommentInputDbSchema>;