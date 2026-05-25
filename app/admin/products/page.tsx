import Link from "next/link";
import Image from "next/image";
import { getAllProducts } from "@/lib/db";
import { DeleteButton } from "@/components/admin/DeleteButton";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function AdminProductsPage() {
  const products = getAllProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-earth">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-earth text-cream text-xs tracking-widest uppercase px-5 py-2.5 hover:bg-bark transition-colors"
        >
          + Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-bark text-sm">No products yet.</p>
      ) : (
        <div className="border border-sand divide-y divide-sand">
          {/* Header */}
          <div className="hidden md:grid grid-cols-[48px_1fr_80px_100px_60px_80px_80px_100px] gap-4 px-4 py-2 text-xs tracking-widest uppercase text-ash bg-cream/50">
            <span />
            <span>Name</span>
            <span>Price</span>
            <span>Category</span>
            <span>Inv</span>
            <span>Featured</span>
            <span>Sold Out</span>
            <span />
          </div>

          {products.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-[48px_1fr] md:grid-cols-[48px_1fr_80px_100px_60px_80px_80px_100px] gap-4 px-4 py-3 items-center bg-cream hover:bg-cream/70 transition-colors"
            >
              {/* Thumbnail */}
              <div className="w-12 h-12 relative overflow-hidden bg-parchment shrink-0">
                {p.image_url ? (
                  <Image
                    src={p.image_url}
                    alt={p.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-parchment to-sand" />
                )}
              </div>

              {/* Name */}
              <div>
                <p className="text-sm text-earth font-medium">{p.name}</p>
                <p className="text-xs text-ash md:hidden mt-0.5">
                  {formatPrice(p.price)} · {p.category ?? "—"}
                </p>
              </div>

              {/* Price */}
              <span className="hidden md:block text-sm text-bark">
                {formatPrice(p.price)}
              </span>

              {/* Category */}
              <span className="hidden md:block text-sm text-bark capitalize">
                {p.category ?? "—"}
              </span>

              {/* Inventory */}
              <span className="hidden md:block text-sm text-bark">
                {p.inventory}
              </span>

              {/* Featured */}
              <span className="hidden md:block text-sm text-bark">
                {p.featured === 1 ? "✓" : "—"}
              </span>

              {/* Sold Out */}
              <span className="hidden md:block text-sm text-bark">
                {p.sold_out === 1 ? "✓" : "—"}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-3 text-xs col-span-2 md:col-span-1 pl-16 md:pl-0">
                <Link
                  href={`/admin/products/${p.id}/edit`}
                  className="text-bark hover:text-earth transition-colors"
                >
                  Edit
                </Link>
                <DeleteButton url={`/api/admin/products/${p.id}`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
