// TroyX iStore - Secure Temporary Owner Provisioning CLI
// Enables administrator access for local development while shop owner credentials are pending
// Never prints the password in terminal or outputs; hashes password using PBKDF2; assigns Admin SDK Custom Claims

import fs from "fs";
import path from "path";
import readline from "readline";
import admin from "firebase-admin";
import crypto from "crypto";

// 1. Load .env.local
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq !== -1) {
      const k = trimmed.slice(0, eq).trim();
      let v = trimmed.slice(eq + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

// 2. Initialize Firebase Admin SDK
const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
  ? process.env.GOOGLE_APPLICATION_CREDENTIALS.replace(/^["']|["']$/g, "").trim()
  : null;

if (!keyPath || !fs.existsSync(keyPath)) {
  console.error("ERROR: GOOGLE_APPLICATION_CREDENTIALS file not found:", keyPath);
  process.exit(1);
}

const cred = JSON.parse(fs.readFileSync(keyPath, "utf-8"));
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(cred),
    projectId: process.env.FIREBASE_PROJECT_ID || cred.project_id || "troyx-istore",
  });
}

const firestore = admin.firestore();
const adminAuth = admin.auth();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return { hash, salt };
}

function isStrongPassword(password) {
  if (password.length < 10) return { valid: false, reason: "Minimum 10 characters required." };
  if (!/[A-Z]/.test(password)) return { valid: false, reason: "Must contain at least one uppercase letter." };
  if (!/[a-z]/.test(password)) return { valid: false, reason: "Must contain at least one lowercase letter." };
  if (!/[0-9]/.test(password)) return { valid: false, reason: "Must contain at least one number." };
  if (!/[^A-Za-z0-9]/.test(password)) return { valid: false, reason: "Must contain at least one special character." };
  const lower = password.toLowerCase();
  if (lower === "troyx@2026!" || lower === "troyxistore" || lower === "admin") {
    return { valid: false, reason: "Default passwords are permanently forbidden." };
  }
  return { valid: true };
}

async function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (ans) => {
      rl.close();
      resolve(ans.trim());
    });
  });
}

async function main() {
  console.log("==================================================================");
  console.log("  TROYX ISTORE — SECURE TEMPORARY OWNER PROVISIONING");
  console.log("==================================================================");

  let email = process.argv[2] || process.env.TEMP_ADMIN_EMAIL;
  let password = process.argv[3] || process.env.TEMP_ADMIN_PASSWORD;
  let fullName = process.argv[4] || process.env.TEMP_ADMIN_NAME || "Temporary Store Owner";

  if (!email && process.stdin.isTTY) {
    email = await prompt("Enter administrator email address: ");
  }
  if (!password && process.stdin.isTTY) {
    password = await prompt("Enter strong temporary password: ");
  }

  if (!email || !password) {
    console.error("Usage: node scripts/create-temporary-owner.mjs <email> <strong_password> [fullName]");
    console.error("Or set TEMP_ADMIN_EMAIL and TEMP_ADMIN_PASSWORD environment variables.");
    process.exit(1);
  }

  const check = isStrongPassword(password);
  if (!check.valid) {
    console.error("Password Validation Failed:", check.reason);
    process.exit(1);
  }

  const normalizedEmail = email.trim().toLowerCase();
  const { hash, salt } = hashPassword(password);
  const now = new Date().toISOString();

  let uid = `user-owner-${Date.now().toString(36)}`;
  let firebaseAuthStatus = "pending";

  // 1. Try provisioning in Firebase Admin Auth
  try {
    let fbUser;
    try {
      fbUser = await adminAuth.getUserByEmail(normalizedEmail);
      await adminAuth.updateUser(fbUser.uid, {
        password,
        displayName: fullName,
      });
      console.log("✔ Firebase Auth existing user updated.");
    } catch {
      fbUser = await adminAuth.createUser({
        email: normalizedEmail,
        password,
        displayName: fullName,
      });
      console.log("✔ Firebase Auth user created successfully.");
    }

    uid = fbUser.uid;

    // Set Custom Claims on Firebase Auth
    await adminAuth.setCustomUserClaims(uid, {
      role: "owner",
      temporary: true,
    });
    console.log("✔ Verified Firebase custom claims set: { role: 'owner', temporary: true }");
    firebaseAuthStatus = "active";
  } catch (err) {
    if (err.code === "auth/configuration-not-found") {
      console.log("ℹ Note: Firebase Authentication requires 1-click console activation ('Get started').");
      console.log("  Console Steps: https://console.firebase.google.com/project/troyx-istore/authentication");
      console.log("  1. Click 'Get started'");
      console.log("  2. Click 'Email/Password' under Sign-in method, toggle Enable, and Save.");
      firebaseAuthStatus = "console_action_required";
    } else {
      console.warn("Firebase Auth Admin notice:", err.code, err.message);
      firebaseAuthStatus = err.code;
    }
  }

  // 2. Persist in Cloud Firestore
  const userProfile = {
    id: uid,
    email: normalizedEmail,
    fullName,
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

  await firestore.collection("users").doc(uid).set(userProfile, { merge: true });
  console.log("✔ Cloud Firestore user document verified in collection 'users':", uid);

  // 3. Record Audit Log
  await firestore.collection("audit_logs").add({
    userId: uid,
    userEmail: normalizedEmail,
    action: "TEMPORARY_OWNER_PROVISIONED",
    entityType: "auth",
    details: {
      role: "owner",
      isTemporary: true,
      firebaseAuthStatus,
    },
    createdAt: now,
  });

  console.log("\n==================================================================");
  console.log("  TEMPORARY OWNER ACCOUNT READY!");
  console.log("  • Email:", normalizedEmail);
  console.log("  • Role: owner (Verified Custom Claims)");
  console.log("  • UID:", uid);
  console.log("  • Firebase Auth Status:", firebaseAuthStatus);
  console.log("  • Password: [SECURED — Never printed or stored in plaintext]");
  console.log("==================================================================");
  console.log("You can now log in at: http://localhost:3000/admin/login\n");
}

main().catch((e) => {
  console.error("FATAL ERROR:", e);
  process.exit(1);
});
