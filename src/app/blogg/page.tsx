import type { Metadata } from "next";
import { Suspense } from "react";
import CategoryFilter from "@/components/CategoryFilter";
import PostCard from "@/components/PostCard";
import AdSlot from "@/components/AdSlot";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "All articles about Scandinavian interiors, small apartments, furniture solutions and home inspiration.",
};

type BloggPageProps = {
  searchParams: { category?: string };
};

export default function BloggPage({ searchParams }: BloggPageProps) {
  const allPosts = getAllPosts();
  const activeCategory = searchParams.category;

  const posts = activeCategory
    ? allPosts.filter((post) => post.category === activeCategory)
    : allPosts;

  return (
    <div className="container-content flex flex-col gap-10 py-10 sm:py-14">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-semibold text-ink sm:text-4xl">Blog</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-ink/70 sm:text-base">
          Inspiration, tips and guides for Scandinavian interiors, small apartments
          and smart furniture solutions.
        </p>
      </div>

      <Suspense fallback={null}>
        <CategoryFilter />
      </Suspense>

      {posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <PostCard key={post.slug} post={post} priority={i === 0} />
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-ink/60">
          No posts in this category yet — check back soon!
        </p>
      )}

      <AdSlot variant="mid" />
    </div>
  );
}
