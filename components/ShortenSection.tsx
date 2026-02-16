"use client";
import {
  useActionState,
  useEffect,
  useEffectEvent,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { urlSchema } from "@/app/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createShortUrl } from "@/lib/queries/links";
import Toast from "./Toast";
import { Link, Loader2 } from "lucide-react";
import CopyButton from "./CopyButton";

export default function ShortenSection({
  setLinkAdded,
}: {
  setLinkAdded: Dispatch<SetStateAction<number>>;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  // States
  const [message, formAction, isPending] = useActionState(createShortUrl, null);
  const [showMessage, setShowMessage] = useState(false);
  //   Form
  const {
    register,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
    },
    mode: "all",
  });

  // useEffects
  const displayToast = useEffectEvent(() => {
    setShowMessage(true);
  });
  useEffect(() => {
    if (!message) return;
    displayToast();
  }, [message]);
  const incrementLinkEvent = useEffectEvent(() => {
    setLinkAdded((prev) => prev + 1);
  });
  useEffect(() => {
    if (!message) return;
    if (!message.success) return;
    incrementLinkEvent();
  }, [message]);

  return (
    <div className="w-full flex  flex-col gap-8 justify-center lg:px-10 text-neutral-800">
      <div className="flex flex-col gap-12 items-center">
        <div className="flex flex-col w-full items-center">
          <p className="font-serif text-center text-[32px] leading-tight">
            Shortly
          </p>
          <p className="max-w-110 w-full text-center text-neutral-500">
            Start shortening your links and collect data seamlessly. Create a
            new link now to simplify sharing and gain valueable insights.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full items-center">
          <form className="w-full justify-center flex" action={formAction}>
            <div className="flex relative w-full max-w-122.5">
              <input
                autoFocus
                type="text"
                placeholder="Paste link here"
                className="border border-neutral-800 w-full bg-white rounded-l-md py-3 pr-2 pl-11 placeholder:text-neutral-400"
                {...register("url")}
                disabled={isPending}
              />
              <Link
                size={18}
                className="text-neutral-400 absolute top-[50%] left-4 -translate-y-[50%]"
              />
            </div>
            <button
              type="submit"
              disabled={!isValid || isPending}
              className="px-4 py-3 bg-neutral-800 text-white rounded-r-md  duration-200 transition-colors disabled:opacity-65 disabled:cursor-not-allowed not-disabled:hover:bg-neutral-700 w-24 flex justify-center items-center"
            >
              {isPending ? (
                <Loader2 size={18} className="text-white animate-spin" />
              ) : (
                "Shorten"
              )}
            </button>
          </form>
          {errors && errors.url && (
            <p className="text-center text-[12px] text-red-800">
              {errors.url.message}
            </p>
          )}
        </div>
      </div>
      {message && message.success && message.urlData && (
        <div className="flex flex-col w-full items-center">
          <p className="text-[14px] text-neutral-600">
            {message.urlData?.longUrl}
          </p>
          <div className="flex gap-3 ">
            <span>Shortened Url</span>
            <p className="font-medium">{appUrl + message.urlData?.shortUrl}</p>
            <CopyButton text={appUrl + message.urlData?.shortUrl} />
          </div>
        </div>
      )}
      {showMessage && message && (
        <Toast
          type={message.success ? "success" : "error"}
          title={message.success ? "Successful" : "Failed"}
          message={message.message}
          closeToast={() => {
            setShowMessage(false);
          }}
        />
      )}
    </div>
  );
}
