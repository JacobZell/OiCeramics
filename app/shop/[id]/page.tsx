import { notFound } from "next/navigation";
import { getProductById } from "@/lib/db";
import { ProductDetail } from "@/components/ProductDetail";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(Number(id));
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
