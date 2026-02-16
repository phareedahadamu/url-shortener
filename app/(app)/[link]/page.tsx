import { getSingleLink } from "@/lib/queries/links";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
export default async function LinkRedirectPage({
  params,
}: {
  params: Promise<{ link: string }>;
}) {
  const { link } = await params;
  // console.log(link);
  const headersList = await headers();
  const clickData = {
    ip: headersList.get("x-forwarded-for") || undefined,
    userAgent: headersList.get("user-agent") || undefined,
    referer: headersList.get("referer") || undefined,
    country: headersList.get("x-vercel-country") || undefined,
  };
  // console.log(clickData);
  const res = await getSingleLink(link, clickData);
  if (res.success && res.longUrl) redirect(res.longUrl);
  else notFound();
}
