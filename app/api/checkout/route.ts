import { NextRequest, NextResponse } from "next/server";
import { products } from "@/database/products";
import { rateLimit, validateCsrf } from "@/lib/security";
import { checkoutSchema } from "@/lib/validations";
import { createPaymentIntent } from "@/services/payment";
import type { CartItem } from "@/types";

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 20);
  if (limited) return limited;
  if (!validateCsrf(request)) return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });

  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const items = (body.items || []) as CartItem[];
  const amount = items.reduce((sum, item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  const payment = await createPaymentIntent({
    provider: parsed.data.paymentProvider,
    items,
    customerEmail: parsed.data.email,
    amount
  });

  return NextResponse.json({ orderId: payment.reference, payment });
}
