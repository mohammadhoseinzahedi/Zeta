"use client";
import { type Post } from "@/db/post";
import Link from "next/link";
import {
  LoaderCircle,
  SquarePen,
  UserCheck,
  Trash2,
  UserPlus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFollow } from "@/hooks/useFollow";
import { deletePost } from "@/actions/post";
import { canUpdatePost } from "@/permissions/post";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const PostMoreDropdownMenu = ({ post }: { post: Post }) => {
  const { user } = useAuth();
  const authenticatedUser = user;
  const router = useRouter();
  const { isFollowing, isPending, toggleFollow, refreshFollowState } =
    useFollow(post.author.username, post.author.isFollowedByAuthenticatedUser);

  return (
    <DropdownMenu
      onOpenChange={async (open) => {
        if (open) {
          await refreshFollowState();
        }
      }}
    >
      <DropdownMenuTrigger className="cursor-pointer">
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-sm font-normal">
          {post.author.name ?? post.author.username}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {!post.author.isAuthenticatedUser && (
          <>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                toggleFollow();
              }}
              disabled={isPending}
              className={cn("cursor-pointer", {
                "opacity-90": isPending || isFollowing,
              })}
            >
              {isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : isFollowing ? (
                <span className="flex items-center gap-2 justify-between w-full">
                  Following <UserCheck />
                </span>
              ) : (
                <span className="flex items-center gap-2 justify-between w-full">
                  Follow <UserPlus />
                </span>
              )}
            </DropdownMenuItem>
          </>
        )}
        {canUpdatePost(authenticatedUser, post) && (
          <>
            <DropdownMenuItem>
              <Link
                href={`/posts/${post.id}/edit`}
                className="w-full flex gap-2 items-center justify-between"
              >
                Edit
                <SquarePen className="text-blue-500" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                className="w-full flex gap-2 items-center justify-between cursor-pointer"
                onClick={async () => {
                  toast.promise(deletePost(post.id), {
                    loading: "Deleting post...",
                    success: () => {
                      router.push("/posts");
                      return "Post deleted successfully.";
                    },
                    error: "Error deleting post. Please try again.",
                  });
                }}
              >
                Delete
                <Trash2 className="text-red-500" />
              </button>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PostMoreDropdownMenu;
