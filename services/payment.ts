import type { CartItem } from "@/types";

export type PaymentProvider = "card" | "mobile_money" | "bank_transfer" | "cash_on_pickup";

export type PaymentIntentInput = {
  provider: PaymentProvider;
  items: CartItem[];
  customerEmail: string;
  amount: number;
};

export async function createPaymentIntent(input: PaymentIntentInput) {
  return {
    provider: input.provider,
    status: input.provider === "cash_on_pickup" ? "manual_confirmation_required" : "requires_provider_connection",
    reference: `TX-${Date.now()}`,
    amount: input.amount,
    message:
      "Payment provider adapter placeholder. Add Stripe, Paystack, Flutterwave, mobile money, or bank transfer handlers here."
  };
}
