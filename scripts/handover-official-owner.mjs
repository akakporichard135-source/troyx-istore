// TroyX iStore - Official Owner Handover CLI
// Run this when the shop owner's official verified credentials are provided.
// Provisions the official owner account, assigns custom claims, and revokes temporary accounts.

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

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS.replace(/^["']|["']$/g, "").trim();
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

function prompt(q) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(q, (ans) => { rl.close(); resolve(ans.trim()); }));
}

async function main() {
  console.log("==================================================================");
  console.log("  TROYX ISTORE — OFFICIAL OWNER HANDOVER WORKFLOW");
  console.log("==================================================================");

  let officialEmail = process.argv[2];
  let officialPassword = process.argv[3];
  let officialName = process.argv[4] || "TroyX Store Owner";

  if (!officialEmail && process.stdin.isTTY) {
    officialEmail = await prompt("Enter shop owner's verified email address: ");
  }
  if (!officialPassword && process.stdin.isTTY) {
    officialPassword = await prompt("Enter strong permanent password for shop owner: ");
  }

  if (!officialEmail || !officialPassword) {
    console.error("Usage: node scripts/handover-official-owner.mjs <owner_email> <owner_password> [owner_name]");
    process.exit(1);
  }

  const normalizedEmail = officialEmail.trim().toLowerCase();
  const { hash, salt } = hashPassword(officialPassword);
  const now = new Date().toISOString();

  let uid = `owner-${Date.now().toString(36)}`;

  // 1. Provision official owner in Firebase Auth
  try {
    let fbUser;
    try {
      fbUser = await adminAuth.getUserByEmail(normalizedEmail);
      await adminAuth.updateUser(fbUser.uid, { password: officialPassword, displayName: officialName });
    } catch {
      fbUser = await adminAuth.createUser({ email: normalizedEmail, password: officialPassword, displayName: officialName });
    }
    uid = fbUser.uid;
    await adminAuth.setCustomUserClaims(uid, { role: "owner", official: true });
    console.log("✔ Official owner account provisioned in Firebase Auth with verified owner claims.");
  } catch (e) {
    console.warn("Firebase Auth Admin notice:", e.message);
  }

  // 2. Persist in Cloud Firestore
  await firestore.collection("users").doc(uid).set({
    id: uid,
    email: normalizedEmail,
    fullName: officialName,
    role: "owner",
    isTemporary: false,
    isSetupComplete: true,
    passwordHash: hash,
    passwordSalt: salt,
    customClaims: { role: "owner", official: true },
    createdAt: now,
    updatedAt: now,
  }, { merge: true });
  console.log("✔ Official owner profile saved in Cloud Firestore.");

  // 3. Revoke and disable temporary owner accounts
  const usersSnap = await firestore.collection("users").where("role", "==", "owner").get();
  for (const doc of usersSnap.docs) {
    const u = doc.data();
    if (u.id !== uid && u.isTemporary) {
      console.log(`--> Revoking temporary owner account: ${u.email} (${u.id})`);
      try {
        await adminAuth.revokeRefreshTokens(u.id);
        await adminAuth.deleteUser(u.id).catch(() => {});
      } catch {}
      await firestore.collection("users").doc(u.id).update({
        role: "viewer",
        isTemporary: false,
        disabled: true,
        updatedAt: now,
      });
      console.log(`✔ Temporary account ${u.email} disabled and sessions revoked.`);
    }
  }

  console.log("\n==================================================================");
  console.log("  OFFICIAL OWNER HANDOVER COMPLETED SUCCESSFULLY!");
  console.log("  • Official Owner:", normalizedEmail);
  console.log("  • Role: owner (Verified)");
  console.log("  • Temporary accounts revoked and disabled.");
  console.log("==================================================================");
}

main().catch(console.error);
