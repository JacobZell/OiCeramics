import Link from "next/link";
import Image from "next/image";
import { getAllPortfolioItems } from "@/lib/db";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default function AdminPortfolioPage() {
  const items = getAllPortfolioItems();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-earth">Portfolio</h1>
        <Link
          href="/admin/portfolio/new"
          className="bg-earth text-cream text-xs tracking-widest uppercase px-5 py-2.5 hover:bg-bark transition-colors"
        >
          + Add Item
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-bark text-sm">No portfolio items yet.</p>
      ) : (
        <div className="border border-sand divide-y divide-sand">
          <div className="hidden md:grid grid-cols-[48px_1fr_80px_1fr_60px_100px] gap-4 px-4 py-2 text-xs tracking-widest uppercase text-ash bg-cream/50">
            <span />
            <span>Title</span>
            <span>Year</span>
            <span>Exhibition</span>
            <span>Order</span>
            <span />
          </div>

          {items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[48px_1fr] md:grid-cols-[48px_1fr_80px_1fr_60px_100px] gap-4 px-4 py-3 items-center bg-cream hover:bg-cream/70 transition-colors"
            >
              <div className="w-12 h-12 relative overflow-hidden bg-parchment shrink-0">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.title ?? ""}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-parchment to-sand" />
                )}
              </div>

              <div>
                <p className="text-sm text-earth font-medium">
                  {item.title ?? "Untitled"}
                </p>
                <p className="text-xs text-ash md:hidden mt-0.5">
                  {item.year ?? "—"} · {item.exhibition || "—"}
                </p>
              </div>

              <span className="hidden md:block text-sm text-bark">
                {item.year ?? "—"}
              </span>

              <span className="hidden md:block text-sm text-bark truncate">
                {item.exhibition || "—"}
              </span>

              <span className="hidden md:block text-sm text-bark">
                {item.sort_order}
              </span>

              <div className="flex items-center gap-3 text-xs col-span-2 md:col-span-1 pl-16 md:pl-0">
                <Link
                  href={`/admin/portfolio/${item.id}/edit`}
                  className="text-bark hover:text-earth transition-colors"
                >
                  Edit
                </Link>
                <DeleteButton url={`/api/admin/portfolio/${item.id}`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
