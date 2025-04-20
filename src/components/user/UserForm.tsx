"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserInputFormSchema, UserInputFormType } from "@/schema/user";
import { useForm } from "react-hook-form";
import Container from "@/components/Container";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { User } from "@/db/user";
import { updateUser } from "@/actions/user";
import BackButton from "@/components/BackButton";
import { useState } from "react";

const UserForm = ({ user }: { user: User }) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const form = useForm<UserInputFormType>({
    resolver: zodResolver(UserInputFormSchema),
    defaultValues: {
      name: user.name ?? "",
      bio: user.bio ?? "",
      image: user.image ?? "",
    },
  });

  const watchedImage = form.watch("image");

  async function onSubmit(values: UserInputFormType) {
    if (imageLoading) {
      alert("Please wait for the image to finish loading.");
      return;
    }

    if (imageError) {
      alert("Please provide a valid image URL.");
      return;
    }
    const filteredValues = {
      name: values.name || null,
      bio: values.bio || null,
      image: values.image || null,
    };
    try {
      await updateUser(filteredValues, user.username);
      alert("User profile updated successfully.");
    } catch {
      alert("Error updating user profile. Please try again.");
    }
  }

  return (
    <Container className="py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <header>
            <div className="flex items-center gap-8 py-2">
              <BackButton />
              <h1>Edit profile</h1>
              <Button
                type="submit"
                className="rounded-full ms-auto cursor-pointer"
              >
                Save
              </Button>
            </div>
          </header>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Display name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="Bio" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            {imageLoading && (
              <div className="inset-0 w-28 h-28 flex items-center justify-center bg-gray-100 rounded-full">
                <div className="spinner border-4 border-gray-300 border-t-blue-500 rounded-full w-8 h-8 animate-spin"></div>
              </div>
            )}
            <img
              src={watchedImage || "/img_avatar.png"}
              alt="Avatar"
              className={`rounded-full w-28 h-28 ${
                imageLoading ? "hidden" : ""
              }`}
              onLoad={(e) => {
                const img = e.target as HTMLImageElement;
                if (img.naturalWidth > 512 || img.naturalHeight > 512) {
                  setImageError(true);
                  setImageLoading(false);
                  alert("Image dimensions must not exceed 128x128 pixels.");
                } else {
                  setImageLoading(false);
                  setImageError(false);
                }
              }}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
            />
          </div>
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                  disabled={imageLoading}
                    placeholder="https://example.com/image.jpg"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setImageLoading(true); // Show spinner when input changes
                      setImageError(false); // Reset error state
                    }}
                  />
                </FormControl>
                <FormDescription>Enter an url for your avatar.</FormDescription>
                {imageError && (
                  <p className="text-red-500 text-sm">
                    Invalid image URL. Please try again.
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </Container>
  );
};

export default UserForm;
