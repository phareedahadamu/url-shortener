"use client";
import { Link } from "@/generated/prisma/client";
import { getLinks } from "@/lib/queries/links";
import { useState, useEffect, useEffectEvent, useTransition } from "react";
import { Loader2, Sparkle, Waves, VenetianMask } from "lucide-react";
import { getMetrics } from "@/lib/queries/links";

export default function LinkTable({
  id,
  linkAdded,
}: {
  id: string;
  linkAdded: number;
}) {
  // States
  const [links, setLinks] = useState<Link[] | null>(null);
  const [metrics, setMetrics] = useState<{
    totalLinks: number;
    totalClicks: number;
    highestClickCount: number;
  } | null>({
    totalLinks: 0,
    totalClicks: 0,
    highestClickCount: 0,
  });

  // Transition
  const [isFetching, startFetchingTransition] = useTransition();

  // table rows
  const tableRows = links ? (
    links.length < 1 ? (
      <tr>
        <td
          colSpan={3}
          className="border border-neutral-100 rounded-b-md py-4 text-center"
        >
          You dont have any links yet
        </td>
      </tr>
    ) : (
      links.map((link, index) => (
        <tr key={index}>
          <td className="py-4 border border-neutral-100 border-r-transparent px-4 text-[14px] ">
            {link.longUrl}
          </td>
          <td className="py-4 border border-neutral-100 border-x-transparent px-4 text-center text-[14px]">
            {link.shortUrl}
          </td>
          <td className="py-4 border border-neutral-100 border-l-transparent px-4 text-right text-[14px]">
            {link.clickCount}
          </td>
        </tr>
      ))
    )
  ) : null;

  // Fetch Links- useEffect
  const linkSetEvent = useEffectEvent(
    (
      l: Link[] | null,
      m: {
        totalLinks: number;
        totalClicks: number;
        highestClickCount: number;
      } | null,
    ) => {
      setLinks(l);
      setMetrics(m);
    },
  );
  useEffect(() => {
    async function fetchLinks() {
      const allLinks = await getLinks(id);
      const allMetrics = await getMetrics(id);
      linkSetEvent(allLinks.links, allMetrics);
    }
    startFetchingTransition(() => {
      fetchLinks();
    });
  }, [id, linkAdded]);
  return (
    <>
      {isFetching || !links ? (
        <div className="w-full flex justify-center">
          <Loader2 size="18" className="animate-spin text-neutral-700" />
        </div>
      ) : (
        <section className="flex flex-col gap-6 items-center w-full ">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 w-full max-w-200">
            <div className="border border-neutral-100 bg-neutral-50 rounded-md py-4 px-4 min-h-30 flex flex-col gap-4 justify-start">
              <div className="flex justify-between items-center">
                <p className="text-[14px] text-neutral-500">
                  Total number of links
                </p>
                <span className="rounded-full bg-lime-300 p-1.5 h-fit">
                  <Sparkle size={12} className="text-white" />
                </span>
              </div>
              <p className="text-[45px]">{metrics ? metrics.totalLinks : 0}</p>
            </div>
            <div className="border border-neutral-100 bg-neutral-50 rounded-md py-4 px-4 min-h-30 flex flex-col gap-4 justify-start">
              <div className="flex justify-between items-center">
                <p className="text-[14px] text-neutral-500">
                  Total number of clicks
                </p>
                <span className="rounded-full bg-pink-300 p-1.5 h-fit">
                  <VenetianMask size={12} className="text-white" />
                </span>
              </div>
              <p className="text-[45px]">{metrics ? metrics.totalClicks : 0}</p>
            </div>
            <div className="border border-neutral-100 bg-neutral-50 rounded-md py-4 px-4 min-h-30 flex flex-col gap-4 justify-start">
              <div className="flex justify-between items-center">
                <p className="text-[14px] text-neutral-500">
                  Highest clicks per link
                </p>
                <span className="rounded-full bg-violet-300  p-1.5 h-fit">
                  <Waves size={12} className="text-white" />
                </span>
              </div>
              <p className="text-[45px]">
                {metrics ? metrics.highestClickCount : 0}
              </p>
            </div>
          </div>
          <div className="w-full overflow-x-auto ">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="bg-neutral-100 text-center rounded-tl-md py-4 text-neutral-500">
                    Url
                  </th>
                  <th className="bg-neutral-100 text-center rounded-tr-md  py-4 text-neutral-500">
                    Short Url
                  </th>
                  <th className="bg-neutral-100 text-center  py-4 text-neutral-500">
                    Click count
                  </th>
                </tr>
              </thead>
              <tbody>{tableRows}</tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
