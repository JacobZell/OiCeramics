import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Oi Ceramics — Handmade Pottery, Madison WI",
  description:
    "Wheel-thrown stoneware pottery made by hand in Madison, Wisconsin. Shop mugs, bowls, vases, and one-of-a-kind pieces — each fired and glazed by hand at The Bodgery.",
  alternates: { canonical: "/" },
};

// Drop your images in public/images/ and set these paths.
// Set to null to show the placeholder gradient instead.
const HERO_IMAGE: string | null = "/images/hero.jpg";        // e.g. "/images/hero.jpg"
const ABOUT_IMAGE: string | null = "/images/studio.jpg";       // e.g. "/images/studio.jpg"

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-end pb-16 md:pb-24 overflow-hidden">
        {HERO_IMAGE ? (
          <>
            <Image
              src={HERO_IMAGE}
              alt="Pottery"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-earth/30" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-cream via-parchment to-sand" />
        )}
        <div className="relative max-w-6xl mx-auto px-6 w-full">
          <div className="max-w-xl">
            <p className={`text-xs tracking-[0.3em] uppercase mb-6 ${HERO_IMAGE ? "text-sand" : "text-bark"}`}>
              Madison, Wisconsin
            </p>
            <h1 className={`font-serif text-5xl md:text-7xl leading-[1.05] mb-8 ${HERO_IMAGE ? "text-cream" : "text-earth"}`}>
              Built to last.
              <br />
              Hard to look
              <br />
              away from.
            </h1>
            <Link
              href="/shop"
              className={`inline-flex items-center gap-3 text-sm tracking-widest uppercase border-b pb-0.5 transition-colors ${
                HERO_IMAGE
                  ? "text-cream border-cream hover:text-sand hover:border-sand"
                  : "text-earth border-earth hover:text-clay hover:border-clay"
              }`}
            >
              Shop Now
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="font-serif text-3xl text-earth">Featured</h2>
            <Link
              href="/shop"
              className="text-xs tracking-widest uppercase text-bark hover:text-clay transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* About strip */}
      <section className="border-t border-sand bg-parchment">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-sand to-ash/30">
            {ABOUT_IMAGE && (
              <Image
                src={ABOUT_IMAGE}
                alt="Studio"
                fill
                className="object-cover"
              />
            )}
          </div>
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-bark mb-4">
              The Work
            </p>
            <p className="font-serif text-2xl md:text-3xl text-earth leading-snug mb-6">
              Earthy and vibrant, something to look at.
            </p>
            <p className="text-bark text-sm leading-relaxed mb-6">
              I work out of The Bodgery, a nonprofit makerspace in Madison.
              Everything is wheel-thrown in stoneware and glazed by hand. What I&apos;m
              after is a surface with enough depth that you catch yourself staring
              a little longer than you expected and a form that earns its place
              on your table every morning.
            </p>
            <Link
              href="/portfolio"
              className="text-xs tracking-widest uppercase text-bark hover:text-clay border-b border-bark hover:border-clay pb-0.5 transition-colors"
            >
              See the full body of work →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
