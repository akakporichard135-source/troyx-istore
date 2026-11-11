import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/storage/db";
import { formatGHS, generateWhatsAppOrderMessage } from "@/lib/pricing";
import { CheckCircle2, MessageCircle, MapPin, Store } from "lucide-react";

interface OrderConfirmationProps {
  params: {
    id: string;
  };
}

export const revalidate = 0;

export default async function OrderConfirmationPage({ params }: OrderConfirmationProps) {
  const order = await getOrderById(params.id);

  if (!order) {
    notFound();
  }

  const encodedWhatsAppMessage = generateWhatsAppOrderMessage(
    order.orderNumber,
    order.customerName,
    order.items,
    order.totalAmount,
    order.deliveryMethod,
    order.deliveryAddress
  );

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-700/60 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <p className="text-xs uppercase tracking-widest text-emerald-500 font-semibold">
            Order Received
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Thank you, {order.customerName}!
          </h1>
          <p className="text-sm text-zinc-400">
            Order Reference: <span className="font-mono text-white font-semibold">{order.orderNumber}</span>
          </p>
        </div>

        {/* Order Details Card */}
        <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 text-xs text-zinc-400">
            <div>
              <span className="text-zinc-500">Method: </span>
              <span className="text-white capitalize">{order.deliveryMethod}</span>
            </div>
            <div>
              <span className="text-zinc-500">Status: </span>
              <span className="text-emerald-400 uppercase font-medium">{order.status}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">
              Items Ordered
            </h2>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <div>
                  <div className="font-medium text-white">{item.productName}</div>
                  <div className="text-xs text-zinc-500">Quantity: {item.quantity}</div>
                </div>
                <div className="font-semibold text-zinc-300">
                  {formatGHS(item.unitPrice * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-800 pt-4 space-y-2 text-xs text-zinc-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-white">{formatGHS(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Fulfillment Fee</span>
              <span className="text-white">
                {order.deliveryFee > 0 ? formatGHS(order.deliveryFee) : "Free (Pickup)"}
              </span>
            </div>
            <div className="border-t border-zinc-800 pt-2 flex justify-between text-base font-semibold text-white">
              <span>Total Amount</span>
              <span>{formatGHS(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Instant WhatsApp Order Assist Button */}
        <div className="p-6 rounded-2xl bg-[#161617] border border-zinc-800 space-y-4 text-center">
          <h2 className="text-sm font-semibold text-white">Instant WhatsApp Confirmation</h2>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Click below to transmit your order details straight to our East Legon staff on WhatsApp
            for instant priority processing.
          </p>
          <a
            href={`https://wa.me/233207137437?text=${encodedWhatsAppMessage}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 px-6 rounded-full text-sm transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Confirm Order via WhatsApp</span>
          </a>
        </div>

        {/* East Legon Store Address */}
        <div className="text-center text-xs text-zinc-500 space-y-1">
          <div className="flex items-center justify-center gap-1 text-zinc-400 font-medium">
            <Store className="w-3.5 h-3.5" />
            <span>TroyX iStore • Bawaleshie, East Legon, Accra, Ghana</span>
          </div>
          <div>Inquiries: 0207137437 / 0548974717 • TikTok: @troyx_istore</div>
        </div>
      </div>
    </div>
  );
}
