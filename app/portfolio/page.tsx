import type { Metadata } from "next";
import Image from "next/image";
import { getAllPortfolioItems } from "@/lib/db";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Gallery of handmade ceramic work by Jacob Zell — functional stoneware pieces made in Madison, Wisconsin. Wheel-thrown pottery shown at local art markets and juried shows.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  const items = getAllPortfolioItems();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
      <div className="mb-12">
        <p className="text-xs tracking-[0.3em] uppercase text-bark mb-4">
          Portfolio
        </p>
        <h1 className="font-serif text-4xl md:text-6xl text-earth leading-tight max-w-lg">
          The body of work.
        </h1>
      </div>

      <div className="space-y-20 md:space-y-28">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={`grid md:grid-cols-2 gap-8 md:gap-16 items-center ${
              i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-parchment to-sand">
              {item.image_url && (
                <Image
                  src={item.image_url}
                  alt={item.title ?? "Portfolio piece"}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              )}
            </div>
            <div className={i % 2 === 1 ? "" : "md:pl-8"}>
              {item.year && (
                <p className="text-xs tracking-[0.3em] uppercase text-ash mb-2">
                  {item.year}
                  {item.exhibition ? ` — ${item.exhibition}` : ""}
                </p>
              )}
              <h2 className="font-serif text-3xl md:text-4xl text-earth mb-4">
                {item.title}
              </h2>
              {item.description && (
                <p className="text-bark text-sm leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-bark text-sm">Portfolio coming soon.</p>
      )}
    </div>
  );
}
