import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "ceramics.db");

const globalForDb = global as unknown as { _db: Database.Database };

function getDb(): Database.Database {
  if (globalForDb._db) return globalForDb._db;

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price INTEGER NOT NULL,
      category TEXT,
      image_url TEXT,
      inventory INTEGER DEFAULT 1,
      featured INTEGER DEFAULT 0,
      sold_out INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS portfolio_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      image_url TEXT,
      year INTEGER,
      exhibition TEXT,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS contact_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      message TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const { count } = db
    .prepare("SELECT COUNT(*) as count FROM products")
    .get() as { count: number };

  if (count === 0) {
    const ins = db.prepare(`
      INSERT INTO products (name, description, price, category, inventory, featured)
      VALUES (@name, @description, @price, @category, @inventory, @featured)
    `);
    for (const p of SEED_PRODUCTS) ins.run(p);

    const insP = db.prepare(`
      INSERT INTO portfolio_items (title, description, year, exhibition, sort_order)
      VALUES (@title, @description, @year, @exhibition, @sort_order)
    `);
    for (const item of SEED_PORTFOLIO) insP.run(item);
  }

  globalForDb._db = db;
  return db;
}

const SEED_PRODUCTS = [
  {
    name: "Classic Mug",
    description:
      "A comfortable everyday mug. Wheel-thrown stoneware with a smooth matte glaze. Holds approximately 12oz.",
    price: 3800,
    category: "mugs",
    inventory: 4,
    featured: 1,
  },
  {
    name: "Speckled Espresso Cups",
    description:
      "Set of two small espresso cups. Dark speckled glaze over terracotta clay body. Each cup holds about 3oz.",
    price: 5200,
    category: "mugs",
    inventory: 2,
    featured: 1,
  },
  {
    name: "Wide Rim Bowl",
    description:
      "A versatile wide-rimmed bowl suited for salads, pasta, or fruit. Hand-thrown with a soft cream glaze. 10” diameter.",
    price: 6800,
    category: "bowls",
    inventory: 3,
    featured: 0,
  },
  {
    name: "Prep Bowl Set",
    description:
      "A set of three small nested prep bowls. Great for mise en place, dips, or finishing salt. Each slightly different in size.",
    price: 5800,
    category: "bowls",
    inventory: 5,
    featured: 1,
  },
  {
    name: "Bud Vase",
    description:
      "A slim, elegant vase for a single stem or a small wildflower bunch. Wheel-thrown with a textured exterior. Approx. 6” tall.",
    price: 3200,
    category: "vases",
    inventory: 3,
    featured: 0,
  },
  {
    name: "Trinket Dish",
    description:
      "A small hand-pinched dish for rings, earrings, or little keepsakes. Roughly oval — each one is unique.",
    price: 2200,
    category: "dishes",
    inventory: 8,
    featured: 0,
  },
  {
    name: "Dinner Plate",
    description:
      "A simple, unpretentious dinner plate. Wheel-thrown and trimmed to a clean profile. Slightly matte white glaze. 10” diameter.",
    price: 5500,
    category: "plates",
    inventory: 4,
    featured: 0,
  },
  {
    name: "Oval Serving Platter",
    description:
      "A generous oval platter, ideal for cheese, roasted vegetables, or anything worth presenting. Approximately 14” long.",
    price: 9500,
    category: "platters",
    inventory: 2,
    featured: 0,
  },
];

const SEED_PORTFOLIO = [
  {
    title: "Ash Series",
    description:
      "A collection of pieces fired with wood ash glaze. Each surface is unrepeatable — the fire decides the final form.",
    year: 2024,
    exhibition: "Madison Makers Market",
    sort_order: 1,
  },
  {
    title: "Farmhouse Dinnerware",
    description:
      "A twelve-piece commissioned set for a local family. Simple forms, warm materials, made to be used every day.",
    year: 2024,
    exhibition: "",
    sort_order: 2,
  },
  {
    title: "Studio Vessels",
    description:
      "A series of floor vases exploring proportion and negative space. Exhibited alongside work by two other Madison ceramic artists.",
    year: 2023,
    exhibition: "Isthmus Gallery, Madison",
    sort_order: 3,
  },
  {
    title: "Functional Forms",
    description:
      "Everyday objects — cups, bowls, spoon rests — considered carefully. Shown at the annual Wisconsin Craft Fair.",
    year: 2023,
    exhibition: "Wisconsin Craft Fair",
    sort_order: 4,
  },
];

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  image_url: string | null;
  inventory: number;
  featured: number;
  sold_out: number;
  created_at: string;
};

export type PortfolioItem = {
  id: number;
  title: string | null;
  description: string | null;
  image_url: string | null;
  year: number | null;
  exhibition: string | null;
  sort_order: number;
};

export function getAllProducts(): Product[] {
  return getDb()
    .prepare("SELECT * FROM products ORDER BY created_at DESC")
    .all() as Product[];
}

export function getFeaturedProducts(): Product[] {
  return getDb()
    .prepare(
      "SELECT * FROM products WHERE featured = 1 AND sold_out = 0 ORDER BY created_at DESC LIMIT 4"
    )
    .all() as Product[];
}

export function getProductById(id: number): Product | undefined {
  return getDb()
    .prepare("SELECT * FROM products WHERE id = ?")
    .get(id) as Product | undefined;
}

export function getProductsByCategory(category: string): Product[] {
  return getDb()
    .prepare("SELECT * FROM products WHERE category = ? ORDER BY name")
    .all(category) as Product[];
}

export function getCategories(): string[] {
  return (
    getDb()
      .prepare(
        "SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category"
      )
      .all() as { category: string }[]
  ).map((r) => r.category);
}

export function getAllPortfolioItems(): PortfolioItem[] {
  return getDb()
    .prepare("SELECT * FROM portfolio_items ORDER BY sort_order")
    .all() as PortfolioItem[];
}

type ProductInput = {
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  image_url: string | null;
  inventory: number;
  featured: number;
  sold_out: number;
};

const PRODUCT_FIELDS = [
  "name", "description", "price", "category",
  "image_url", "inventory", "featured", "sold_out",
];

export function createProduct(data: ProductInput): Product {
  const result = getDb()
    .prepare(
      `INSERT INTO products (name, description, price, category, image_url, inventory, featured, sold_out)
       VALUES (@name, @description, @price, @category, @image_url, @inventory, @featured, @sold_out)`
    )
    .run(data);
  return getProductById(result.lastInsertRowid as number)!;
}

export function updateProduct(id: number, data: Partial<ProductInput>): void {
  const fields = Object.keys(data).filter((k) => PRODUCT_FIELDS.includes(k));
  if (fields.length === 0) return;
  const set = fields.map((f) => `${f} = @${f}`).join(", ");
  getDb()
    .prepare(`UPDATE products SET ${set} WHERE id = @id`)
    .run({ ...data, id });
}

export function deleteProduct(id: number): void {
  getDb().prepare("DELETE FROM products WHERE id = ?").run(id);
}

type PortfolioInput = {
  title: string | null;
  description: string | null;
  image_url: string | null;
  year: number | null;
  exhibition: string | null;
  sort_order: number;
};

const PORTFOLIO_FIELDS = [
  "title", "description", "image_url", "year", "exhibition", "sort_order",
];

export function getPortfolioItemById(id: number): PortfolioItem | undefined {
  return getDb()
    .prepare("SELECT * FROM portfolio_items WHERE id = ?")
    .get(id) as PortfolioItem | undefined;
}

export function createPortfolioItem(data: PortfolioInput): PortfolioItem {
  const result = getDb()
    .prepare(
      `INSERT INTO portfolio_items (title, description, image_url, year, exhibition, sort_order)
       VALUES (@title, @description, @image_url, @year, @exhibition, @sort_order)`
    )
    .run(data);
  return getPortfolioItemById(result.lastInsertRowid as number)!;
}

export function updatePortfolioItem(
  id: number,
  data: Partial<PortfolioInput>
): void {
  const fields = Object.keys(data).filter((k) => PORTFOLIO_FIELDS.includes(k));
  if (fields.length === 0) return;
  const set = fields.map((f) => `${f} = @${f}`).join(", ");
  getDb()
    .prepare(`UPDATE portfolio_items SET ${set} WHERE id = @id`)
    .run({ ...data, id });
}

export function deletePortfolioItem(id: number): void {
  getDb().prepare("DELETE FROM portfolio_items WHERE id = ?").run(id);
}

export function saveContactSubmission(
  name: string,
  email: string,
  message: string
): void {
  getDb()
    .prepare(
      "INSERT INTO contact_submissions (name, email, message) VALUES (?, ?, ?)"
    )
    .run(name, email, message);
}
