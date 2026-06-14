import Loading from "@/app/loading";
import { getAuthenticatedUser } from "@/lib/auth";
import UserForm from "@/components/user/UserForm";
import { getUserByUsername } from "@/db/user";
import { canUpdateUser } from "@/permissions/user";
import { notFound, redirect, unauthorized } from "next/navigation";
import { Suspense } from "react";

const EditUser = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const authenticatedUser = await getAuthenticatedUser();
  if (!authenticatedUser) redirect("/api/auth/signin");
  if (!canUpdateUser(authenticatedUser, username)) unauthorized();
  const user = await getUserByUsername(username, undefined);
  if (!user) notFound();
  return <UserForm user={user} />;
};

const EditUserPage = ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  return (
    <Suspense fallback={<Loading />}>
      <EditUser params={params} />
    </Suspense>
  );
};

export default EditUserPage;
