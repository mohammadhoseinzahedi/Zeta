import { getAuthenticatedUser } from "@/auth";
import SignInForm from "@/components/auth/SignInForm";
import Container from "@/components/Container";
import { redirect } from "next/navigation";

const SignInPage = async () => {
  const authenticatedUser = await getAuthenticatedUser();
  if (authenticatedUser) redirect(`/users/${authenticatedUser.username}`);
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-60px)] bg-gray-100 px-4">
      <Container className="max-w-sm p-6 bg-white rounded-3xl shadow-md">
        <h1 className="text-2xl font-bold text-center mb-8">Sign In</h1>
        <SignInForm />
        <p className="text-xs text-gray-500 mt-4">
          If you dont have an account,{" "}
          <span className="font-bold text-black">new account</span> will be
          created with provided username and password.
        </p>
      </Container>
    </div>
  );
};

export default SignInPage;
