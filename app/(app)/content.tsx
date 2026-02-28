"use client";
import { User } from "@/generated/prisma/client";
import ShortenSection from "@/components/ShortenSection";
import Nav from "@/components/Nav";
import { useState } from "react"; 

import LinkTable from "@/components/LinkTable";

export default function PageContent({ user }: { user: User }) {
  const id = user.id;
  const [linkAdded, setLinkAdded] = useState(0);
  return (
    <div className="flex flex-col gap-8 pb-15 items-center w-full">
      <div className="flex justify-center bg-amber-200 pt-8 px-4 lg:px-8 pb-18 w-full ">
        <div className="flex flex-col gap-12  max-w-350 w-full ">
          <Nav username={user.username} />
          <ShortenSection setLinkAdded={setLinkAdded} />
        </div>
      </div>
      <div className="flex flex-col gap-6 px-4 lg:px-8 max-w-350 w-full items-center">
        <LinkTable id={id} linkAdded={linkAdded} />
      </div>
    </div>
  );
}
