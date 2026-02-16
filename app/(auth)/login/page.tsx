import LoginForm from "@/components/LoginForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
export default async function LoginPage() {
  const session = await auth();
  if (session && session.user) {
    redirect("/");
  }
  return <LoginForm />;
}
