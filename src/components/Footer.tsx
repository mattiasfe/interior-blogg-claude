import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-sand bg-white">
      <div className="container-content section-padding grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-xl font-semibold text-ink">Scandinavian Living</p>
          <p className="mt-3 text-sm text-ink/70">
            Inspiration for a calmer, more beautiful home — focused on Scandinavian
            design, small apartments and smart furniture solutions.
          </p>
        </div>

        <div>
          <p className="font-serif text-lg font-semibold text-ink">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-ink/70">
            <li><Link href="/blogg" className="hover:text-sage-dark">Blog</Link></li>
            <li><Link href="/om-meg" className="hover:text-sage-dark">About</Link></li>
            <li><Link href="/samarbeid" className="hover:text-sage-dark">Partnerships</Link></li>
            <li><Link href="/kontakt" className="hover:text-sage-dark">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-serif text-lg font-semibold text-ink">Categories</p>
          <ul className="mt-3 space-y-2 text-sm text-ink/70">
            <li><Link href="/blogg?category=Scandinavian+Style" className="hover:text-sage-dark">Scandinavian Style</Link></li>
            <li><Link href="/blogg?category=Small+Apartments" className="hover:text-sage-dark">Small Apartments</Link></li>
            <li><Link href="/blogg?category=Furniture+Solutions" className="hover:text-sage-dark">Furniture Solutions</Link></li>
            <li><Link href="/blogg?category=Inspiration" className="hover:text-sage-dark">Inspiration</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-serif text-lg font-semibold text-ink">Follow us</p>
          <ul className="mt-3 space-y-2 text-sm text-ink/70">
            <li>
              <a href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:text-sage-dark">
                Pinterest
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-sage-dark">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-sage-dark">
                TikTok
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="ad-zone-footer container-content mb-6">Ad space — footer</div>

      <div className="border-t border-sand py-6 text-center text-xs text-ink/60">
        © {new Date().getFullYear()} Scandinavian Living. All rights reserved.
      </div>
    </footer>
  );
}
