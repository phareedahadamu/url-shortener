"use client";
import { Link as LinkType } from "@/generated/prisma/client";
import { getLinks } from "@/lib/queries/links";
import { useState, useEffect, useEffectEvent, useTransition } from "react";
import {
  Loader2,
  Sparkle,
  Waves,
  VenetianMask,
  EllipsisVertical,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { getMetrics } from "@/lib/queries/links";
import { Pagination } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import LinkDetails from "./LinkDetails";

export default function LinkTable({
  id,
  linkAdded,
}: {
  id: string;
  linkAdded: number;
}) {
  // Search Params
  const searchParams = useSearchParams();

  // page variable
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  // States
  const [links, setLinks] = useState<LinkType[] | null>(null);
  const [metrics, setMetrics] = useState<{
    totalLinks: number;
    totalClicks: number;
    highestClickCount: number;
  } | null>({
    totalLinks: 0,
    totalClicks: 0,
    highestClickCount: 0,
  });
  const [paginationInfo, setPaginationInfo] = useState<Pagination | null>(null);
  const [visibleExpandMenu, setVisibleExpandMenu] = useState(-1);
  const [showLinkDetails, setShowLinkDetails] = useState(false);
  const [linkId, setLinkId] = useState("");

  // Transition
  const [isFetching, startFetchingTransition] = useTransition();

  // table rows
  const tableRows = links ? (
    links.length < 1 ? (
      <tr>
        <td
          colSpan={4}
          className="border border-neutral-100 rounded-b-md py-4 text-center"
        >
          You dont have any links yet
        </td>
      </tr>
    ) : (
      links.map((link, index) => (
        <tr key={index}>
          <td className="py-4 border border-neutral-100 border-r-transparent px-4 text-[14px] min-w-50 ">
            {link.longUrl}
          </td>
          <td className="py-4 border border-neutral-100 border-x-transparent px-4 text-center text-[14px] min-w-25">
            {link.shortUrl}
          </td>
          <td className="py-4 border border-neutral-100 border-x-transparent px-4 text-center text-[14px]">
            {link.clickCount}
          </td>
          <td className="py-4 border border-neutral-100 border-l-transparent text-end pr-4 ">
            <div className="relative  mx-auto ">
              <button
                role="button"
                className={`p-2 rounded-sm hover:bg-neutral-100 cursor-pointer ${visibleExpandMenu === index ? "border border-neutral-600" : "border-none"} `}
                onClick={() => {
                  if (visibleExpandMenu == index) {
                    setVisibleExpandMenu(-1);
                  } else setVisibleExpandMenu(index);
                }}
                onBlur={() => {
                  setVisibleExpandMenu(-1);
                }}
              >
                <EllipsisVertical size={18} className="text-neutral-500" />
              </button>
              {visibleExpandMenu === index && (
                <ul
                  role="menu"
                  className="list-none absolute -bottom-1 bg-white translate-y-full right-0 w-fit border border-neutral-200 rounded-md p-1.5 z-100"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <li
                    role="menuitem"
                    className="text-neutral-500 text-[14px] cursor-pointer py-2 px-3 rounded-sm hover:bg-neutral-100 w-full max-w-50 text-nowrap flex items-center gap-2"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setLinkId(link.id);
                      setShowLinkDetails(true);
                      setVisibleExpandMenu(-1);
                    }}
                  >
                    <Eye size="14" className="text-inherit" /> View Details
                  </li>
                </ul>
              )}
            </div>
          </td>
        </tr>
      ))
    )
  ) : null;

  // Fetch Links- useEffect
  const linkSetEvent = useEffectEvent(
    (
      l: LinkType[] | null,
      m: {
        totalLinks: number;
        totalClicks: number;
        highestClickCount: number;
      } | null,
      pagination: Pagination | null,
    ) => {
      setLinks(l);
      setMetrics(m);
      setPaginationInfo(pagination);
    },
  );
  useEffect(() => {
    async function fetchLinks() {
      const allLinks = await getLinks(id, page);
      const allMetrics = await getMetrics(id);
      if (allLinks.data) {
        linkSetEvent(allLinks.data.links, allMetrics, allLinks.data.pagination);
      } else {
        linkSetEvent(null, null, null);
      }
    }
    startFetchingTransition(() => {
      fetchLinks();
    });
  }, [id, linkAdded, page]);

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
          <div className="lg:w-full max-md:overflow-x-auto max-md:w-screen">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="bg-neutral-100 text-center rounded-tl-md py-4 text-neutral-500">
                    Url
                  </th>
                  <th className="bg-neutral-100 text-center rounded-tr-md  py-4 text-neutral-500">
                    Short Url
                  </th>
                  <th className="bg-neutral-100 text-center  py-4 text-neutral-500 text-nowrap px-1">
                    Click count
                  </th>
                  <th className="bg-neutral-100 text-center  py-4 text-neutral-500"></th>
                </tr>
              </thead>
              <tbody>{tableRows}</tbody>
            </table>
          </div>
          {paginationInfo && (
            <div className="w-full flex justify-between items-center">
              <p className="text-[12px] text-neutral-500">
                Page{" "}
                <span className="font-semibold text-[14px] text-neutral-700">
                  {paginationInfo.page}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[14px] text-neutral-700">
                  {paginationInfo.totalPages}
                </span>
                {" ("}
                {paginationInfo.total}
                {" results)"}
              </p>
              <div className="flex gap-4">
                <Link
                  href={`/?page=${page - 1}`}
                  className={`${paginationInfo && paginationInfo.hasPrevPage ? "pointer-events-auto text-neutral-600 border-neutral-600" : "pointer-events-none border-neutral-400 text-neutral-400"} rounded-md p-1.5 border-[0.89px] `}
                >
                  <ChevronLeft size="20" className="text-inherit" />
                </Link>{" "}
                <Link
                  href={`/?page=${page + 1}`}
                  className={`${paginationInfo && paginationInfo.hasNextPage ? " pointer-events-auto text-neutral-600 border-neutral-600" : "pointer-events-none border-neutral-400 text-neutral-400"} p-1.5 rounded-md border-[0.89px] `}
                >
                  <ChevronRight size="20" className="text-inherit" />
                </Link>
              </div>
            </div>
          )}
        </section>
      )}
      {showLinkDetails && (
        <LinkDetails
          linkId={linkId}
          closeModal={() => {
            setShowLinkDetails(false);
          }}
        />
      )}
    </>
  );
}
