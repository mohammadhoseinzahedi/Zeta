import { Heart, MessageCircle } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

const PostSkeleton = () => {
  return (
    <>
      <div className="flex gap-2 items-center">
        <Skeleton className="size-8 rounded-full" />

        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="w-full h-64" />

        <div className="text-slate-100 text-sm flex items-center gap-6 border-y py-2 mt-5">
          <div className="flex gap-2 items-center">
            <MessageCircle size={20} />
            <Skeleton className="size-4" />
          </div>

          <div className="flex gap-2 items-center">
            <Heart size={20} />
            <Skeleton className="size-4" />
          </div>
        </div>
      </div>
    </>
  );
};

export default PostSkeleton;
