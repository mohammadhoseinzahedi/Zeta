import { z } from "zod";

export const SignInSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(3, "Username must be at least 3 characters long")
    .max(32, "Username must be less than 32 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .regex(/^[^\s]+$/, "Username cannot contain spaces"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must be less than 32 characters"),
});

export type SignIn = z.infer<typeof SignInSchema>;
