"use client";
import { signOut } from "next-auth/react";
export default function Nav({ username }: { username: string }) {
  return (
    <nav className="w-full flex justify-between">
      <p className="text-[16px] text-neutral-700">
        {`hello, `}
        <span className="text-neutral-900 font-medium text-[20px]">
          {username[0].toUpperCase() + username.slice(1)}
        </span>
      </p>
      <form
        action={async () => {
          await signOut();
        }}
        className=""
      >
        <button
          className="cursor-pointer border rounded-md border-neutral-700 px-4 py-1.5 text-base hover:border-neutral-500 transition-colors duration-200"
          type="submit"
          onClick={() => {
            console.log("Olay");
          }}
        >
          Sign Out
        </button>
      </form>
    </nav>
  );
}
