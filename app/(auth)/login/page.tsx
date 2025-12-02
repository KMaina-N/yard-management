import { getSession } from "@/lib/authentication";
import { LoginForm } from "./components/login-form";
import { redirect } from "next/navigation";

interface LoginPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getSession();

  // Await searchParams like this:
  const params = await searchParams;
  const callbackUrl = typeof params?.callbackUrl === "string" ? params.callbackUrl : "/";

  if (session?.isLoggedIn) {
    redirect(callbackUrl);
  }
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  )
}
