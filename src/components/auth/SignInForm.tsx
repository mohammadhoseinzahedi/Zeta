"use client";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema, type SignIn } from "@/schema/auth";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";

const SignInForm = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorMessage =
    error === "CredentialsSignin" ? "Invalid username or password" : error;
  const form = useForm<SignIn>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: SignIn) {
    await signIn("credentials", values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {errorMessage && (
          <div className="text-red-500 text-sm">{errorMessage}</div>
        )}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="cursor-pointer rounded-full min-w-24"
        >
          Sign In
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;
