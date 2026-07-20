export type ProductCondition = "New" | "Used" | "Refurbished";

export type ProductCategory =
  | "iPhone"
  | "MacBook"
  | "iPad"
  | "Apple Watch"
  | "AirPods"
  | "Apple TV"
  | "HomePod"
  | "Accessories"
  | "Cases"
  | "Chargers"
  | "Power Banks"
  | "Screen Protectors"
  | "Adapters"
  | "Cables"
  | "Speakers"
  | "Smart Accessories"
  | "Gaming"
  | "PlayStation"
  | "Xbox"
  | "Nintendo"
  | "Controllers"
  | "Gaming Headsets";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  series: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  colors: string[];
  storage: string[];
  condition: ProductCondition[];
  batteryHealth?: string;
  availability: "In Stock" | "Low Stock" | "Preorder" | "Out of Stock";
  warranty: string;
  deliveryEstimate: string;
  badge?: string;
  description: string;
  specs: Record<string, string>;
  bestSeller?: boolean;
  newArrival?: boolean;
  deal?: boolean;
};

export type CartItem = {
  productId: string;
  quantity: number;
  color?: string;
  storage?: string;
  condition?: ProductCondition;
};

export type OrderStatus =
  | "Confirmed"
  | "Processing"
  | "Packed"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export type AdminMetric = {
  label: string;
  value: string;
  delta: string;
};
