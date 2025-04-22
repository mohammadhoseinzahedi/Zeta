"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CommentInputFormSchema,
  type CommentInputForm,
} from "@/schema/comment";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createComment } from "@/actions/comment";
import type { Comment as CommentType } from "@/db/comment";
import { useState, type Dispatch, type SetStateAction } from "react";
import { LoaderCircle, Send } from "lucide-react";
import { toast } from "sonner";

const CommentForm = ({
  postId,
  comment,
  setComments,
  setStatus,
}: {
  postId: string;
  comment?: CommentType;
  setComments?: Dispatch<SetStateAction<CommentType[]>>;
  setStatus?: Dispatch<
    SetStateAction<{
      page: number;
      hasMore: boolean;
      error: boolean;
    }>
  >;
}) => {
  const form = useForm<CommentInputForm>({
    resolver: zodResolver(CommentInputFormSchema),
    defaultValues: {
      content: comment?.content ?? "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  async function onSubmit(values: CommentInputForm) {
    setIsSubmitting(true);
    toast.promise(createComment(postId, values), {
      loading: "Submitting comment...",
      success: () => {
        if (setComments && setStatus) {
          setComments([]);
          setStatus((prev) => ({
            ...prev,
            page: 0,
            hasMore: true,
            error: false,
          }));
        }
        form.reset();
        return "Comment submitted successfully.";
      },
      error: "Error submitting comment. Please try again.",
      finally: () => {
        setIsSubmitting(false);
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Leave your comment ..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={isSubmitting}
          type="submit"
          className="cursor-pointer rounded-full min-w-24"
        >
          {isSubmitting ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <>
              <Send /> Send
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CommentForm;
