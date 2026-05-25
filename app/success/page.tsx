"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/components/CartContext";

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
      <p className="text-xs tracking-[0.3em] uppercase text-bark mb-6">
        Order confirmed
      </p>
      <h1 className="font-serif text-4xl md:text-6xl text-earth mb-6">
        Thank you.
      </h1>
      <p className="text-bark text-sm leading-relaxed max-w-sm mx-auto mb-10">
        Your order is on its way. You&apos;ll receive a confirmation email with
        tracking info within a few days.
      </p>
      <Link
        href="/shop"
        className="text-xs tracking-widest uppercase text-earth border-b border-earth pb-0.5 hover:text-clay hover:border-clay transition-colors"
      >
        Back to Shop →
      </Link>
    </div>
  );
}
