import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getAllPortfolioItems, createPortfolioItem } from "@/lib/db";
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

export async function GET() {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(getAllPortfolioItems());
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const fd = await req.formData();
  const title = String(fd.get("title") ?? "").trim() || null;
  const description = String(fd.get("description") ?? "").trim() || null;
  const year = parseInt(String(fd.get("year") ?? "")) || null;
  const exhibition = String(fd.get("exhibition") ?? "").trim() || null;
  const sort_order = parseInt(String(fd.get("sort_order") ?? "0")) || 0;
  let image_url = String(fd.get("image_url") ?? "") || null;

  const imageFile = fd.get("image") as File | null;
  if (imageFile && imageFile.size > 0) {
    image_url = await saveImage(imageFile, "portfolio");
  }

  const item = createPortfolioItem({
    title, description, image_url, year, exhibition, sort_order,
  });
  return NextResponse.json(item, { status: 201 });
}
