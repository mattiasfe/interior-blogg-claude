import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Scandinavian Living for questions, partnerships or feedback.",
};

export default function KontaktPage() {
  return (
    <div className="container-content py-10 sm:py-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage-dark">
          Contact
        </p>
        <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl lg:text-5xl">
          Get in touch
        </h1>
        <p className="mt-5 text-base text-ink/70">
          Have questions, feedback, or want to collaborate? Fill out the form
          below and I&apos;ll get back to you as soon as possible.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-xl">
        <ContactForm />
      </div>
    </div>
  );
}
