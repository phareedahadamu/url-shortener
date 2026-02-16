"use client";

import { useState } from "react";
import { Copy, CopyCheck } from "lucide-react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  }

  return (
    <button onClick={handleCopy} type="button" className="">
      {copied ? (
        <CopyCheck size="18" className="text-neutral-700" />
      ) : (
        <Copy
          size="18"
          className="text-neutral-700 hover:text-neutral-600 duration-200 transition-colors cursor-pointer"
        />
      )}
    </button>
  );
}
