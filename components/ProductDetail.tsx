"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartContext";
import type { Product } from "@/lib/db";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`;
}

export function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const isSoldOut = product.sold_out === 1 || product.inventory === 0;

  function handleAdd() {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
      <Link
        href="/shop"
        className="text-xs tracking-widest uppercase text-bark hover:text-clay transition-colors mb-10 inline-block"
      >
        ← Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
        <div className="aspect-square bg-parchment relative overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-parchment to-sand" />
          )}
        </div>

        <div className="pt-2">
          {product.category && (
            <p className="text-xs tracking-[0.3em] uppercase text-bark mb-3">
              {product.category}
            </p>
          )}
          <h1 className="font-serif text-4xl md:text-5xl text-earth mb-3">
            {product.name}
          </h1>
          <p className="text-2xl text-bark mb-6">{formatPrice(product.price)}</p>

          {product.description && (
            <p className="text-bark text-sm leading-relaxed mb-8">
              {product.description}
            </p>
          )}

          {isSoldOut ? (
            <p className="text-sm tracking-widest uppercase text-ash border border-sand px-4 py-3 inline-block">
              Sold Out
            </p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-sand">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-bark hover:text-clay transition-colors"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm text-earth">
                    {qty}
                  </span>
                  <button
                    onClick={() =>
                      setQty((q) => Math.min(product.inventory, q + 1))
                    }
                    className="w-10 h-10 flex items-center justify-center text-bark hover:text-clay transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAdd}
                  className={`flex-1 py-3 text-sm tracking-widest uppercase transition-colors ${
                    added
                      ? "bg-sage text-cream"
                      : "bg-earth text-cream hover:bg-bark"
                  }`}
                >
                  {added ? "Added to Cart" : "Add to Cart"}
                </button>
              </div>
              <p className="text-xs text-ash">
                {product.inventory === 1
                  ? "Only 1 left."
                  : `${product.inventory} available.`}
              </p>
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-sand space-y-3 text-xs text-bark">
            <p>Wheel-thrown stoneware. Food and dishwasher safe.</p>
            <p>
              Each piece is slightly unique — handmade variation is expected and
              good.
            </p>
            <p>Ships within 3–5 business days. USPS Priority.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
