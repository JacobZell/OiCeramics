"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { PortfolioItem } from "@/lib/db";

export function PortfolioForm({ item }: { item?: PortfolioItem }) {
  const router = useRouter();
  const isEdit = !!item;

  const [title, setTitle] = useState(item?.title ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [year, setYear] = useState(item?.year?.toString() ?? "");
  const [exhibition, setExhibition] = useState(item?.exhibition ?? "");
  const [sortOrder, setSortOrder] = useState(item?.sort_order?.toString() ?? "0");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    item?.image_url ?? null
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
      fd.append("title", title);
      fd.append("description", description);
      fd.append("year", year);
      fd.append("exhibition", exhibition);
      fd.append("sort_order", sortOrder);
      if (imageFile) {
        fd.append("image", imageFile);
      } else if (item?.image_url) {
        fd.append("image_url", item.image_url);
      }

      const url = isEdit
        ? `/api/admin/portfolio/${item.id}`
        : "/api/admin/portfolio";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        body: fd,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Save failed");
      }
      router.push("/admin/portfolio");
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
          Title *
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-sand bg-cream px-4 py-2.5 text-sm text-earth focus:outline-none focus:border-bark transition-colors"
        />
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs tracking-widest uppercase text-bark mb-1.5">
            Year
          </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="2024"
            className="w-full border border-sand bg-cream px-4 py-2.5 text-sm text-earth focus:outline-none focus:border-bark transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase text-bark mb-1.5">
            Exhibition / Event
          </label>
          <input
            type="text"
            value={exhibition}
            onChange={(e) => setExhibition(e.target.value)}
            placeholder="Madison Makers Market"
            className="w-full border border-sand bg-cream px-4 py-2.5 text-sm text-earth focus:outline-none focus:border-bark transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs tracking-widest uppercase text-bark mb-1.5">
          Image
        </label>
        <div className="flex items-start gap-4">
          {imagePreview && (
            <div className="w-24 h-20 shrink-0 relative overflow-hidden bg-sand">
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
          Sort Order
        </label>
        <input
          type="number"
          min="0"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-28 border border-sand bg-cream px-4 py-2.5 text-sm text-earth focus:outline-none focus:border-bark transition-colors"
        />
        <p className="text-xs text-ash mt-1">Lower numbers appear first.</p>
      </div>

      {error && <p className="text-sm text-clay">{error}</p>}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-earth text-cream text-sm tracking-wide px-6 py-2.5 hover:bg-bark transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Item"}
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
