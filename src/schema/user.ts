import { z } from "zod";

export const UserInputFormSchema = z.object({
  name: z.string().max(32, "Display name must be less than 32 characters"),
  bio: z.string().max(128, "Bio must be less than 128 characters"),
  image: z.string().url("Must be a valid URL").or(z.literal("")),
});

export const UserInputDbSchema = z.object({
  name: z.string().max(32, "Display name must be less than 32 characters").nullable(),
  bio: z.string().max(128, "Bio must be less than 128 characters").nullable(),
  image: z.string().url("Must be a valid URL").nullable(),
});


export type UserInputFormType = z.infer<typeof UserInputFormSchema>;
export type UserInputDbType = z.infer<typeof UserInputDbSchema>;