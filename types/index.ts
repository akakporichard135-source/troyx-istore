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
  vendorId?: string;
  vendorName?: string;
  vendorSlug?: string;
  isVerifiedVendor?: boolean;
};

export type CartItem = {
  productId: string;
  quantity: number;
  color?: string;
  storage?: string;
  condition?: ProductCondition;
  vendorId?: string;
  vendorName?: string;
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

export type VendorStatus = "Approved" | "Pending" | "Suspended" | "Rejected";
export type SubscriptionTier = "Starter" | "Business" | "Enterprise";

export type VendorPlan = {
  id: SubscriptionTier;
  name: SubscriptionTier;
  priceMonthly: number;
  priceYearly: number;
  maxProducts: number; // -1 for unlimited
  commissionRate: number; // percentage, e.g. 5 for 5%
  featuredBadge: boolean;
  homepagePromotion: boolean;
  analyticsLevel: "Basic" | "Advanced" | "Enterprise";
  supportLevel: "Email" | "Priority" | "Dedicated Account Manager";
  features: string[];
};

export type Vendor = {
  id: string;
  slug: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  category: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  isVerified: boolean;
  isFlagship?: boolean;
  rating: number;
  reviewCount: number;
  productCount: number;
  salesCount: number;
  totalRevenue: number;
  walletBalance: number;
  status: VendorStatus;
  planId: SubscriptionTier;
  govIdUrl?: string;
  taxNumber?: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    x?: string;
  };
  createdAt: string;
  featuredOnHomepage?: boolean;
};

export type SellerApplication = {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  category: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  govIdUrl: string;
  taxNumber?: string;
  website?: string;
  socialInstagram?: string;
  socialFacebook?: string;
  socialX?: string;
  selectedPlan: SubscriptionTier;
  agreedToTerms: boolean;
  status: VendorStatus;
  rejectionReason?: string;
  createdAt: string;
};

export type StoreReview = {
  id: string;
  vendorId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
};

export type PayoutRequest = {
  id: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  paymentMethod: "Bank Transfer" | "Mobile Money (MTN)" | "Mobile Money (Telecel)" | "PayPal";
  accountDetails: string;
  status: "Pending" | "Approved" | "Paid" | "Rejected";
  createdAt: string;
  processedAt?: string;
  adminNotes?: string;
};

export type Advertisement = {
  id: string;
  title: string;
  vendorId: string;
  vendorName: string;
  imageUrl: string;
  linkUrl: string;
  location: "Homepage Banner" | "Category Header" | "Sidebar";
  pricePaid: number;
  active: boolean;
  startDate: string;
  endDate: string;
};

