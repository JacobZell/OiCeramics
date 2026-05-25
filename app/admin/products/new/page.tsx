import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/products"
          className="text-xs tracking-widest uppercase text-bark hover:text-earth transition-colors"
        >
          ← Products
        </Link>
      </div>
      <h1 className="font-serif text-3xl text-earth mb-8">Add Product</h1>
      <ProductForm />
    </div>
  );
}
