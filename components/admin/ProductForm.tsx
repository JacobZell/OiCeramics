"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Product } from "@/lib/db";

const CATEGORIES = [
  "mugs", "bowls", "plates", "vases", "dishes", "platters", "other",
];

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(
    product ? (product.price / 100).toFixed(2) : ""
  );
  const [category, setCategory] = useState(product?.category ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [inventory, setInventory] = useState(
    product?.inventory?.toString() ?? "1"
  );
  const [featured, setFeatured] = useState(product?.featured === 1);
  const [soldOut, setSoldOut] = useState(product?.sold_out === 1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.image_url ?? null
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("price", price);
      fd.append("category", category);
      fd.append("description", description);
      fd.append("inventory", inventory);
      fd.append("featured", featured ? "1" : "0");
      fd.append("sold_out", soldOut ? "1" : "0");
      if (imageFile) {
        fd.append("image", imageFile);
      } else if (product?.image_url) {
        fd.append("image_url", product.image_url);
      }

      const url = isEdit
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        body: fd,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Save failed");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="block text-xs tracking-widest uppercase text-bark mb-1.5">
          Name *
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-sand bg-cream px-4 py-2.5 text-sm text-earth focus:outline-none focus:border-bark transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs tracking-widest uppercase text-bark mb-1.5">
            Price (USD) *
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="38.00"
            className="w-full border border-sand bg-cream px-4 py-2.5 text-sm text-earth focus:outline-none focus:border-bark transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase text-bark mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-sand bg-cream px-4 py-2.5 text-sm text-earth focus:outline-none focus:border-bark transition-colors"
          >
            <option value="">— none —</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs tracking-widest uppercase text-bark mb-1.5">
          Description
        </label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-sand bg-cream px-4 py-2.5 text-sm text-earth focus:outline-none focus:border-bark transition-colors resize-none"
        />
      </div>

      <div>
        <label className="block text-xs tracking-widest uppercase text-bark mb-1.5">
          Image
        </label>
        <div className="flex items-start gap-4">
          {imagePreview && (
            <div className="w-20 h-20 shrink-0 relative overflow-hidden bg-sand">
              {imagePreview.startsWith("blob:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={imagePreview}
                  alt="Current"
                  fill
                  className="object-cover"
                />
              )}
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm text-bark mt-1"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs tracking-widest uppercase text-bark mb-1.5">
          Inventory
        </label>
        <input
          type="number"
          min="0"
          value={inventory}
          onChange={(e) => setInventory(e.target.value)}
          className="w-28 border border-sand bg-cream px-4 py-2.5 text-sm text-earth focus:outline-none focus:border-bark transition-colors"
        />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-bark cursor-pointer">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="accent-clay w-4 h-4"
          />
          Featured on homepage
        </label>
        <label className="flex items-center gap-2 text-sm text-bark cursor-pointer">
          <input
            type="checkbox"
            checked={soldOut}
            onChange={(e) => setSoldOut(e.target.checked)}
            className="accent-clay w-4 h-4"
          />
          Sold out
        </label>
      </div>

      {error && <p className="text-sm text-clay">{error}</p>}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-earth text-cream text-sm tracking-wide px-6 py-2.5 hover:bg-bark transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Product"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-bark hover:text-earth transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
