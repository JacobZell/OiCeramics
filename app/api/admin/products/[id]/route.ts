import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getProductById, updateProduct, deleteProduct } from "@/lib/db";
import path from "path";
import fs from "fs";

async function saveImage(file: File, folder: string): Promise<string> {
  const ext = path.extname(file.name).toLowerCase() || ".jpg";
  const name = `${Date.now()}${ext}`;
  const dir = path.join(process.cwd(), "public", "images", folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/images/${folder}/${name}`;
}

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: Params) {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const product = getProductById(Number(id));
  if (!product)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const fd = await req.formData();
  const name = String(fd.get("name") ?? "").trim();
  if (!name)
    return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const price = Math.round(parseFloat(String(fd.get("price") ?? "0")) * 100);
  if (isNaN(price) || price < 0)
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });

  const category = String(fd.get("category") ?? "") || null;
  const description = String(fd.get("description") ?? "") || null;
  const inventory = Math.max(0, parseInt(String(fd.get("inventory") ?? "0")) || 0);
  const featured = fd.get("featured") === "1" ? 1 : 0;
  const sold_out = fd.get("sold_out") === "1" ? 1 : 0;
  let image_url = String(fd.get("image_url") ?? "") || null;

  const imageFile = fd.get("image") as File | null;
  if (imageFile && imageFile.size > 0) {
    image_url = await saveImage(imageFile, "products");
  }

  updateProduct(Number(id), {
    name, description, price, category, image_url, inventory, featured, sold_out,
  });
  return NextResponse.json(getProductById(Number(id)));
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!getProductById(Number(id)))
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  deleteProduct(Number(id));
  return NextResponse.json({ ok: true });
}
