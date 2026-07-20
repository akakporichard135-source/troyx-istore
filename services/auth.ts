export type UserRole = "guest" | "customer" | "admin" | "manager";

export function canAccessAdmin(role?: UserRole) {
  return role === "admin" || role === "manager";
}

export function requireAdmin(role?: UserRole) {
  if (!canAccessAdmin(role)) {
    throw new Error("Admin access required");
  }
}
