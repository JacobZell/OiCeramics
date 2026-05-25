"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartContext";
import type { Product } from "@/lib/db";
import { useState } from "react";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`;
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const isSoldOut = product.sold_out === 1 || product.inventory === 0;

  return (
    <Link href={`/shop/${product.id}`} className="group block">
      <div className="aspect-square bg-parchment overflow-hidden mb-3 relative">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-parchment to-sand" />
        )}
        {isSoldOut && (
          <div className="absolute inset-0 bg-cream/60 flex items-center justify-center">
            <span className="text-xs tracking-widest uppercase text-bark">
              Sold Out
            </span>
          </div>
        )}
      </div>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm text-earth font-medium leading-snug">
            {product.name}
          </p>
          <p className="text-sm text-bark mt-0.5">{formatPrice(product.price)}</p>
        </div>
        {!isSoldOut && (
          <button
            onClick={handleAdd}
            className={`shrink-0 text-xs tracking-wide border px-3 py-1.5 transition-colors ${
              added
                ? "border-sage text-sage"
                : "border-sand text-bark hover:border-clay hover:text-clay"
            }`}
          >
            {added ? "Added" : "Add"}
          </button>
        )}
      </div>
    </Link>
  );
}
