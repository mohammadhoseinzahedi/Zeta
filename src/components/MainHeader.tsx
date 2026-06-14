import Container from "@/components/Container";
import React from "react";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { House } from "lucide-react";
import { Pencil } from "lucide-react";
import { getUserByUsername } from "@/db/user";
import UserAvatar from "./user/UserAvatar";
import { getAuthenticatedUser } from "@/lib/auth";

const MainHeader = async () => {
  const authenticatedUser = await getAuthenticatedUser();
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <Container className="py-3 flex gap-2 items-center justify-between">
        {authenticatedUser ? (
          <Link
            href={`/users/${authenticatedUser.username}`}
            className="flex gap-2 items-center"
          >
            <UserAvatar user={authenticatedUser} />
          </Link>
        ) : (
          <Link
            href={`/signin`}
            className="flex gap-2 items-center text-slate-900 text-sm"
          >
            <LogIn /> Signin
          </Link>
        )}
        <div className="flex gap-6 items-center">
          <Link href="/posts" className="text-slate-800">
            <House size={22} />
          </Link>
          <Link href="/posts/create" className="text-slate-800">
            <Pencil size={22} />
          </Link>
        </div>

        <Button disabled={true} className="rounded-full bg-blue-800">
          Premium
        </Button>
      </Container>
    </header>
  );
};

export default MainHeader;
