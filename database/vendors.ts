import type { Vendor, VendorPlan, SellerApplication, StoreReview, PayoutRequest, Advertisement } from "@/types";

export const initialVendorPlans: VendorPlan[] = [
  {
    id: "Starter",
    name: "Starter",
    priceMonthly: 199,
    priceYearly: 1990,
    maxProducts: 50,
    commissionRate: 8,
    featuredBadge: false,
    homepagePromotion: false,
    analyticsLevel: "Basic",
    supportLevel: "Email",
    features: [
      "Up to 50 active products",
      "Standard seller dashboard",
      "8% marketplace commission",
      "Email & ticket support",
      "Basic store performance analytics",
      "Automated Mobile Money payouts"
    ]
  },
  {
    id: "Business",
    name: "Business",
    priceMonthly: 499,
    priceYearly: 4990,
    maxProducts: 250,
    commissionRate: 5,
    featuredBadge: true,
    homepagePromotion: true,
    analyticsLevel: "Advanced",
    supportLevel: "Priority",
    features: [
      "Up to 250 active products",
      "Verified Seller Badge",
      "Featured listing in Store Directory",
      "5% reduced marketplace commission",
      "Advanced sales & customer analytics",
      "Priority WhatsApp & phone support",
      "Promotional discount coupons",
      "Weekly automated payouts"
    ]
  },
  {
    id: "Enterprise",
    name: "Enterprise",
    priceMonthly: 1299,
    priceYearly: 12990,
    maxProducts: -1, // Unlimited
    commissionRate: 3,
    featuredBadge: true,
    homepagePromotion: true,
    analyticsLevel: "Enterprise",
    supportLevel: "Dedicated Account Manager",
    features: [
      "Unlimited product uploads",
      "Verified Enterprise Gold Badge",
      "Homepage banner promotion",
      "3% minimum commission rate",
      "Real-time analytics API access",
      "Dedicated 24/7 Account Manager",
      "Custom storefront branding & custom URL",
      "Instant daily payout processing"
    ]
  }
];

export const initialVendors: Vendor[] = [
  {
    id: "v-troyx-flagship",
    slug: "troyx-official",
    name: "TroyX iStore Flagship",
    ownerName: "TroyX International Ltd.",
    email: "official@troyxistore.com",
    phone: "+233 24 123 4567",
    address: "Spintex Road, Next to Shell Signboard",
    city: "Accra",
    country: "Ghana",
    category: "Official Apple Flagship",
    description: "The primary verified flagship store of TroyX iStore Ghana. Direct importers of 100% genuine Apple devices, MacBooks, iPhones, iPads, and original accessories with official warranty.",
    logoUrl: "/assets/product-device-blue.svg",
    bannerUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop&q=80",
    isVerified: true,
    isFlagship: true,
    rating: 4.9,
    reviewCount: 342,
    productCount: 18,
    salesCount: 1540,
    totalRevenue: 289400,
    walletBalance: 45200,
    status: "Approved",
    planId: "Enterprise",
    taxNumber: "TIN-GH-99882211",
    website: "https://troyxistore.com",
    socialLinks: {
      instagram: "https://instagram.com/troyxistore",
      facebook: "https://facebook.com/troyxistore",
      x: "https://x.com/troyxistore"
    },
    createdAt: "2025-01-01T00:00:00Z",
    featuredOnHomepage: true
  },
  {
    id: "v-itech-ghana",
    slug: "itech-ghana",
    name: "iTech Ghana Store",
    ownerName: "Kwame Mensah",
    email: "sales@itechghana.com",
    phone: "+233 20 887 9900",
    address: "Lagos Avenue, East Legon",
    city: "Accra",
    country: "Ghana",
    category: "Apple & Gaming Specialist",
    description: "Accra's premier tech merchant specializing in high-performance MacBooks, custom gaming consoles, controllers, and certified refurbished iPhones.",
    logoUrl: "/assets/product-laptop-dark.svg",
    bannerUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&auto=format&fit=crop&q=80",
    isVerified: true,
    isFlagship: false,
    rating: 4.8,
    reviewCount: 128,
    productCount: 42,
    salesCount: 410,
    totalRevenue: 86500,
    walletBalance: 12400,
    status: "Approved",
    planId: "Business",
    taxNumber: "TIN-GH-44119933",
    website: "https://itechghana.com",
    socialLinks: {
      instagram: "https://instagram.com/itechghana",
      facebook: "https://facebook.com/itechghana"
    },
    createdAt: "2025-06-15T10:30:00Z",
    featuredOnHomepage: true
  },
  {
    id: "v-accra-premium",
    slug: "accra-premium-electronics",
    name: "Accra Premium Electronics",
    ownerName: "Abena Serwaa",
    email: "contact@accrapremium.com",
    phone: "+233 27 334 5566",
    address: "Airport Residential Area, Near Marina Mall",
    city: "Accra",
    country: "Ghana",
    category: "Smart Accessories & Wearables",
    description: "Authorized vendor for premium smartwatches, noise-canceling headphones, MagSafe chargers, and luxury Apple device leather cases.",
    logoUrl: "/assets/product-watch-dark.svg",
    bannerUrl: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&auto=format&fit=crop&q=80",
    isVerified: true,
    isFlagship: false,
    rating: 4.9,
    reviewCount: 95,
    productCount: 28,
    salesCount: 310,
    totalRevenue: 54200,
    walletBalance: 8900,
    status: "Approved",
    planId: "Business",
    taxNumber: "TIN-GH-55228844",
    createdAt: "2025-09-20T14:15:00Z",
    featuredOnHomepage: true
  },
  {
    id: "v-mobilezone-kumasi",
    slug: "mobilezone-kumasi",
    name: "MobileZone Kumasi",
    ownerName: "Kofi Baah",
    email: "info@mobilezonekumasi.com",
    phone: "+233 24 991 2233",
    address: "Adum Central Commercial Center",
    city: "Kumasi",
    country: "Ghana",
    category: "iPhones & Mobile Gadgets",
    description: "Ashanti region's leading tech hub for genuine iPhones, iPads, power banks, and fast repair services.",
    logoUrl: "/assets/product-tablet-dark.svg",
    bannerUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80",
    isVerified: true,
    isFlagship: false,
    rating: 4.7,
    reviewCount: 76,
    productCount: 35,
    salesCount: 245,
    totalRevenue: 38900,
    walletBalance: 5600,
    status: "Approved",
    planId: "Starter",
    taxNumber: "TIN-GH-77331122",
    createdAt: "2025-11-10T09:00:00Z",
    featuredOnHomepage: false
  }
];

export const initialSellerApplications: SellerApplication[] = [
  {
    id: "app-101",
    businessName: "Takoradi Tech Hub",
    ownerName: "Emmanuel Ansah",
    email: "emmanuel@takoraditech.com",
    phone: "+233 24 556 7788",
    address: "Beach Road, Opposite Market Circle",
    city: "Takoradi",
    country: "Ghana",
    category: "Accessories & Audio",
    description: "Authorized regional seller of audio gear, wireless speakers, gaming headsets, and phone accessories in Western Region.",
    logoUrl: "/assets/product-audio.svg",
    bannerUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80",
    govIdUrl: "/uploads/docs/gov-id-takoradi.pdf",
    taxNumber: "TIN-GH-11223344",
    website: "https://takoraditech.com",
    selectedPlan: "Business",
    agreedToTerms: true,
    status: "Pending",
    createdAt: "2026-07-20T14:30:00Z"
  },
  {
    id: "app-102",
    businessName: "Tema Gadget Express",
    ownerName: "Akosua Addo",
    email: "contact@temagadgets.com",
    phone: "+233 50 112 3344",
    address: "Community 1 Main Commercial Area",
    city: "Tema",
    country: "Ghana",
    category: "iPhones & Cases",
    description: "Specialist retailer offering imported smartphone covers, screen protectors, and certified used iPhones.",
    logoUrl: "/assets/product-accessory.svg",
    bannerUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&auto=format&fit=crop&q=80",
    govIdUrl: "/uploads/docs/gov-id-tema.pdf",
    taxNumber: "TIN-GH-66778899",
    selectedPlan: "Starter",
    agreedToTerms: true,
    status: "Pending",
    createdAt: "2026-07-21T08:15:00Z"
  }
];

export const initialStoreReviews: StoreReview[] = [
  {
    id: "rev-1",
    vendorId: "v-troyx-flagship",
    customerName: "Ama K. Osei",
    rating: 5,
    comment: "Extremely fast same-day delivery in East Legon! The iPhone 16 Pro Max came sealed with genuine warranty documents.",
    date: "2026-07-16",
    verifiedPurchase: true
  },
  {
    id: "rev-2",
    vendorId: "v-itech-ghana",
    customerName: "David Owusu",
    rating: 5,
    comment: "Great custom M3 Pro MacBook config. Customer support answered all my technical queries before I purchased.",
    date: "2026-07-18",
    verifiedPurchase: true
  },
  {
    id: "rev-3",
    vendorId: "v-accra-premium",
    customerName: "Nadia Sarpong",
    rating: 4.8,
    comment: "Original Apple Watch Ultra 2 titanium band. 100% authentic packaging.",
    date: "2026-07-19",
    verifiedPurchase: true
  }
];

export const initialPayoutRequests: PayoutRequest[] = [
  {
    id: "po-501",
    vendorId: "v-itech-ghana",
    vendorName: "iTech Ghana Store",
    amount: 5200,
    paymentMethod: "Mobile Money (MTN)",
    accountDetails: "0248879900 (Kwame Mensah)",
    status: "Pending",
    createdAt: "2026-07-19T10:00:00Z"
  },
  {
    id: "po-502",
    vendorId: "v-accra-premium",
    vendorName: "Accra Premium Electronics",
    amount: 3400,
    paymentMethod: "Bank Transfer",
    accountDetails: "Ecobank Ghana - 1441002938101",
    status: "Approved",
    createdAt: "2026-07-15T16:20:00Z",
    processedAt: "2026-07-16T09:30:00Z"
  }
];

export const initialAdvertisements: Advertisement[] = [
  {
    id: "ad-1",
    title: "iTech Ghana MacBook Pro Sale",
    vendorId: "v-itech-ghana",
    vendorName: "iTech Ghana Store",
    imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&auto=format&fit=crop&q=80",
    linkUrl: "/store/itech-ghana",
    location: "Homepage Banner",
    pricePaid: 800,
    active: true,
    startDate: "2026-07-01",
    endDate: "2026-08-01"
  }
];
