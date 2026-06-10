"use client";

import { useState } from "react";

export default function Newsletter() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Placeholder only — wire up to email provider (e.g. Mailchimp, Brevo) later.
    setSubmitted(true);
  }

  return (
    <section className="rounded-xl2 bg-sage/10 px-6 py-10 text-center sm:px-12">
      <h2 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
        Get this week&apos;s best interior tips
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink/70">
        Sign up for the newsletter for home inspiration, smart solutions for small
        spaces and exclusive offers — straight to your inbox.
      </p>

      {submitted ? (
        <p className="mx-auto mt-6 max-w-sm rounded-full bg-sage/20 px-4 py-3 text-sm font-medium text-sage-dark">
          Thanks for signing up! 🌿
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-full border border-sand bg-white px-5 py-3 text-sm text-ink placeholder:text-ink/40 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sage-dark"
          >
            Subscribe
          </button>
        </form>
      )}
    </section>
  );
}
