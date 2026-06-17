import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import AdSlot from "@/components/AdSlot";
import PinButton from "@/components/PinButton";
import ShareButtons from "@/components/ShareButtons";
import PostCard from "@/components/PostCard";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/posts";

const siteUrl = "https://www.skandinaviskbo.com";

type PostPageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: PostPageProps): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  const url = `${siteUrl}/blogg/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      images: [{ url: post.coverImage }],
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.coverImage],
    },
  };
}

export default function PostPage({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const relatedPosts = getRelatedPosts(post);
  const url = `${siteUrl}/blogg/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.coverImage,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "DIYferger",
    },
    mainEntityOfPage: url,
  };

  return (
    <article className="container-content py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-3xl text-center">
        <Link
          href={`/blogg?category=${encodeURIComponent(post.category)}`}
          className="text-xs font-semibold uppercase tracking-wide text-sage-dark"
        >
          {post.category}
        </Link>
        <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center justify-center gap-3 text-sm text-ink/60">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
      </div>

      <div className="group relative mx-auto mt-8 aspect-[16/10] w-full max-w-4xl overflow-hidden rounded-xl2">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 900px"
          className="object-cover"
        />
        <PinButton imageUrl={`${siteUrl}${post.coverImage}`} pageUrl={url} description={post.title} />
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-10 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0">
          <div className="prose prose-neutral max-w-none prose-headings:font-serif prose-headings:text-ink prose-p:text-ink/80 prose-a:text-sage-dark prose-img:rounded-xl2">
            <MDXRemote source={post.content} />
          </div>

          <AdSlot variant="mid" />

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-sand pt-6">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-sand/60 px-3 py-1 text-xs font-medium text-ink/70"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <ShareButtons url={url} title={post.title} />
          </div>
        </div>

        <aside className="space-y-6">
          <AdSlot variant="sidebar" />
        </aside>
      </div>

      {relatedPosts.length > 0 && (
        <section className="mx-auto mt-16 max-w-5xl">
          <h2 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
            Related posts
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((related) => (
              <PostCard key={related.slug} post={related} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
