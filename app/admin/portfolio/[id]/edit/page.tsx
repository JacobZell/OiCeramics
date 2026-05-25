import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortfolioItemById } from "@/lib/db";
import { PortfolioForm } from "@/components/admin/PortfolioForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPortfolioItemPage({ params }: Props) {
  const { id } = await params;
  const item = getPortfolioItemById(Number(id));
  if (!item) notFound();

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/portfolio"
          className="text-xs tracking-widest uppercase text-bark hover:text-earth transition-colors"
        >
          ← Portfolio
        </Link>
      </div>
      <h1 className="font-serif text-3xl text-earth mb-8">
        Edit: {item.title}
      </h1>
      <PortfolioForm item={item} />
    </div>
  );
}
