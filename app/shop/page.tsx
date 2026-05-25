import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts, getProductsByCategory, getCategories } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Shop Handmade Pottery",
  description:
    "Browse handmade stoneware pottery — mugs, bowls, plates, vases, and more. Every piece wheel-thrown and glazed by hand in Madison, Wisconsin. Ships nationwide.",
  alternates: { canonical: "/shop" },
};

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function ShopPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const allCategories = getCategories();
  const products = category ? getProductsByCategory(category) : getAllProducts();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
      <h1 className="font-serif text-4xl md:text-5xl text-earth mb-10">
        Shop
      </h1>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        <Link
          href="/shop"
          className={`text-xs tracking-widest uppercase px-4 py-2 border transition-colors ${
            !category
              ? "border-earth text-earth bg-earth/5"
              : "border-sand text-bark hover:border-clay hover:text-clay"
          }`}
        >
          All
        </Link>
        {allCategories.map((cat) => (
          <Link
            key={cat}
            href={`/shop?category=${cat}`}
            className={`text-xs tracking-widest uppercase px-4 py-2 border transition-colors ${
              category === cat
                ? "border-earth text-earth bg-earth/5"
                : "border-sand text-bark hover:border-clay hover:text-clay"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="text-bark text-sm">Nothing here yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
