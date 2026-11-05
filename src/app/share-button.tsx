"use client";

import { useState } from "react";

const SITE_URL = "https://life-in-commits.vercel.app/";

type ShareButtonProps = {
  weeksLived: number;
  daysLived: number;
  ageYears: number;
};

export default function ShareButton({ weeksLived, daysLived, ageYears }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const text = `I have lived ${weeksLived.toLocaleString("en-US")} weeks (${daysLived.toLocaleString("en-US")} days) at age ${ageYears}. Every week is one green box in my life grid. See your life in weeks:`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${text} ${SITE_URL} #BuildInPublic`)}`;

  async function handleShare() {
    const nav = navigator as Navigator & {
      share?: (data: { title: string; text: string; url: string }) => Promise<void>;
    };
    if (typeof nav.share === "function") {
      try {
        await nav.share({ title: "Life in Commits", text, url: SITE_URL });
      } catch {
        // The user closed the share sheet; nothing else to do.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(`${text} ${SITE_URL}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="share-row">
      <button className="share-button" type="button" onClick={handleShare}>
        {copied ? "Link copied" : "Share my life grid"}
      </button>
      <a className="share-x" href={xUrl} target="_blank" rel="noreferrer">
        Post on X
      </a>
    </div>
  );
}
