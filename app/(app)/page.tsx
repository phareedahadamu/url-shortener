import { getServerSession } from "next-auth/next";
import { configOptions } from "@/auth";
import { User } from "@/generated/prisma/client";
import { Suspense } from "react";
import PageContent from "./content";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(configOptions);
  if (!session || !session.user) redirect("/login");

  const user = session.user as User;

  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex justify-center items-center">
          <Loader2 size={40} className="animate-spin text-amber-200" />
        </div>
      }
    >
      <PageContent user={user} />
    </Suspense>
  );
}
