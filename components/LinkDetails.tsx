"use client";
import { getLinkDetails } from "@/lib/queries/links";
import { useEffect, useEffectEvent, useState, useTransition } from "react";
import { Link, Click } from "@/generated/prisma/client";
import {
  Loader2,
  Link as Lnk,
  X,
  SquareMousePointer,
  Calendar,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import CopyButton from "./CopyButton";
export default function LinkDetails({
  linkId,
  closeModal,
}: {
  linkId: string;
  closeModal: () => void;
}) {
  // States
  const [link, setLink] = useState<(Link & { clicks: Click[] }) | null>(null);
  const [message, setMessage] = useState("");

  //   Transitions
  const [isFetching, startFetchingTransition] = useTransition();

  //   Effects
  const updateMessage = useEffectEvent((msg: string) => {
    setMessage(msg);
  });
  const updateLink = useEffectEvent((l: Link & { clicks: Click[] }) => {
    setLink(l);
  });
  useEffect(() => {
    if (!linkId) return;
    async function fetchLink() {
      const linkData = await getLinkDetails(linkId);
      if (!linkData.success || !linkData.link) {
        updateMessage(linkData.message);
        return;
      }
      updateLink(linkData.link);
    }
    startFetchingTransition(() => {
      fetchLink();
    });
  }, [linkId]);

  //   Click Table Rows
  const clickTableRows = !link ? null : link.clicks.length < 1 ? (
    <tr>
      <td colSpan={5} className="text-center py-4 border border-neutral-100">
        {" "}
        No clicks yet
      </td>
    </tr>
  ) : (
    link.clicks.map((click) => (
      <tr key={click.id}>
        <td className="py-4 border border-neutral-100 border-r-transparent px-4 text-[14px] text-center">
          {click.ip ?? "-"}
        </td>
        <td className="py-4 border border-neutral-100 border-x-transparent px-4 text-[14px] text-center">
          {click.userAgent ?? "-"}
        </td>
        <td className="py-4 border border-neutral-100 border-x-transparent px-4 text-[14px]  text-center">
          {click.referer ?? "-"}
        </td>
        <td className="py-4 border border-neutral-100 border-x-transparent px-4 text-[14px] text-center">
          {click.country ?? "-"}
        </td>
        <td className="py-4 border border-neutral-100 border-l-transparent px-4 text-[14px] text-center">
          {formatDateTime(click.createdAt)}
        </td>
      </tr>
    ))
  );
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/25 backdrop-blur-sm lg:p-15 p-4.5">
      <div className="bg-white rounded-lg flex flex-col border-[0.89px] border-neutral-400 h-[calc(100dvh-36px)] lg:h-[calc(100dvh-120px)] overscroll-y-auto gap-6 relative items-center p-4 lg:p-10">
        <button
          className="text-neutral-600 hover:text-neutral-500 cursor-pointer duration-200 transition-colors absolute right-5 top-5"
          onClick={() => {
            closeModal();
          }}
        >
          <X size={24} className="text-inherit" />
        </button>
        <p className="font-semibold text-[28px] text-neutral-700 w-full text-center">
          Link Details
        </p>
        {isFetching ? (
          <Loader2 size={24} className="animate-spin text-neutral-500" />
        ) : !link ? (
          <p className="text-[14px] text-neutral-600 text-center">{message}</p>
        ) : (
          <>
            <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5 w-full">
                <p className="flex gap-1 text-[14px] text-neutral-500 items-center">
                  <Lnk size="14" className="text-inherit" /> Long url
                </p>
                <p className="font-medium text-neutral-700">{link.longUrl}</p>
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <p className="flex gap-1 text-[14px] text-neutral-500 items-center">
                  <Lnk size="14" className="text-inherit" /> Short url
                </p>
                <p className="font-medium text-neutral-700 flex gap-1 items-center">
                  {link.shortUrl} <CopyButton text={link.shortUrl} />
                </p>
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <p className="flex gap-1 text-[14px] text-neutral-500 items-center">
                  <SquareMousePointer size="14" className="text-inherit" />{" "}
                  Click count
                </p>
                <p className="font-medium text-neutral-700">
                  {link.clickCount}
                </p>
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <p className="flex gap-1 text-[14px] text-neutral-500 items-center">
                  <Calendar size="14" className="text-inherit" /> Created at
                </p>
                <p className="font-medium text-neutral-700">
                  {formatDateTime(link.createdAt)}
                </p>
              </div>
            </div>
            <div className="w-full py-8">
              <hr className="w-full text-neutral-300" />
            </div>
            <div className="flex flex-col w-full items-center gap-3">
              <p className="w-full text-center font-medium text-[20px]">
                Clicks
              </p>
              <div className="lg:w-full w-[calc(100dvw-36px)] overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="bg-neutral-100 text-center rounded-tl-md p-4 text-neutral-500 text-[14px]">
                        IP
                      </th>
                      <th className="bg-neutral-100 text-center rounded-tl-md p-4 text-neutral-500 text-[14px]">
                        User Agent
                      </th>
                      <th className="bg-neutral-100 text-center rounded-tl-md p-4 text-neutral-500 text-[14px]">
                        Referer
                      </th>
                      <th className="bg-neutral-100 text-center rounded-tl-md p-4 text-neutral-500 text-[14px]">
                        Country
                      </th>
                      <th className="bg-neutral-100 text-center rounded-tl-md p-4 text-neutral-500 text-[14px]">
                        Created at
                      </th>
                    </tr>
                  </thead>
                  <tbody>{clickTableRows}</tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
