import React from "react";
import { cn } from "@/lib/utils";

const Container = ({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) => {
  return (
    <div className={cn("container max-w-2xl px-4 mx-auto", className)}>
      {children}
    </div>
  );
};

export default Container;
