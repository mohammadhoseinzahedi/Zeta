"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CommentInputFormSchema,
  type CommentInputForm,
} from "@/schema/comment";
import { useForm } from "react-hook-form";
import Container from "@/components/Container";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createComment, updateComment } from "@/actions/comment";
import BackButton from "@/components/BackButton";
import type { Comment } from "@/db/comment";

const CommentForm = ({
  postId,
  comment,
}: {
  postId: string;
  comment?: Comment;
}) => {
  const form = useForm<CommentInputForm>({
    resolver: zodResolver(CommentInputFormSchema),
    defaultValues: {
      content: comment?.content ?? "",
    },
  });

  async function onSubmit(values: CommentInputForm) {
    let action = comment
      ? updateComment(comment.id, values)
      : createComment(postId, values);
    const { success } = await action;
    console.log(success);
  }

  return (
    <Container>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <header>
            <div className="flex items-center gap-8 py-2">
              <BackButton />
              <Button type="submit" className="rounded-full ms-auto">
                Reply
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
        </form>
      </Form>
    </Container>
  );
};

export default CommentForm;
