"use client";

import { useCart } from "@/components/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`;
}

export function CartDrawer() {
  const { items, removeItem, updateQuantity, total, count, isOpen, closeCart } =
    useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    if (items.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong.");
        return;
      }
      const { url } = await res.json();
      router.push(url);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-earth/20 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-cream shadow-xl flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-sand">
          <span className="font-serif text-lg text-earth">
            Cart{count > 0 ? ` (${count})` : ""}
          </span>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="text-bark hover:text-earth transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-bark text-sm">
            Your cart is empty.
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto divide-y divide-sand px-6">
              {items.map((item) => (
                <li key={item.id} className="py-4 flex gap-4">
                  <div className="w-16 h-16 shrink-0 bg-parchment relative overflow-hidden">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-parchment to-sand" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-earth font-medium truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-bark mt-0.5">
                      {formatPrice(item.price)}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-6 h-6 border border-sand flex items-center justify-center text-bark hover:border-clay hover:text-clay transition-colors text-sm"
                      >
                        −
                      </button>
                      <span className="text-sm text-earth w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-6 h-6 border border-sand flex items-center justify-center text-bark hover:border-clay hover:text-clay transition-colors text-sm"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-xs text-ash hover:text-bark transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="px-6 py-5 border-t border-sand space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-bark">Subtotal</span>
                <span className="text-earth font-medium">
                  {formatPrice(total)}
                </span>
              </div>
              <p className="text-xs text-ash">
                Shipping calculated at checkout.
              </p>
              {error && <p className="text-xs text-clay">{error}</p>}
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-earth text-cream text-sm tracking-wide uppercase py-3 hover:bg-bark transition-colors disabled:opacity-50"
              >
                {loading ? "Redirecting…" : "Checkout"}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
