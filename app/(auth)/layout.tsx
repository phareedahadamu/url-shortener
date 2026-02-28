import { configOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(configOptions);
  if (session && session.user) {
    redirect("/");
  }
  return <>{children}</>;
}
