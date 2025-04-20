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
import { useRouter } from "next/navigation";
import { canUpdatePost } from "@/permissions/post";
import { authenticatedUserType } from "@/auth";
import type { Dispatch, SetStateAction } from "react";

const PostMoreDropdownMenu = ({
  authenticatedUser,
  post,
  setPosts,
  setStatus,
}: {
  authenticatedUser: authenticatedUserType;
  post: Post;
  setPosts?: Dispatch<SetStateAction<Post[]>>;
  setStatus?: Dispatch<
    SetStateAction<{
      page: number;
      hasMore: boolean;
      error: boolean;
    }>
  >;
}) => {
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
                  try {
                    await deletePost(post.id);
                    if (setPosts && setStatus) {
                      setPosts([]);
                      setStatus((prev) => ({
                        ...prev,
                        page: 0,
                        hasMore: true,
                        error: false,
                      }));
                    }
                    router.refresh();
                  } catch {
                    alert("Error deleting post. Please try again.");
                  }
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
