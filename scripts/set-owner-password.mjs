// TroyX iStore - Secure Local Owner Password Recovery Tool
// Updates owner password directly via Firebase Admin SDK without exposing it.
// Keystrokes are masked (*), no plain text is displayed, logged, or written to disk.

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import readline from "readline";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const keyPath = "C:\\Users\\akakp\\Downloads\\troyx-istore-firebase-adminsdk-fbsvc-f51aa4b5ba.json";
if (!fs.existsSync(keyPath)) {
  console.error("ERROR: Firebase Admin key not found at", keyPath);
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

function promptHidden(query) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    process.stdout.write(query);

    let password = "";
    const onData = (char) => {
      char = char + "";
      switch (char) {
        case "\n":
        case "\r":
        case "\u0004":
          process.stdin.removeListener("data", onData);
          break;
        case "\u0003":
          process.exit();
          break;
        case "\u0008":
        case "\x7f":
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write("\b \b");
          }
          break;
        default:
          password += char;
          process.stdout.write("*");
          break;
      }
    };

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.on("data", onData);
    }

    rl.question("", (answer) => {
      rl.close();
      if (!process.stdin.isTTY) {
        resolve(answer);
      } else {
        process.stdout.write("\n");
        resolve(password);
      }
    });
  });
}

async function run() {
  console.log("==================================================================");
  console.log("TROYX iSTORE — SECURE LOCAL OWNER PASSWORD RECOVERY");
  console.log("==================================================================");
  console.log(`Target Account: ${targetEmail}`);
  console.log(`Verified UID:   ${targetUid}\n`);

  // Verify target user exists in Firebase Auth
  const fbUser = await auth.getUser(targetUid);
  if (fbUser.email !== targetEmail) {
    throw new Error(`UID mismatch: Expected ${targetEmail}, found ${fbUser.email}`);
  }

  // Get new password with masked input
  let p1 = await promptHidden("Enter new secure owner password: ");
  if (!p1 || p1.length < 8) {
    console.error("\n❌ Error: Password must be at least 8 characters long.");
    process.exit(1);
  }
  if (p1 === "TroyX@2026!" || p1 === "troyxistore") {
    console.error("\n❌ Error: Default bootstrap passwords are permanently disabled.");
    process.exit(1);
  }

  let p2 = await promptHidden("Confirm new secure owner password: ");
  if (p1 !== p2) {
    console.error("\n❌ Error: Passwords do not match.");
    process.exit(1);
  }

  console.log("\nSynchronizing credentials with Firebase Authentication...");
  // 1. Update Firebase Auth password
  await auth.updateUser(targetUid, {
    password: p1,
  });

  // 2. Ensure verified owner custom claims
  await auth.setCustomUserClaims(targetUid, {
    role: "owner",
    temporary: true,
  });

  // 3. Update Firestore user document
  console.log("Updating Cloud Firestore security document...");
  const snap = await db.collection("users").where("email", "==", targetEmail).get();
  if (snap.empty) {
    throw new Error(`Firestore user document not found for ${targetEmail}`);
  }

  const { hash, salt } = hashPassword(p1);
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

  // Wipe memory
  p1 = "";
  p2 = "";

  console.log("\n==================================================================");
  console.log("✔ PASSWORD RECOVERY COMPLETED SUCCESSFULLY");
  console.log("  - Firebase Auth Password: UPDATED for UID " + targetUid);
  console.log("  - Firebase Custom Claims: role=owner, temporary=true");
  console.log("  - Firestore Credentials:  PBKDF2 synchronized");
  console.log("  - Permissions:            Store Owner (full administrative access)");
  console.log("==================================================================");

  setTimeout(() => process.exit(0), 100);
}

run().catch((err) => {
  console.error("\nRecovery failed:", err.message);
  process.exit(1);
});
