import { cookies } from "next/headers";

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get("oi-admin-token")?.value;
  return !!process.env.ADMIN_PASSWORD && token === process.env.ADMIN_PASSWORD;
}
