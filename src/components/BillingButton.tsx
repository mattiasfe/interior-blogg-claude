"use client";

import { useState } from "react";

/**
 * Sends the user to a Stripe-hosted page (Checkout or the Customer Portal).
 * No card details ever touch this app.
 */
export default function BillingButton({
  endpoint,
  label,
  pendingLabel,
  className,
}: {
  endpoint: "/api/stripe/checkout" | "/api/stripe/portal";
  label: string;
  pendingLabel: string;
  className?: string;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function go() {
    setPending(true);
    setError("");
    try {
      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setPending(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={go}
        disabled={pending}
        className={
          className ??
          "rounded-full bg-sage px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sage-dark disabled:cursor-not-allowed disabled:opacity-50"
        }
      >
        {pending ? pendingLabel : label}
      </button>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
