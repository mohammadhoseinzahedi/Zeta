"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const BackButton = () => {
  const router = useRouter();
  return (
    <ArrowLeft
      onClick={() => {
        router.back();
      }}
      className="cursor-pointer"
      role="button"
      aria-label="Go back"
    />
  );
};

export default BackButton;
