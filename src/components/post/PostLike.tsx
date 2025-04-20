"use client";
import { useState, useTransition } from "react";
import { likePost, unLikePost } from "@/actions/post";
import { Heart } from "lucide-react";
import { Post } from "@/db/post";
import { cn } from "@/lib/utils";

const PostLike = ({ post }: { post: Post }) => {
  const [isLiked, setIsLiked] = useState(post.isLikedByAuthenticatedUser);
  const [likeCount, setLikeCount] = useState(post.likesCount);
  const [isPending, startTransition] = useTransition();

  const handleLike = async () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
    startTransition(async () => {
      if (isLiked) {
        try {
          await unLikePost(post.id);
        } catch {
          setIsLiked(true);
          setLikeCount((prev) => prev + 1);
        }
      } else {
        try {
          await likePost(post.id);
        } catch {
          setIsLiked(false);
          setLikeCount((prev) => prev - 1);
        }
      }
    });
  };

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={handleLike}
        className="rounded-full cursor-pointer"
        disabled={isPending}
      >
        {isLiked ? (
          <Heart className="text-red-600" fill="red" size={20} />
        ) : (
          <Heart size={20} />
        )}
      </button>
      <div className={cn(isLiked ? "text-red-600" : false)}>{likeCount}</div>
    </div>
  );
};

export default PostLike;
