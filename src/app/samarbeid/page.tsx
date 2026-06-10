import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Partnerships",
  description:
    "Partner with Scandinavian Living — sponsored posts, product reviews and affiliate collaborations within interiors and home living.",
};

const offerings = [
  {
    title: "Sponsored blog posts",
    description:
      "A dedicated post where your product or service is presented naturally in a relevant context.",
  },
  {
    title: "Product reviews",
    description:
      "Honest, thorough reviews of products within interiors, furniture and smart home solutions.",
  },
  {
    title: "Affiliate partnerships",
    description:
      "Long-term collaborations with affiliate links integrated into relevant content and product cards.",
  },
  {
    title: "Social media",
    description:
      "Visibility through Pinterest and TikTok, with content tailored to each platform.",
  },
];

const stats = [
  { label: "Page views / month", value: "—" },
  { label: "Pinterest followers", value: "—" },
  { label: "TikTok followers", value: "—" },
  { label: "Newsletter subscribers", value: "—" },
];

export default function SamarbeidPage() {
  return (
    <div className="container-content flex flex-col gap-16 py-10 sm:py-14">
      <section className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage-dark">
          Partnerships
        </p>
        <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl lg:text-5xl">
          Let&apos;s create beautiful content together
        </h1>
        <p className="mt-5 text-base text-ink/70">
          Scandinavian Living partners with brands that share our love of simple,
          functional and beautiful design. Below you&apos;ll find how we can work
          together, and how to get in touch.
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        {offerings.map((item) => (
          <div key={item.title} className="rounded-xl2 border border-sand bg-white p-6">
            <h3 className="font-serif text-xl font-semibold text-ink">{item.title}</h3>
            <p className="mt-2 text-sm text-ink/70">{item.description}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl2 bg-sage/10 p-8 sm:p-12">
        <h2 className="text-center font-serif text-2xl font-semibold text-ink sm:text-3xl">
          Stats &amp; reach
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-3xl font-semibold text-sage-dark">{stat.value}</p>
              <p className="mt-1 text-sm text-ink/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Media kit CTA */}
      <section className="rounded-xl2 bg-wood/15 px-6 py-10 text-center sm:px-12">
        <h2 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
          Want to collaborate?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-ink/70">
          Send me an email or fill out the contact form, and I&apos;ll send you our
          media kit with stats, audience and pricing.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/kontakt"
            className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sage-dark"
          >
            Contact me
          </Link>
          <a
            href="mailto:hello@scandinavianliving.com"
            className="rounded-full border border-sand bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-sage hover:text-sage-dark"
          >
            hello@scandinavianliving.com
          </a>
        </div>
      </section>
    </div>
  );
}
