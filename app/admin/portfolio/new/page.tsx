import Link from "next/link";
import { PortfolioForm } from "@/components/admin/PortfolioForm";

export default function NewPortfolioItemPage() {
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
      <h1 className="font-serif text-3xl text-earth mb-8">Add Portfolio Item</h1>
      <PortfolioForm />
    </div>
  );
}
