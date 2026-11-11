// TroyX iStore - Core TypeScript Definitions

export type UserRole = "owner" | "editor" | "viewer";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  passwordHash?: string;
  passwordSalt?: string;
  isSetupComplete?: boolean;
  isTemporary?: boolean;
  customClaims?: { role: UserRole; temporary?: boolean; [key: string]: any };
  mfaEnabled?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SectionTheme = "dark" | "white" | "custom";
export type SectionType =
  | "cinematic_hero"
  | "video_hero"
  | "image_hero"
  | "video_story"
  | "split_story"
  | "scroll_reveal"
  | "feature_showcase"
  | "sticky_sequence"
  | "media_gallery"
  | "comparison_table"
  | "tech_specs"
  | "full_gallery"
  | "promo_banner"
  | "product_collection"
  | "testimonials"
  | "faq"
  | "contact_section"
  | "cta_section"
  | "custom_text";

export type TextAlignment = "left" | "center" | "right";
export type MediaType = "image" | "video" | "both" | "none";

export interface SectionAnimationSettings {
  fadeOnScroll?: boolean;
  scaleOnScroll?: boolean;
  slideUpText?: boolean;
  staggerChildren?: boolean;
}

export interface SectionConfig {
  paddingTop?: "none" | "small" | "medium" | "large";
  paddingBottom?: "none" | "small" | "medium" | "large";
  containerWidth?: "contained" | "full" | "wide";
  textPosition?: "top" | "center" | "bottom" | "left" | "right";
  videoAutoplay?: boolean;
  videoMuted?: boolean;
  videoLoop?: boolean;
  videoControls?: boolean;
  overlayOpacity?: number; // 0 to 1
  specs?: Array<{ label: string; value: string }>;
  features?: Array<{ title: string; description: string; icon?: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  customCss?: string;
}

export interface PageSection {
  id: string;
  pageId: string;
  sectionType: SectionType;
  draftLabel: string; // e.g. "iPhone 18 Pro — dark"
  title?: string;
  subtitle?: string;
  tagline?: string;
  sortOrder: number;
  isPublished: boolean;
  theme: SectionTheme;
  backgroundColor?: string;
  textColor?: string;
  textAlignment: TextAlignment;
  
  // Media fields (desktop & mobile)
  desktopImageUrl?: string;
  mobileImageUrl?: string;
  desktopVideoUrl?: string;
  mobileVideoUrl?: string;
  posterImageUrl?: string;
  mediaType: MediaType;

  // Actions
  learnMoreUrl?: string;
  learnMoreText?: string;
  buyUrl?: string;
  buyText?: string;

  // Settings
  animationSettings?: SectionAnimationSettings;
  config?: SectionConfig;

  createdAt: string;
  updatedAt: string;
}

export interface PageRecord {
  id: string;
  slug: string; // e.g. "home", "store", "iphone"
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImageUrl?: string;
  isPublished: boolean;
  inNavigation: boolean;
  navigationOrder: number;
  scheduledAt?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface PageRevision {
  id: string;
  pageId: string;
  versionNumber: number;
  title: string;
  slug: string;
  contentSnapshot: {
    page: PageRecord;
    sections: PageSection[];
  };
  revisionNotes?: string;
  createdBy?: string;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  filePath: string;
  publicUrl: string;
  fileSize: number;
  mimeType: string;
  mediaType: "image" | "video";
  width?: number;
  height?: number;
  duration?: number;
  format?: string;
  publicId?: string; // Cloudinary public ID
  assetId?: string; // Cloudinary asset ID
  provider?: "cloudinary" | "local";
  altText?: string;
  caption?: string;
  focalPointX?: number; // 0 to 100 percentage
  focalPointY?: number; // 0 to 100 percentage
  folder?: string;
  usageCount?: number;
  derivedUrls?: {
    thumbnail?: string;
    preview?: string;
    webp?: string;
    mp4?: string;
  };
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export type ProductCategory =
  | "iphone"
  | "mac"
  | "ipad"
  | "watch"
  | "airpods"
  | "accessories";

export type DeviceCondition =
  | "Brand New"
  | "Open Box"
  | "Refurbished"
  | "Pre-Owned";

export type SimConfiguration =
  | "Physical SIM"
  | "eSIM"
  | "Dual eSIM"
  | "Dual SIM (Physical + eSIM)"
  | "Dual Physical SIM"
  | "None";

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  title: string;
  storage?: string; // e.g. "128GB", "256GB", "512GB", "1TB"
  ram?: string; // e.g. "8GB", "16GB", "36GB"
  color: string; // e.g. "Space Black", "Natural Titanium"
  colorHex?: string;
  price: number; // in Ghana cedi GH₵
  discountPrice?: number | null;
  stockQuantity: number;
  isAvailable: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSpecification {
  id: string;
  productId: string;
  groupName: string; // e.g. "Chip & Performance", "Display", "Camera"
  specKey: string;
  specValue: string;
  sortOrder: number;
}

export interface ProductRecord {
  id: string;
  slug: string;
  name: string;
  brand: string;
  model: string;
  category: ProductCategory;
  description: string;
  condition: DeviceCondition;
  simConfig: SimConfiguration;
  batteryHealth?: number | null; // percentage e.g. 100 for new or 95 for pre-owned
  isPublished: boolean;
  isFeatured: boolean;
  stockQuantity: number;
  sku: string;
  basePrice: number; // in Ghana cedi GH₵
  discountPrice?: number | null;
  learnMorePageId?: string | null;
  images: string[];
  metadata?: Record<string, any>;
  variants?: ProductVariant[];
  specifications?: ProductSpecification[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  productName: string;
  variantTitle?: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  imageUrl?: string;
  category?: string;
  color?: string;
  storage?: string;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "ready_for_pickup"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

export type PaymentStatus =
  | "unpaid"
  | "paid_on_delivery"
  | "bank_transfer"
  | "momo";

export type DeliveryMethod = "pickup" | "delivery";

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: DeliveryMethod;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryNotes?: string;
  subtotal: number;
  discountTotal: number;
  deliveryFee: number;
  totalAmount: number;
  currency: "GH₵";
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  notes?: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PromotionRecord {
  id: string;
  title: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  bannerImageUrl?: string;
  bannerText?: string;
  targetCategories?: ProductCategory[];
  targetProductIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  badge?: string;
  isExternal?: boolean;
  subItems?: Array<{ label: string; href: string; description?: string }>;
}

export interface NavigationConfig {
  id: string;
  location: "header" | "footer";
  items: NavigationItem[];
  updatedAt: string;
}

export interface FooterColumn {
  id: string;
  columnTitle: string;
  links: Array<{ label: string; href: string }>;
}

export interface AuditLogRecord {
  id: string;
  userId?: string;
  userEmail?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

export interface SiteSettings {
  storeName: string;
  storeSlogan: string;
  location: string;
  contactPhones: string[];
  tikTokHandle: string;
  currency: string;
  announcementText?: string;
  isAnnouncementActive: boolean;
  maintenanceMode: boolean;
  updatedAt: string;
}
