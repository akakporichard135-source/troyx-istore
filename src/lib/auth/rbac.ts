// TroyX Control Center - Role-Based Access Control (RBAC)
import { UserRole } from "../types";

export type Permission =
  | "view_dashboard"
  | "edit_pages"
  | "publish_pages"
  | "edit_sections"
  | "publish_sections"
  | "manage_media"
  | "manage_products"
  | "manage_pricing"
  | "manage_orders"
  | "manage_navigation"
  | "manage_promotions"
  | "manage_seo"
  | "rollback_versions"
  | "manage_users"
  | "view_audit_logs";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  owner: [
    "view_dashboard",
    "edit_pages",
    "publish_pages",
    "edit_sections",
    "publish_sections",
    "manage_media",
    "manage_products",
    "manage_pricing",
    "manage_orders",
    "manage_navigation",
    "manage_promotions",
    "manage_seo",
    "rollback_versions",
    "manage_users",
    "view_audit_logs",
  ],
  editor: [
    "view_dashboard",
    "edit_pages",
    "publish_pages",
    "edit_sections",
    "publish_sections",
    "manage_media",
    "manage_products",
    "manage_pricing",
    "manage_orders",
    "manage_navigation",
    "manage_promotions",
    "manage_seo",
    "rollback_versions",
    "view_audit_logs",
  ],
  viewer: ["view_dashboard", "view_audit_logs"],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function canPublish(role: UserRole): boolean {
  return hasPermission(role, "publish_pages") || hasPermission(role, "publish_sections");
}

export function canManagePricing(role: UserRole): boolean {
  return hasPermission(role, "manage_pricing");
}
