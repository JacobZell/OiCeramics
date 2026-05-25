"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const isLogin = pathname === "/admin/login";

  return (
    <div className="min-h-screen bg-parchment">
      {!isLogin && (
        <div className="bg-earth text-cream px-6 py-3 flex items-center justify-between text-xs tracking-wide">
          <div className="flex items-center gap-1">
            <span className="text-ash mr-4 uppercase tracking-widest">Admin</span>
            <Link
              href="/admin/products"
              className={`px-3 py-1 transition-colors ${
                pathname.startsWith("/admin/products")
                  ? "bg-cream/10 text-cream"
                  : "text-sand hover:text-cream"
              }`}
            >
              Products
            </Link>
            <Link
              href="/admin/portfolio"
              className={`px-3 py-1 transition-colors ${
                pathname.startsWith("/admin/portfolio")
                  ? "bg-cream/10 text-cream"
                  : "text-sand hover:text-cream"
              }`}
            >
              Portfolio
            </Link>
          </div>
          <div className="flex items-center gap-4 text-sand">
            <Link href="/" className="hover:text-cream transition-colors">
              ← View Site
            </Link>
            <button
              onClick={handleLogout}
              className="hover:text-cream transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
      <div className="max-w-5xl mx-auto px-6 py-10">{children}</div>
    </div>
  );
}
