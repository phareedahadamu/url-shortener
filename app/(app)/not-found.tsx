"use client";
import Link from "next/link";
export default function NotFound() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center text-neutral-700 bg-amber-50">
      <p className="text-[18px] font-serif">Shortly</p>
      <p className="text-[80px] leading-snug">404</p>
      <div className="flex flex-col gap-6 items-center">
        <div className="flex flex-col gap-2 items-center">
          <p>Page not found</p>
          <p>Sorry we can&apos;t find the page you are looking for</p>
        </div>
        <Link
          href="/"
          className="rounded-md px-5 py-3 bg-neutral-800 cursor-pointer hover:bg-neutral-700 duration-200 transition-colors text-white"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
