import { getSingleLink } from "@/lib/queries/links";
import { notFound, redirect } from "next/navigation";
export default async function LinkRedirectPage({
  params,
}: {
  params: Promise<{ link: string }>;
}) {
  const { link } = await params;
  console.log(link);
  const res = await getSingleLink(link);
  if (res.success && res.longUrl) redirect(res.longUrl);
  else notFound();
}
