import Image from "next/image";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import PostCard from "@/components/PostCard";
import Newsletter from "@/components/Newsletter";
import InspirationGrid from "@/components/InspirationGrid";
import { categories, getFeaturedPosts } from "@/lib/posts";

const categoryImages: Record<string, string> = {
  "Scandinavian Style":
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop",
  "Small Apartments":
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop",
  "Furniture Solutions":
    "https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=800&auto=format&fit=crop",
  Inspiration:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop",
};

export default function Home() {
  const featuredPosts = getFeaturedPosts();

  return (
    <div className="container-content flex flex-col gap-16 py-8 sm:gap-20 sm:py-12">
      <AdSlot variant="header" />

      {/* Hero */}
      <section className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="order-2 lg:order-1">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage-dark">
            Scandinavian interiors &amp; smart living
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl lg:text-6xl">
            A calmer home, no matter how much space you have
          </h1>
          <p className="mt-5 max-w-lg text-base text-ink/70 sm:text-lg">
            Inspiration for Scandinavian design, smart solutions for small apartments
            and furniture that saves space — without sacrificing style.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/blogg"
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sage-dark"
            >
              Explore the blog
            </Link>
            <Link
              href="/om-meg"
              className="rounded-full border border-sand px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-sage hover:text-sage-dark"
            >
              About me
            </Link>
          </div>
        </div>

        <div className="relative order-1 aspect-[4/5] w-full overflow-hidden rounded-xl2 lg:order-2 lg:aspect-[3/4]">
          <Image
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1600&auto=format&fit=crop"
            alt="Scandinavian living room in light, warm tones"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Featured posts */}
      <section>
        <div className="flex flex-col gap-2 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
              Popular posts
            </h2>
            <p className="mt-1 text-sm text-ink/70">
              Hand-picked inspiration for your home.
            </p>
          </div>
          <Link
            href="/blogg"
            className="self-center text-sm font-semibold text-sage-dark hover:underline sm:self-auto"
          >
            View all posts →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPosts.map((post, i) => (
            <PostCard key={post.slug} post={post} priority={i === 0} />
          ))}
        </div>
      </section>

      {/* Category highlights */}
      <section>
        <h2 className="text-center font-serif text-2xl font-semibold text-ink sm:text-3xl">
          Explore by category
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/blogg?category=${encodeURIComponent(category)}`}
              className="group relative aspect-square overflow-hidden rounded-xl2"
            >
              <Image
                src={categoryImages[category]}
                alt={category}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-ink/30 transition-colors group-hover:bg-ink/40" />
              <span className="absolute inset-x-2 bottom-3 text-center font-serif text-base font-semibold text-white sm:text-lg">
                {category}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <AdSlot variant="mid" />

      {/* As seen on TikTok & Pinterest */}
      <InspirationGrid />

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}
