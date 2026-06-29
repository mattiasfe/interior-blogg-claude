import Image from "next/image";

const images = [
  "/images/inspiration2.jpg",
  "/images/inspiration3.jpg",
  "/images/inspiration5.jpg",
  "/images/inspiration14.jpg",
  "/images/inspiration6.jpg",
  "/images/inspiration7.jpg",
];

export default function InspirationGrid() {
  return (
    <section>
      <div className="text-center">
        <h2 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
          As Seen on Pinterest
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
