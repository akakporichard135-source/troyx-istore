import { products } from "./products";

export const seedData = {
  products,
  coupons: [
    { code: "TROYXWELCOME", discountType: "percent", value: 5, active: true },
    { code: "ACCESSORY10", discountType: "percent", value: 10, active: true }
  ],
  adminRoles: ["owner", "manager", "support", "inventory"],
  orderStatuses: ["Confirmed", "Processing", "Packed", "Out for Delivery", "Delivered"]
};
