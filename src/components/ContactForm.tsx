"use client";

import { useState } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Placeholder only — connect to a form backend (e.g. Formspree, Resend) later.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl2 border border-sand bg-white p-8 text-center">
        <h2 className="font-serif text-xl font-semibold text-ink">Thank you for your message!</h2>
        <p className="mt-2 text-sm text-ink/70">
          I&apos;ve received your message and will get back to you as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl2 border border-sand bg-white p-6 sm:p-8"
    >
      <div>
        <label htmlFor="name" className="text-sm font-medium text-ink">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1.5 w-full rounded-lg border border-sand bg-cream px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1.5 w-full rounded-lg border border-sand bg-cream px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="subject" className="text-sm font-medium text-ink">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          className="mt-1.5 w-full rounded-lg border border-sand bg-cream px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30"
          placeholder="What is this about?"
        />
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-ink">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-1.5 w-full resize-none rounded-lg border border-sand bg-cream px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30"
          placeholder="Write your message here..."
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sage-dark"
      >
        Send message
      </button>
    </form>
  );
}
