import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(Number(id));
  if (!product) notFound();

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
      <h1 className="font-serif text-3xl text-earth mb-8">
        Edit: {product.name}
      </h1>
      <ProductForm product={product} />
    </div>
  );
}
