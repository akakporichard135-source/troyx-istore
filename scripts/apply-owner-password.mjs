// TroyX iStore - Secure Password Application Engine
// Receives new password exclusively via stdin pipe (never CLI args or disk).
// Updates Firebase Auth UID 07Rwzx6R7iaENCpBWSQZ2Ta0YLX2 and Firestore Kc5jtdSYUzWVDK1b4Zf9yGykDHB3.

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import crypto from "crypto";
import fs from "fs";

const keyPath = "C:\\Users\\akakp\\Downloads\\troyx-istore-firebase-adminsdk-fbsvc-f51aa4b5ba.json";
if (!fs.existsSync(keyPath)) {
  console.error("ERROR: Firebase Admin credentials file not found in Downloads.");
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
}

const auth = getAuth();
const db = getFirestore();
const targetEmail = "akakporichard135@gmail.com";
const targetUid = "07Rwzx6R7iaENCpBWSQZ2Ta0YLX2";

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return { hash, salt };
}

function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => {
      resolve(data.replace(/[\r\n]+$/, ""));
    });
    process.stdin.resume();
  });
}

async function main() {
  // Read password strictly from stdin pipe
  let newPassword = "";
  try {
    newPassword = await readStdin();
  } catch (err) {
    console.error("ERROR: Failed to read password from secure stdin stream.");
    process.exit(1);
  }

  if (!newPassword || newPassword.length < 8) {
    console.error("ERROR: Password must be at least 8 characters long.");
    process.exit(1);
  }

  if (newPassword === "TroyX@2026!" || newPassword === "troyxistore") {
    console.error("ERROR: Deprecated default bootstrap passwords are permanently rejected.");
    process.exit(1);
  }

  // 1. Verify target user exists with exact UID
  const existingUser = await auth.getUser(targetUid);
  if (existingUser.email !== targetEmail) {
    console.error(`ERROR: Target UID mismatch. Expected ${targetEmail}, found ${existingUser.email}`);
    process.exit(1);
  }

  // 2. Update Firebase Authentication password for existing UID
  await auth.updateUser(targetUid, {
    password: newPassword,
  });

  // 3. Verify and maintain owner custom claims
  await auth.setCustomUserClaims(targetUid, {
    role: "owner",
    temporary: true,
  });

  // 4. Synchronize Cloud Firestore security document
  const snap = await db.collection("users").where("email", "==", targetEmail).get();
  if (snap.empty) {
    console.error(`ERROR: Cloud Firestore document not found for ${targetEmail}`);
    process.exit(1);
  }

  const { hash, salt } = hashPassword(newPassword);
  for (const doc of snap.docs) {
    await doc.ref.update({
      passwordHash: hash,
      passwordSalt: salt,
      role: "owner",
      isTemporary: true,
      disabled: false,
      isSetupComplete: true,
      updatedAt: new Date().toISOString(),
    });
  }

  // Wipe password from memory immediately
  newPassword = "";

  console.log("\n==================================================================");
  console.log("✔ PASSWORD RECOVERY COMPLETED SUCCESSFULLY");
  console.log(`  - Account:                ${targetEmail}`);
  console.log(`  - Preserved Firebase UID: ${targetUid}`);
  console.log(`  - Firebase Custom Claims: {"role": "owner", "temporary": true}`);
  console.log(`  - Cloud Firestore Doc ID: ${snap.docs[0].id} (Role: owner)`);
  console.log(`  - Security Status:        Store Owner verified and active`);
  console.log("==================================================================\n");

  setTimeout(() => process.exit(0), 100);
}

main().catch((err) => {
  console.error("Recovery application failed:", err.message);
  process.exit(1);
});
