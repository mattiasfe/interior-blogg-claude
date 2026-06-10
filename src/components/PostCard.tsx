import Image from "next/image";
import Link from "next/link";
import { Post } from "@/lib/posts";
import PinButton from "./PinButton";

const siteUrl = "https://www.skandinaviskbo.no";

export default function PostCard({ post, priority }: { post: Post; priority?: boolean }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl2 border border-sand bg-white transition-shadow hover:shadow-lg">
      <Link href={`/blogg/${post.slug}`} className="relative block aspect-[4/5] w-full overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <PinButton
          imageUrl={post.coverImage}
          pageUrl={`${siteUrl}/blogg/${post.slug}`}
          description={post.title}
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sage-dark">
          {post.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-serif text-xl font-semibold leading-snug text-ink">
          <Link href={`/blogg/${post.slug}`} className="hover:text-sage-dark">
            {post.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-ink/70">{post.description}</p>
        <div className="mt-auto flex items-center justify-between pt-3 text-xs text-ink/50">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          <span>{post.readingTime}</span>
        </div>
      </div>
    </article>
  );
}
