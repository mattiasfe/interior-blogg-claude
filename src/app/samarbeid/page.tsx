import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Partnerships",
  description:
    "Partner with Scandinavian Living — sponsored posts, Pinterest pins and affiliate collaborations within interiors and home living.",
};

const stats = [
  "200,000–400,000 monthly Pinterest views",
  "Audience interest: home decor, interior design, lifestyle, furniture",
  "Content focus: Scandinavian style, small spaces, smart living",
];

const offerings = [
  {
    title: "Dedicated blog posts",
    description: "Featuring your products in a real home context.",
  },
  {
    title: "Pinterest pins",
    description: "With direct links to your product pages.",
  },
  {
    title: "Affiliate partnerships",
    description: "Honest, editorial-style recommendations.",
  },
  {
    title: "Long-term collaborations",
    description: "For brands that align with my aesthetic.",
  },
];

export default function SamarbeidPage() {
  return (
    <div className="container-content flex flex-col gap-16 py-10 sm:py-14">
      <section className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage-dark">
          Partnerships
        </p>
        <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl lg:text-5xl">
          Work With Me
        </h1>
        <p className="mt-5 text-base text-ink/70">
          I create interior inspiration content for people who want a beautiful
          home — without the big space or the big budget. My audience comes for
          Scandinavian style, small apartment ideas and smart furniture solutions.
        </p>
      </section>

      <section className="rounded-xl2 bg-sage/10 p-8 sm:p-12">
        <h2 className="text-center font-serif text-2xl font-semibold text-ink sm:text-3xl">
          By the numbers
        </h2>
        <ul className="mx-auto mt-6 max-w-xl space-y-3 text-center text-sm text-ink/70">
          {stats.map((stat) => (
            <li key={stat}>{stat}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-center font-serif text-2xl font-semibold text-ink sm:text-3xl">
          What I offer
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {offerings.map((item) => (
            <div key={item.title} className="rounded-xl2 border border-sand bg-white p-6">
              <h3 className="font-serif text-xl font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-2xl text-center">
        <p className="text-base text-ink/70">
          I work best with brands in furniture, home decor, textiles and lifestyle
          — companies like IKEA, Bolia, and similar Scandinavian and European
          brands that my audience already loves and trusts.
        </p>
      </section>

      {/* CTA */}
      <section className="rounded-xl2 bg-wood/15 px-6 py-10 text-center sm:px-12">
        <h2 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
          Let&apos;s talk
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-ink/70">
          If you think we&apos;re a good fit, I&apos;d love to hear from you. Send
          me a message through the contact form and tell me a little about your
          brand and what you have in mind.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-sm italic text-ink/60">
          I only partner with brands I genuinely believe in and would recommend
          to a friend.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/kontakt"
            className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sage-dark"
          >
            Contact me
          </Link>
        </div>
      </section>
    </div>
  );
}
