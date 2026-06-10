"use client";

import { useRouter, useSearchParams } from "next/navigation";

const categories = [
  "All",
  "Scandinavian Style",
  "Small Apartments",
  "Furniture Solutions",
  "Inspiration",
];

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") ?? "All";

  function handleSelect(category: string) {
    if (category === "All") {
      router.push("/blogg");
    } else {
      router.push(`/blogg?category=${encodeURIComponent(category)}`);
    }
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => handleSelect(category)}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            active === category
              ? "border-sage bg-sage text-white"
              : "border-sand bg-white text-ink/70 hover:border-sage hover:text-sage-dark"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
