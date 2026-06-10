import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const siteUrl = "https://www.skandinaviskbo.no";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Scandinavian Living | Interiors, Small Apartments & Smart Furniture",
    template: "%s | Scandinavian Living",
  },
  description:
    "Inspiration for Scandinavian interiors, smart solutions for small apartments and furniture that saves space without sacrificing style.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Scandinavian Living",
    title: "Scandinavian Living | Interiors, Small Apartments & Smart Furniture",
    description:
      "Inspiration for Scandinavian interiors, smart solutions for small apartments and furniture that saves space without sacrificing style.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scandinavian Living",
    description:
      "Inspiration for Scandinavian interiors, smart solutions for small apartments and space-saving furniture.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${playfair.variable} flex min-h-screen flex-col bg-cream font-sans text-ink antialiased`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
