"use client";

import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { LogOut } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SignoutButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignout = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/auth/signout");
      toast(response.data.message as string);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Signout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignout}
      disabled={isLoading}
      className={cn(
        buttonVariants({ variant: "outline" }),
        "text-xs text-slate-900 rounded-full cursor-pointer min-w-[90px] flex items-center gap-2",
        isLoading && "opacity-50 cursor-not-allowed",
      )}
    >
      <LogOut className="h-4 w-4" />
      {isLoading ? "Signing out..." : "Signout"}
    </button>
  );
};

export default SignoutButton;
