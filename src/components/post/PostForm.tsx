"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostInputFormSchema, type PostInputForm } from "@/schema/post";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createPost, updatePost } from "@/actions/post";
import BackButton from "@/components/BackButton";
import type { Post } from "@/db/post";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../ui/input";

const PostForm = ({ post }: { post?: Post }) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const form = useForm<PostInputForm>({
    resolver: zodResolver(PostInputFormSchema),
    defaultValues: {
      content: post?.content ?? "",
      image: post?.image ?? "",
    },
  });

  const watchedImage = form.watch("image");

  async function onSubmit(values: PostInputForm) {
    if (imageLoading) {
      alert("Please wait for the image to finish loading.");
      return;
    }

    if (imageError) {
      alert("Please provide a valid image URL.");
      return;
    }

    const filteredValues = {
      content: values.content,
      image: values.image || null,
    };

    try {
      setIsPending(true);
      const action = post
        ? updatePost(post.id, filteredValues)
        : createPost(filteredValues);
      await action;
      router.push("/posts");
    } catch {
      alert("Something went wrong, please try again later.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Container className="py-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <header>
            <div className="flex items-center gap-8 py-2">
              <BackButton />
              <Button
                disabled={isPending}
                type="submit"
                className="rounded-full ms-auto cursor-pointer"
              >
                {post ? "Edit Post" : "Post"}
              </Button>
            </div>
          </header>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="What is happening?!" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            {imageLoading && (
              <div className="inset-0 w-[426px] h-[240px] flex items-center justify-center bg-gray-100">
                <div className="spinner border-4 border-gray-300 border-t-blue-500 w-8 h-8 animate-spin rounded-full"></div>
              </div>
            )}
            <img
              src={watchedImage || "/placeholder.com-1280x720.png"}
              className={`w-[426px] h-[240px] ${imageLoading ? "hidden" : ""}`}
              onLoad={(e) => {
                const img = e.target as HTMLImageElement;
                if (img.naturalWidth > 1280 || img.naturalHeight > 720) {
                  setImageError(true);
                  setImageLoading(false);
                  alert("Image dimensions must not exceed 1280x720 pixels.");
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
                <FormDescription>
                  Enter an url for your post image.
                </FormDescription>
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

export default PostForm;
