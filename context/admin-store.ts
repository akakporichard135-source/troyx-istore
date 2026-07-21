"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, OrderStatus, ProductCondition, ProductCategory } from "@/types";
import { products as initialProducts } from "@/database/products";

export type AdminRole = "Owner" | "Administrator" | "Manager" | "Sales Staff" | "Support Staff";

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: AdminRole;
  action: string;
  entityType: string;
  entityId?: string;
  details: string;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  status: OrderStatus;
  total: number;
  items: {
    productId: string;
    name: string;
    quantity: number;
    color?: string;
    storage?: string;
    condition?: ProductCondition;
    price: number;
  }[];
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: string;
  paymentStatus: "Paid" | "Pending" | "Refunded";
  shippingStatus: "Unshipped" | "Shipped" | "Delivered";
  customerNotes?: string;
  adminNotes?: string[];
  createdAt: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  lifetimeSpend: number;
  ordersCount: number;
  wishlist: string[];
  notes?: string[];
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountType: "percentage" | "fixed";
  value: number;
  minSpend?: number;
  active: boolean;
  expiryDate: string;
}

export interface StoreSettings {
  name: string;
  logoUrl?: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialInstagram: string;
  socialFacebook: string;
  socialX: string;
  shippingFlatRate: number;
  taxRatePercent: number;
  currencySymbol: string;
  currencyCode: string;
  allowPreorders: boolean;
}

interface AdminState {
  currentRole: AdminRole;
  products: Product[];
  orders: AdminOrder[];
  customers: CustomerProfile[];
  coupons: Coupon[];
  settings: StoreSettings;
  auditLogs: AuditLog[];
  
  // Actions
  setRole: (role: AdminRole) => void;
  
  // Product actions
  addProduct: (product: Omit<Product, "slug">) => void;
  editProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  archiveProduct: (id: string) => void;
  bulkUploadProducts: (products: Omit<Product, "slug">[]) => void;
  bulkDeleteProducts: (ids: string[]) => void;
  
  // Order actions
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderDetails: (orderId: string, shippingStatus: AdminOrder["shippingStatus"], paymentStatus: AdminOrder["paymentStatus"]) => void;
  addOrderNote: (orderId: string, note: string) => void;
  cancelOrder: (orderId: string) => void;
  refundOrder: (orderId: string) => void;
  
  // Customer actions
  addCustomer: (customer: Omit<CustomerProfile, "id" | "createdAt">) => void;
  addCustomerNote: (customerId: string, note: string) => void;
  
  // Coupon actions
  addCoupon: (coupon: Coupon) => void;
  toggleCoupon: (code: string) => void;
  deleteCoupon: (code: string) => void;
  
  // Settings actions
  updateSettings: (settings: Partial<StoreSettings>) => void;
  
  // Audit log actions
  addAuditLog: (action: string, entityType: string, entityId?: string, details?: string) => void;
  clearAuditLogs: () => void;
}

const defaultSettings: StoreSettings = {
  name: "TroyX iStore",
  contactEmail: "info@troyxistore.com",
  contactPhone: "+233 24 123 4567",
  address: "Spintex Road, Next to Shell Signboard, Accra, Ghana",
  socialInstagram: "https://instagram.com/troyxistore",
  socialFacebook: "https://facebook.com/troyxistore",
  socialX: "https://x.com/troyxistore",
  shippingFlatRate: 50,
  taxRatePercent: 15,
  currencySymbol: "₵",
  currencyCode: "GHS",
  allowPreorders: true,
};

const initialCustomers: CustomerProfile[] = [
  {
    id: "cust-1",
    name: "Ama K. Osei",
    email: "ama.k@example.com",
    phone: "+233 20 445 1122",
    address: "House 24, East Legon, Accra",
    lifetimeSpend: 4198,
    ordersCount: 2,
    wishlist: ["iphone-16-pro-max", "apple-watch-10"],
    createdAt: "2026-02-10T10:15:30Z",
    notes: ["Prefers morning delivery", "Requested callback regarding iPad trade-in"]
  },
  {
    id: "cust-2",
    name: "David Owusu",
    email: "david.o@example.com",
    phone: "+233 24 889 3344",
    address: "Block C, Airport Residential Area, Accra",
    lifetimeSpend: 1999,
    ordersCount: 1,
    wishlist: ["macbook-pro-14"],
    createdAt: "2026-04-12T14:22:10Z"
  },
  {
    id: "cust-3",
    name: "Nadia Sarpong",
    email: "nadia.s@example.com",
    phone: "+233 27 555 6677",
    address: "Comm 10, Tema",
    lifetimeSpend: 899,
    ordersCount: 1,
    wishlist: ["airpods-pro-2"],
    createdAt: "2026-05-18T09:45:00Z"
  }
];

const initialOrders: AdminOrder[] = [
  {
    id: "TX-9942",
    customerName: "Ama K. Osei",
    email: "ama.k@example.com",
    phone: "+233 20 445 1122",
    status: "Delivered",
    total: 2899,
    items: [
      {
        productId: "iphone-16-pro-max",
        name: "iPhone 16 Pro Max",
        quantity: 2,
        color: "Natural Titanium",
        storage: "256GB",
        condition: "New",
        price: 1299
      },
      {
        productId: "gaming-headset-pro",
        name: "Premium Gaming Headset",
        quantity: 1,
        color: "Black",
        storage: "Wireless",
        price: 199
      }
    ],
    shippingAddress: "House 24, East Legon, Accra",
    billingAddress: "House 24, East Legon, Accra",
    paymentMethod: "Mobile Money (MTN)",
    paymentStatus: "Paid",
    shippingStatus: "Delivered",
    customerNotes: "Please deliver after 2 PM if possible.",
    adminNotes: ["Dispatched via partner courier", "Signature confirmed by customer"],
    createdAt: "2026-07-15T11:20:00Z"
  },
  {
    id: "TX-9943",
    customerName: "David Owusu",
    email: "david.o@example.com",
    phone: "+233 24 889 3344",
    status: "Processing",
    total: 1999,
    items: [
      {
        productId: "macbook-pro-14",
        name: "MacBook Pro 14-inch",
        quantity: 1,
        color: "Space Gray",
        storage: "512GB",
        condition: "New",
        price: 1999
      }
    ],
    shippingAddress: "Block C, Airport Residential Area, Accra",
    billingAddress: "Block C, Airport Residential Area, Accra",
    paymentMethod: "Bank Card (Visa)",
    paymentStatus: "Paid",
    shippingStatus: "Unshipped",
    adminNotes: ["Payment cleared. Verification complete. Pending packaging."],
    createdAt: "2026-07-19T16:45:00Z"
  },
  {
    id: "TX-9944",
    customerName: "Nadia Sarpong",
    email: "nadia.s@example.com",
    phone: "+233 27 555 6677",
    status: "Confirmed",
    total: 899,
    items: [
      {
        productId: "iphone-16",
        name: "iPhone 16",
        quantity: 1,
        color: "Ultramarine",
        storage: "128GB",
        condition: "New",
        price: 899
      }
    ],
    shippingAddress: "Comm 10, Tema",
    billingAddress: "Comm 10, Tema",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    shippingStatus: "Unshipped",
    createdAt: "2026-07-20T08:30:00Z"
  }
];

const initialCoupons: Coupon[] = [
  { code: "TROYX10", discountType: "percentage", value: 10, minSpend: 500, active: true, expiryDate: "2026-12-31" },
  { code: "ACCRA50", discountType: "fixed", value: 50, minSpend: 200, active: true, expiryDate: "2026-09-30" },
  { code: "FREESHIP", discountType: "percentage", value: 100, active: false, expiryDate: "2026-08-15" }
];

const initialAuditLogs: AuditLog[] = [
  {
    id: "log-1",
    timestamp: "2026-07-20T09:00:00Z",
    actor: "System",
    role: "Owner",
    action: "System Initialization",
    entityType: "System",
    details: "Zustand store initialized with default catalog."
  }
];

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      currentRole: "Owner",
      products: initialProducts,
      orders: initialOrders,
      customers: initialCustomers,
      coupons: initialCoupons,
      settings: defaultSettings,
      auditLogs: initialAuditLogs,

      setRole: (role) => {
        set({ currentRole: role });
        get().addAuditLog("Role Switched", "User", role, `Switched active session view to ${role}`);
      },

      addProduct: (prod) => {
        const slug = prod.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const newProduct: Product = {
          ...prod,
          slug,
          id: prod.id || slug,
        };
        set((state) => ({
          products: [newProduct, ...state.products]
        }));
        get().addAuditLog("Product Created", "Product", newProduct.id, `Created product "${newProduct.name}"`);
      },

      editProduct: (prod) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === prod.id ? prod : p))
        }));
        get().addAuditLog("Product Edited", "Product", prod.id, `Updated details for product "${prod.name}"`);
      },

      deleteProduct: (id) => {
        const product = get().products.find((p) => p.id === id);
        set((state) => ({
          products: state.products.filter((p) => p.id !== id)
        }));
        get().addAuditLog("Product Deleted", "Product", id, `Deleted product "${product?.name || id}"`);
      },

      duplicateProduct: (id) => {
        const product = get().products.find((p) => p.id === id);
        if (product) {
          const duplicated: Product = {
            ...product,
            id: `${product.id}-copy`,
            slug: `${product.slug}-copy`,
            name: `${product.name} (Copy)`
          };
          set((state) => ({
            products: [duplicated, ...state.products]
          }));
          get().addAuditLog("Product Duplicated", "Product", duplicated.id, `Duplicated product "${product.name}" as "${duplicated.name}"`);
        }
      },

      archiveProduct: (id) => {
        const product = get().products.find((p) => p.id === id);
        if (product) {
          const updated: Product = {
            ...product,
            availability: "Out of Stock",
            badge: "Archived"
          };
          set((state) => ({
            products: state.products.map((p) => (p.id === id ? updated : p))
          }));
          get().addAuditLog("Product Archived", "Product", id, `Archived product "${product.name}"`);
        }
      },

      bulkUploadProducts: (newProds) => {
        const parsed = newProds.map((prod) => {
          const slug = prod.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          return {
            ...prod,
            slug,
            id: prod.id || slug,
          } as Product;
        });
        set((state) => ({
          products: [...parsed, ...state.products]
        }));
        get().addAuditLog("Bulk Import", "Product", "Multiple", `Imported ${newProds.length} products via CSV`);
      },

      bulkDeleteProducts: (ids) => {
        set((state) => ({
          products: state.products.filter((p) => !ids.includes(p.id))
        }));
        get().addAuditLog("Bulk Delete", "Product", "Multiple", `Bulk deleted ${ids.length} products`);
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o))
        }));
        get().addAuditLog("Order Status Updated", "Order", orderId, `Set order status to "${status}"`);
      },

      updateOrderDetails: (orderId, shippingStatus, paymentStatus) => {
        set((state) => ({
          orders: state.orders.map((o) => 
            o.id === orderId 
              ? { 
                  ...o, 
                  shippingStatus, 
                  paymentStatus, 
                  status: shippingStatus === "Delivered" ? "Delivered" : o.status 
                } 
              : o
          )
        }));
        get().addAuditLog("Order Shipping/Payment Updated", "Order", orderId, `Set shipping to "${shippingStatus}", payment to "${paymentStatus}"`);
      },

      addOrderNote: (orderId, note) => {
        const role = get().currentRole;
        const timestamp = new Date().toLocaleDateString("en-GB", {
          hour: "2-digit",
          minute: "2-digit"
        });
        const formattedNote = `[${timestamp} - ${role}] ${note}`;
        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.id === orderId) {
              const notes = o.adminNotes || [];
              return { ...o, adminNotes: [...notes, formattedNote] };
            }
            return o;
          })
        }));
        get().addAuditLog("Order Note Added", "Order", orderId, `Added note under ${role} role`);
      },

      cancelOrder: (orderId) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, status: "Cancelled" as OrderStatus } : o))
        }));
        get().addAuditLog("Order Cancelled", "Order", orderId, `Cancelled order`);
      },

      refundOrder: (orderId) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, paymentStatus: "Refunded" } : o))
        }));
        get().addAuditLog("Order Refunded", "Order", orderId, `Processed refund (simulated)`);
      },

      addCustomer: (cust) => {
        const newCustomer: CustomerProfile = {
          ...cust,
          id: `cust-${Date.now()}`,
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          customers: [newCustomer, ...state.customers]
        }));
        get().addAuditLog("Customer Registered", "Customer", newCustomer.id, `Created customer profile for "${newCustomer.name}"`);
      },

      addCustomerNote: (customerId, note) => {
        const role = get().currentRole;
        const timestamp = new Date().toLocaleDateString("en-GB");
        const formattedNote = `[${timestamp} - ${role}] ${note}`;
        set((state) => ({
          customers: state.customers.map((c) => {
            if (c.id === customerId) {
              const notes = c.notes || [];
              return { ...c, notes: [...notes, formattedNote] };
            }
            return c;
          })
        }));
        get().addAuditLog("Customer Note Added", "Customer", customerId, `Added note to customer profile`);
      },

      addCoupon: (coupon) => {
        set((state) => ({
          coupons: [coupon, ...state.coupons]
        }));
        get().addAuditLog("Coupon Added", "Coupon", coupon.code, `Created coupon "${coupon.code}"`);
      },

      toggleCoupon: (code) => {
        set((state) => ({
          coupons: state.coupons.map((c) => (c.code === code ? { ...c, active: !c.active } : c))
        }));
        get().addAuditLog("Coupon Toggled", "Coupon", code, `Toggled active status of coupon`);
      },

      deleteCoupon: (code) => {
        set((state) => ({
          coupons: state.coupons.filter((c) => c.code !== code)
        }));
        get().addAuditLog("Coupon Deleted", "Coupon", code, `Deleted coupon "${code}"`);
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));
        get().addAuditLog("Settings Updated", "Settings", "Store", `Updated general store parameters`);
      },

      addAuditLog: (action, entityType, entityId, details) => {
        const role = get()?.currentRole || "Owner";
        const actor = role === "Owner" ? "Owner (Admin)" : `${role} Account`;
        const newLog: AuditLog = {
          id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          timestamp: new Date().toISOString(),
          actor,
          role,
          action,
          entityType,
          entityId,
          details: details || `Performed action ${action}`
        };
        set((state) => ({
          auditLogs: [newLog, ...state.auditLogs].slice(0, 100) // Keep last 100 logs
        }));
      },

      clearAuditLogs: () => {
        set({ auditLogs: [] });
      }
    }),
    {
      name: "troyx-admin-store-v2"
    }
  )
);
