"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "scandinavian-living-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = window.localStorage.getItem(STORAGE_KEY);
    if (!consent) setVisible(true);
  }, []);

  function handleChoice(value: "accepted" | "declined") {
    window.localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-sand bg-white/95 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] backdrop-blur sm:p-5">
      <div className="container-content flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-center text-sm text-ink/80 sm:text-left">
          We use cookies to improve your experience and show relevant content and ads.
          Read more in our privacy policy.
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => handleChoice("declined")}
            className="rounded-full border border-sand px-4 py-2 text-sm font-medium text-ink/70 transition-colors hover:border-ink/30"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => handleChoice("accepted")}
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sage-dark"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
