import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Oi Ceramics for custom orders, wholesale inquiries, or general questions. Available for local pickup in Madison, WI. Also at the Madison Farmers' Market on Saturdays.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
