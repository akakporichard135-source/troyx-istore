// TroyX iStore - Secure Password Hashing & Verification
// Uses Node.js crypto module with PBKDF2 and cryptographically secure salts

import crypto from "crypto";

export interface HashedPassword {
  hash: string;
  salt: string;
}

/**
 * Hash a password using PBKDF2 with SHA-512 and a random 32-byte salt
 */
export function hashPassword(password: string): HashedPassword {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");
  return { hash, salt };
}

/**
 * Verify a plain password against an existing hash and salt
 */
export function verifyPassword(
  password: string,
  storedHash: string,
  storedSalt: string
): boolean {
  if (!password || !storedHash || !storedSalt) return false;
  const hash = crypto
    .pbkdf2Sync(password, storedSalt, 100000, 64, "sha512")
    .toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash));
}

/**
 * Validate password strength (min 8 chars, uppercase, lowercase, number/symbol)
 */
export function isStrongPassword(password: string): { valid: boolean; reason?: string } {
  if (password.length < 8) {
    return { valid: false, reason: "Password must be at least 8 characters long." };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, reason: "Password must contain at least one uppercase letter." };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, reason: "Password must contain at least one lowercase letter." };
  }
  if (!/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, reason: "Password must contain at least one number or special character." };
  }
  return { valid: true };
}
