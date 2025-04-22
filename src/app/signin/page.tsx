import { getAuthenticatedUser } from "@/auth";
import SignInForm from "@/components/auth/SignInForm";
import Container from "@/components/Container";
import { redirect } from "next/navigation";

const SignInPage = async () => {
  const authenticatedUser = await getAuthenticatedUser();
  if (authenticatedUser) redirect(`/users/${authenticatedUser.username}`);
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <Container className="max-w-sm p-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Sign In</h1>
        <p className="text-sm text-center text-gray-500 mb-4">
          Please enter your credentials to sign in.
        </p>
        <p className="text-sm text-center text-gray-500 mb-4">
          If you dont have an account, new account will be created with
          provided username and password.
        </p>
        <SignInForm />
      </Container>
    </div>
  );
};

export default SignInPage;
