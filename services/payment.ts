export type PaymentProvider = "Paystack" | "Flutterwave" | "MTN_Mobile_Money" | "Telecel_Cash" | "Stripe";

export interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string; // e.g. GHS, USD
  provider: PaymentProvider;
  customerEmail: string;
  reference: string;
  metadata?: Record<string, any>;
  status: "Pending" | "Success" | "Failed";
  createdAt: string;
}

export interface PaymentAdapter {
  providerName: PaymentProvider;
  initializePayment: (amount: number, email: string, reference: string, metadata?: any) => Promise<{ authorizationUrl?: string; reference: string; status: string }>;
  verifyPayment: (reference: string) => Promise<{ success: boolean; transactionId: string }>;
}

class PaystackAdapter implements PaymentAdapter {
  providerName: PaymentProvider = "Paystack";

  async initializePayment(amount: number, email: string, reference: string, metadata?: any) {
    // Simulated Paystack initialization
    return {
      authorizationUrl: `https://checkout.paystack.com/simulate-${reference}`,
      reference,
      status: "initialized"
    };
  }

  async verifyPayment(reference: string) {
    return { success: true, transactionId: `pstk_${reference}` };
  }
}

class MobileMoneyAdapter implements PaymentAdapter {
  providerName: PaymentProvider = "MTN_Mobile_Money";

  async initializePayment(amount: number, email: string, reference: string, metadata?: any) {
    return {
      authorizationUrl: undefined,
      reference,
      status: "momo_prompt_sent"
    };
  }

  async verifyPayment(reference: string) {
    return { success: true, transactionId: `momo_${reference}` };
  }
}

class StripeAdapter implements PaymentAdapter {
  providerName: PaymentProvider = "Stripe";

  async initializePayment(amount: number, email: string, reference: string, metadata?: any) {
    return {
      authorizationUrl: `https://checkout.stripe.com/simulate-${reference}`,
      reference,
      status: "requires_payment_method"
    };
  }

  async verifyPayment(reference: string) {
    return { success: true, transactionId: `ch_${reference}` };
  }
}

export class PaymentGatewayService {
  private adapters: Map<PaymentProvider, PaymentAdapter> = new Map();

  constructor() {
    this.adapters.set("Paystack", new PaystackAdapter());
    this.adapters.set("MTN_Mobile_Money", new MobileMoneyAdapter());
    this.adapters.set("Telecel_Cash", new MobileMoneyAdapter());
    this.adapters.set("Stripe", new StripeAdapter());
  }

  getAdapter(provider: PaymentProvider): PaymentAdapter {
    const adapter = this.adapters.get(provider);
    if (!adapter) {
      return this.adapters.get("Paystack")!;
    }
    return adapter;
  }

  async processMarketplaceSubscription(planName: string, amount: number, vendorEmail: string, provider: PaymentProvider = "Paystack") {
    const reference = `SUB-${planName.toUpperCase()}-${Date.now()}`;
    const adapter = this.getAdapter(provider);
    const result = await adapter.initializePayment(amount, vendorEmail, reference, { planName });
    return result;
  }
}

export const paymentGateway = new PaymentGatewayService();

export async function createPaymentIntent({
  provider,
  items,
  customerEmail,
  amount
}: {
  provider: string;
  items: any[];
  customerEmail: string;
  amount: number;
}) {
  const reference = `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const adapter = paymentGateway.getAdapter((provider as PaymentProvider) || "Paystack");
  const payment = await adapter.initializePayment(amount, customerEmail, reference, { items });
  return payment;
}

