import Loading from "@/app/loading";
import UserForm from "@/components/user/UserForm";
import { getUserByUsername } from "@/db/user";
import { canCUD } from "@/modules/auth/lib/permissions";
import { verifySession } from "@/modules/auth/lib/session";
import { notFound, redirect, unauthorized } from "next/navigation";
import { Suspense } from "react";

const EditUser = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const authenticatedUser = await verifySession();
  if (!authenticatedUser) redirect("/api/auth/signin");
  if (!canCUD(username, authenticatedUser)) unauthorized();
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
