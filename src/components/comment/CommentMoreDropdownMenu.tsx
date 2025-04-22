"use client";
import { type Comment } from "@/db/comment";
import { LoaderCircle, UserCheck, Trash2, UserPlus } from "lucide-react";
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
import { deleteComment } from "@/actions/comment";
import { canUpdateComment } from "@/permissions/comment";
import { authenticatedUserType } from "@/auth";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

const CommentMoreDropdownMenu = ({
  authenticatedUser,
  comment,
  setComments,
  setStatus,
}: {
  authenticatedUser: authenticatedUserType;
  comment: Comment;
  setComments?: Dispatch<SetStateAction<Comment[]>>;
  setStatus?: Dispatch<
    SetStateAction<{
      page: number;
      hasMore: boolean;
      error: boolean;
    }>
  >;
}) => {
  const { isFollowing, isPending, toggleFollow, refreshFollowState } =
    useFollow(comment.author.username, false);

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
          {comment.author.name ?? comment.author.username}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {comment.author.username !== authenticatedUser?.username && (
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
        {canUpdateComment(authenticatedUser, comment) && (
          <>
            {/* <DropdownMenuItem>
              <Link
                href={`/comments/${comment.id}/edit`}
                className="w-full flex gap-2 items-center justify-between"
              >
                Edit
                <SquarePen className="text-blue-500" />
              </Link>
            </DropdownMenuItem> */}
            <DropdownMenuItem>
              <button
                className="w-full flex gap-2 items-center justify-between cursor-pointer"
                onClick={async () => {
                  toast.promise(deleteComment(comment.id), {
                    loading: "Deleting comment...",
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
                      return "Comment deleted successfully.";
                    },
                    error: "Error deleting comment. Please try again.",
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

export default CommentMoreDropdownMenu;
