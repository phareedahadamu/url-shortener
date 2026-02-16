import SignUpForm from "@/components/SignUpForm";
import { configOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
export default async function LoginPage() {
  const session = await getServerSession(configOptions);
  if (session && session.user) {
    redirect("/");
  }
  return <SignUpForm />;
}
