import Image from "next/image";

const images = [
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=800&auto=format&fit=crop",
];

export default function InspirationGrid() {
  return (
    <section>
      <div className="text-center">
        <h2 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
          As Seen on TikTok &amp; Pinterest
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-ink/70">
          Follow @diyferger for daily inspiration, room makeovers and quick home hacks.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        {images.map((src, i) => (
          <a
            key={src}
            href="https://www.pinterest.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-square overflow-hidden rounded-xl2"
          >
            <Image
              src={src}
              alt={`Interior inspiration ${i + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 16vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
