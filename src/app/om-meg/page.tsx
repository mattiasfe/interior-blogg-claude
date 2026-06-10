import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Get to know the person behind Scandinavian Living — interior inspiration for small apartments and calm homes.",
};

export default function OmMegPage() {
  return (
    <div className="container-content flex flex-col gap-16 py-10 sm:py-14">
      <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl2 lg:order-2">
          <Image
            src="https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1200&auto=format&fit=crop"
            alt="Cozy home office in Scandinavian style"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="lg:order-1">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage-dark">
            Hi, and welcome
          </p>
          <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl lg:text-5xl">
            I&apos;m Mathilde, and this is Scandinavian Living
          </h1>
          <div className="mt-5 space-y-4 text-base text-ink/70">
            <p>
              Scandinavian Living was started with one goal: to show that a
              beautiful home isn&apos;t about square meters, but about good choices.
              I live in a small apartment in Oslo myself, and have spent years
              finding smart solutions that look great and work in everyday life.
            </p>
            <p>
              On this blog I share interior inspiration, practical tips for small
              apartments, and recommendations for furniture and products I actually
              use myself. The style is consistently Scandinavian — light colors,
              natural materials and a calm, considered whole.
            </p>
            <p>
              You can also find me on Pinterest and TikTok, where I share quick
              home hacks and room makeovers almost daily.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/blogg"
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sage-dark"
            >
              Read the blog
            </Link>
            <Link
              href="/samarbeid"
              className="rounded-full border border-sand px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-sage hover:text-sage-dark"
            >
              Partner with me
            </Link>
          </div>
        </div>
      </section>

      {/* Media kit / partnership CTA */}
      <section className="rounded-xl2 bg-wood/15 px-6 py-10 text-center sm:px-12">
        <h2 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
          Partner with Scandinavian Living
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-ink/70">
          I collaborate with brands in interiors, furniture and sustainable design
          that fit naturally into my content. Download the media kit for stats,
          audience and collaboration formats.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/samarbeid"
            className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sage-dark"
          >
            See partnership options
          </Link>
          <Link
            href="/kontakt"
            className="rounded-full border border-sand bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-sage hover:text-sage-dark"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}
