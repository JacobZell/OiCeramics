import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Oi Ceramics — Handmade Pottery, Madison WI",
    template: "%s | Oi Ceramics",
  },
  description:
    "Handmade stoneware pottery by Jacob Zell in Madison, Wisconsin. Wheel-thrown mugs, bowls, vases, and more — each piece glazed by hand at The Bodgery makerspace.",
  keywords: [
    "handmade pottery Madison WI",
    "ceramics Madison Wisconsin",
    "wheel thrown pottery",
    "stoneware pottery",
    "local pottery Madison",
    "pottery gifts Wisconsin",
    "ceramic mugs handmade",
    "pottery near me Madison",
    "farmers market pottery Madison",
    "Wisconsin Craft Fair pottery",
    "art market Madison",
    "Jacob Zell ceramics",
    "Oi Ceramics",
    "functional stoneware",
    "handmade ceramics Wisconsin",
    "wabi-sabi pottery",
    "custom pottery orders Wisconsin",
    "pottery studio Madison",
  ],
  authors: [{ name: "Jacob Zell" }],
  creator: "Jacob Zell",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Oi Ceramics",
    title: "Oi Ceramics — Handmade Pottery, Madison WI",
    description:
      "Handmade stoneware pottery by Jacob Zell in Madison, Wisconsin. Wheel-thrown, glazed by hand.",
    images: [
      {
        url: "/images/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Oi Ceramics — Handmade Pottery, Madison WI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oi Ceramics — Handmade Pottery, Madison WI",
    description:
      "Handmade stoneware pottery by Jacob Zell in Madison, Wisconsin.",
    images: ["/images/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Oi Ceramics",
    description:
      "Handmade stoneware pottery by Jacob Zell, wheel-thrown and glazed by hand in Madison, Wisconsin.",
    url: BASE_URL,
    email: "oiceramicsmadison@gmail.com",
    image: `${BASE_URL}/images/hero.jpg`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Madison",
      addressRegion: "WI",
      addressCountry: "US",
    },
    sameAs: ["https://www.instagram.com/oi__ceramics"],
    priceRange: "$$",
    currenciesAccepted: "USD",
    paymentAccepted: "Credit Card",
    knowsAbout: [
      "wheel-thrown pottery",
      "stoneware ceramics",
      "handmade pottery",
      "wabi-sabi",
      "MTM Brown stoneware",
    ],
  };

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-cream text-earth" suppressHydrationWarning>
        <Providers>
          <Nav />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
