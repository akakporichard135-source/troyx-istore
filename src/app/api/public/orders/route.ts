import { NextRequest, NextResponse } from "next/server";
import { getProducts, getPromotions, createOrder } from "@/lib/storage/db";
import { calculateAndValidateOrder } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      deliveryMethod = "pickup",
      deliveryAddress = "",
      deliveryCity = "Accra",
      deliveryNotes = "",
      paymentStatus = "paid_on_delivery",
      items = [],
      promoCode,
    } = body;

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { error: "Customer name and phone number are required." },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cannot place an order with an empty cart." },
        { status: 400 }
      );
    }

    // Fetch authoritative products from database
    const dbProducts = await getProducts();
    const promos = await getPromotions();
    const activePromo = promoCode
      ? promos.find((p) => p.code.toUpperCase() === promoCode.toUpperCase() && p.isActive)
      : null;

    // Strict server-side calculation & price validation
    const calculation = calculateAndValidateOrder(
      items,
      dbProducts,
      activePromo,
      deliveryMethod,
      deliveryCity
    );

    if (!calculation.isValid) {
      return NextResponse.json(
        {
          error: "Order validation failed.",
          details: calculation.errors,
        },
        { status: 400 }
      );
    }

    // Persist verified order with authoritative server calculated totals
    const order = await createOrder({
      customerName,
      customerEmail: customerEmail || "customer@troyxistore.com",
      customerPhone,
      deliveryMethod,
      deliveryAddress,
      deliveryCity,
      deliveryNotes,
      subtotal: calculation.subtotal,
      discountTotal: calculation.discountTotal,
      deliveryFee: calculation.deliveryFee,
      totalAmount: calculation.totalAmount,
      currency: "GH₵",
      status: "pending",
      paymentStatus,
      items: calculation.validatedItems,
    });

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to process order" },
      { status: 500 }
    );
  }
}
