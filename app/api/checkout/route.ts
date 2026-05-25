import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getProductById } from "@/lib/db";

interface CartItem {
  id: number;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items: CartItem[] = body.items;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    const line_items = [];
    for (const item of items) {
      const product = getProductById(item.id);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.id} not found.` },
          { status: 400 }
        );
      }
      if (product.sold_out === 1 || product.inventory === 0) {
        return NextResponse.json(
          { error: `"${product.name}" is sold out.` },
          { status: 400 }
        );
      }
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description ?? undefined,
            ...(product.image_url
              ? { images: [`${baseUrl}${product.image_url}`] }
              : {}),
          },
          unit_amount: product.price,
        },
        quantity: item.quantity,
      });
    }

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/shop`,
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}
