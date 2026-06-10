import Image from "next/image";

export type Product = {
  name: string;
  description: string;
  imageUrl: string;
  price?: string;
  retailer: string;
  affiliateUrl: string;
};

/**
 * Affiliate product card. Replace `affiliateUrl` with real H&M / IKEA /
 * partner links when affiliate program access is approved.
 */
export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl2 border border-sand bg-white">
      <div className="relative aspect-square w-full">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-cream px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink/60">
Affiliate link
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-wood-dark">
          {product.retailer}
        </p>
        <h4 className="font-serif text-lg font-semibold text-ink">{product.name}</h4>
        <p className="text-sm text-ink/70">{product.description}</p>
        {product.price && (
          <p className="mt-1 text-sm font-semibold text-ink">{product.price}</p>
        )}
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="mt-3 inline-flex items-center justify-center rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sage-dark"
        >
View product
        </a>
      </div>
    </div>
  );
}
