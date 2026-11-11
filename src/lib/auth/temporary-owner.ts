// TroyX Control Center - Temporary Store Owner Management & Provisioning
// Enables authorized local administration while official store owner credentials are pending
// Never exposes or hardcodes passwords; uses PBKDF2 hashing and Firebase Admin Custom Claims

import { getAdminAuth } from "../firebase/admin";
import { getUserByEmail, createOrUpdateUser, getUserById, recordAuditLog, getUsers } from "../storage/db";
import { hashPassword, isStrongPassword } from "./password";
import { UserProfile, UserRole } from "../types";

export const FORBIDDEN_PASSWORDS = [
  "troyx@2026!",
  "troyxistore",
  "troyx",
  "admin",
  "password",
  "12345678",
  "qwerty1234",
];

export interface TemporaryOwnerResult {
  success: boolean;
  user?: Omit<UserProfile, "passwordHash" | "passwordSalt">;
  firebaseAuthStatus: "active_with_custom_claims" | "console_activation_required" | "error";
  firebaseAuthMessage?: string;
  error?: string;
}

/**
 * Validates candidate credentials for temporary owner account
 */
export function validateTemporaryCredentials(
  email: string,
  passcode: string
): { valid: boolean; reason?: string } {
  if (!email || !email.includes("@") || !email.includes(".")) {
    return { valid: false, reason: "A valid email address is required." };
  }

  const normalizedPass = passcode.toLowerCase().trim();
  if (FORBIDDEN_PASSWORDS.includes(normalizedPass)) {
    return {
      valid: false,
      reason:
        "Default or easily guessable passwords are permanently forbidden. Please choose a new, unique, strong password.",
    };
  }

  const strengthCheck = isStrongPassword(passcode);
  if (!strengthCheck.valid) {
    return { valid: false, reason: strengthCheck.reason };
  }

  return { valid: true };
}

/**
 * Provisions a temporary owner account using Firebase Admin SDK and Cloud Firestore
 */
export async function provisionTemporaryOwner(params: {
  email: string;
  password: string;
  fullName?: string;
}): Promise<TemporaryOwnerResult> {
  const { email, password, fullName } = params;

  const validation = validateTemporaryCredentials(email, password);
  if (!validation.valid) {
    return {
      success: false,
      firebaseAuthStatus: "error",
      error: validation.reason || "Invalid credentials",
    };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const { hash, salt } = hashPassword(password);
  const now = new Date().toISOString();

  let uid = `user-owner-${Date.now().toString(36)}`;
  let firebaseAuthStatus: TemporaryOwnerResult["firebaseAuthStatus"] = "console_activation_required";
  let firebaseAuthMessage = "Firebase Authentication requires 1-click console activation ('Get started').";

  // 1. Attempt provisioning via Firebase Admin SDK
  try {
    const adminAuth = getAdminAuth();
    if (adminAuth) {
      let fbUser;
      try {
        fbUser = await adminAuth.getUserByEmail(normalizedEmail);
        await adminAuth.updateUser(fbUser.uid, {
          password,
          displayName: fullName || "Temporary Store Owner",
        });
      } catch (notFound) {
        fbUser = await adminAuth.createUser({
          email: normalizedEmail,
          password,
          displayName: fullName || "Temporary Store Owner",
        });
      }

      uid = fbUser.uid;

      // 2. Assign verified custom claims on Firebase Auth
      await adminAuth.setCustomUserClaims(uid, {
        role: "owner" as UserRole,
        temporary: true,
      });

      firebaseAuthStatus = "active_with_custom_claims";
      firebaseAuthMessage = "Firebase Auth user created and custom claims assigned successfully.";
    }
  } catch (err: any) {
    if (err.code === "auth/configuration-not-found") {
      firebaseAuthStatus = "console_activation_required";
      firebaseAuthMessage =
        "Firebase Email/Password Auth is not yet activated in Firebase Console. Console action: Open Firebase Console -> Authentication -> click 'Get started' -> enable 'Email/Password'.";
    } else {
      firebaseAuthStatus = "error";
      firebaseAuthMessage = err.message || "Firebase Auth initialization error";
    }
  }

  // 3. Persist verified owner profile in Cloud Firestore
  const userProfile: UserProfile = {
    id: uid,
    email: normalizedEmail,
    fullName: fullName || "Temporary Store Owner",
    role: "owner",
    isTemporary: true,
    isSetupComplete: true,
    passwordHash: hash,
    passwordSalt: salt,
    customClaims: {
      role: "owner",
      temporary: true,
    },
    createdAt: now,
    updatedAt: now,
  };

  await createOrUpdateUser(userProfile);

  await recordAuditLog({
    userId: uid,
    userEmail: normalizedEmail,
    action: "TEMPORARY_OWNER_PROVISIONED",
    entityType: "auth",
    details: {
      role: "owner",
      isTemporary: true,
      firebaseAuthStatus,
    },
  });

  const { passwordHash: _, passwordSalt: __, ...safeUser } = userProfile;
  return {
    success: true,
    user: safeUser,
    firebaseAuthStatus,
    firebaseAuthMessage,
  };
}

/**
 * Checks if any owner (temporary or official) is currently configured
 */
export async function getOwnerAccountStatus(): Promise<{
  hasOwner: boolean;
  isTemporary: boolean;
  email?: string;
  fullName?: string;
}> {
  const users = await getUsers();
  const owner = users.find((u) => u.role === "owner");
  if (!owner) {
    return { hasOwner: false, isTemporary: false };
  }
  return {
    hasOwner: true,
    isTemporary: Boolean(owner.isTemporary),
    email: owner.email,
    fullName: owner.fullName,
  };
}

/**
 * Future Owner Handover workflow
 * Seamlessly transitions store ownership to the verified shop owner
 */
export async function handoverToOfficialOwner(params: {
  officialEmail: string;
  officialPassword: string;
  officialFullName?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { officialEmail, officialPassword, officialFullName } = params;

  const validation = validateTemporaryCredentials(officialEmail, officialPassword);
  if (!validation.valid) {
    return { success: false, error: validation.reason };
  }

  const normalizedEmail = officialEmail.trim().toLowerCase();
  const { hash, salt } = hashPassword(officialPassword);
  const now = new Date().toISOString();

  let officialUid = `owner-${Date.now().toString(36)}`;

  // Provision official owner via Admin SDK
  try {
    const adminAuth = getAdminAuth();
    if (adminAuth) {
      let fbUser;
      try {
        fbUser = await adminAuth.getUserByEmail(normalizedEmail);
        await adminAuth.updateUser(fbUser.uid, {
          password: officialPassword,
          displayName: officialFullName || "TroyX Store Owner",
        });
      } catch {
        fbUser = await adminAuth.createUser({
          email: normalizedEmail,
          password: officialPassword,
          displayName: officialFullName || "TroyX Store Owner",
        });
      }
      officialUid = fbUser.uid;
      await adminAuth.setCustomUserClaims(officialUid, {
        role: "owner" as UserRole,
        official: true,
      });
    }
  } catch {}

  // Save official owner to Firestore
  const officialProfile: UserProfile = {
    id: officialUid,
    email: normalizedEmail,
    fullName: officialFullName || "TroyX Store Owner",
    role: "owner",
    isTemporary: false,
    isSetupComplete: true,
    passwordHash: hash,
    passwordSalt: salt,
    customClaims: {
      role: "owner",
      official: true,
    },
    createdAt: now,
    updatedAt: now,
  };
  await createOrUpdateUser(officialProfile);

  // Revoke temporary owner account
  const users = await getUsers();
  const tempOwners = users.filter((u) => u.role === "owner" && u.isTemporary && u.id !== officialUid);
  for (const temp of tempOwners) {
    try {
      const adminAuth = getAdminAuth();
      if (adminAuth) {
        await adminAuth.revokeRefreshTokens(temp.id);
        await adminAuth.deleteUser(temp.id).catch(() => {});
      }
    } catch {}

    // Downgrade or remove from Firestore
    await createOrUpdateUser({
      ...temp,
      role: "viewer",
      isTemporary: false,
      updatedAt: now,
    });
  }

  await recordAuditLog({
    userId: officialUid,
    userEmail: normalizedEmail,
    action: "OFFICIAL_OWNER_HANDOVER_COMPLETED",
    entityType: "auth",
    details: {
      officialEmail: normalizedEmail,
      revokedCount: tempOwners.length,
    },
  });

  return { success: true };
}
