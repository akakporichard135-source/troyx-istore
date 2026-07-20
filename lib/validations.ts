import { z } from "zod";

export const emailSchema = z.string().email("Enter a valid email address");

export const authSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const registerSchema = authSchema.extend({
  name: z.string().min(2, "Enter your full name")
});

export const checkoutSchema = z.object({
  email: emailSchema,
  fullName: z.string().min(2),
  phone: z.string().min(7),
  address: z.string().min(6),
  city: z.string().min(2),
  country: z.string().min(2),
  fulfillment: z.enum(["delivery", "pickup"]),
  paymentProvider: z.enum(["card", "mobile_money", "bank_transfer", "cash_on_pickup"])
});

export const tradeInSchema = z.object({
  device: z.string().min(2),
  storage: z.string().min(2),
  batteryHealth: z.coerce.number().min(50).max(100),
  physicalCondition: z.enum(["excellent", "good", "fair", "poor"])
});

export const repairBookingSchema = z.object({
  name: z.string().min(2),
  email: emailSchema,
  device: z.string().min(2),
  issue: z.string().min(10),
  preferredDate: z.string().min(8),
  photoUrl: z.string().url().optional().or(z.literal(""))
});

export const searchSchema = z.object({
  q: z.string().trim().min(1).max(80)
});

export const productMutationSchema = z.object({
  name: z.string().min(2),
  category: z.string().min(2),
  price: z.coerce.number().positive(),
  description: z.string().min(20),
  stock: z.coerce.number().int().min(0)
});
