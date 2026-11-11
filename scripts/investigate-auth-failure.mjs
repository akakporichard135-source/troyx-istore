import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";

console.log("==================================================================");
console.log("TROYX iSTORE — COMPREHENSIVE FIREBASE AUTHENTICATION AUDIT");
console.log("==================================================================\n");

const keyPath = "C:\\Users\\akakp\\Downloads\\troyx-istore-firebase-adminsdk-fbsvc-f51aa4b5ba.json";
const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
}

const db = getFirestore();
const auth = getAuth();
const targetEmail = "akakporichard135@gmail.com";

async function audit() {
  console.log(`[Check 1] Firebase Project Verification:`);
  console.log(`  - Project ID: ${serviceAccount.project_id}`);
  console.log(`  - Client Email: ${serviceAccount.client_email}`);

  console.log(`\n[Check 2] Firebase Auth User Record for ${targetEmail}:`);
  const authUser = await auth.getUserByEmail(targetEmail);
  console.log(`  - UID: ${authUser.uid}`);
  console.log(`  - Email: ${authUser.email}`);
  console.log(`  - Email Verified: ${authUser.emailVerified}`);
  console.log(`  - Disabled: ${authUser.disabled}`);
  console.log(`  - Provider IDs: ${authUser.providerData.map(p => p.providerId).join(", ")}`);
  console.log(`  - Custom Claims:`, JSON.stringify(authUser.customClaims));
  console.log(`  - Created At: ${authUser.metadata.creationTime}`);
  console.log(`  - Last Sign In: ${authUser.metadata.lastSignInTime || "Never"}`);

  console.log(`\n[Check 3] Cloud Firestore User Document for ${targetEmail}:`);
  const snap = await db.collection("users").where("email", "==", targetEmail).get();
  snap.docs.forEach((doc) => {
    const data = doc.data();
    console.log(`  - Doc ID: ${doc.id}`);
    console.log(`  - Role: ${data.role}`);
    console.log(`  - Disabled: ${data.disabled}`);
    console.log(`  - isTemporary: ${data.isTemporary}`);
    console.log(`  - Has passwordHash: ${Boolean(data.passwordHash)} (length: ${data.passwordHash?.length})`);
    console.log(`  - Has passwordSalt: ${Boolean(data.passwordSalt)} (length: ${data.passwordSalt?.length})`);
    console.log(`  - Updated At: ${data.updatedAt}`);
  });

  console.log(`\n[Check 4] Password Reset Mechanism & Link:`);
  try {
    const resetLink = await auth.generatePasswordResetLink(targetEmail);
    console.log(`  ✔ Successfully generated official Firebase Password Reset Link:`);
    console.log(`    ${resetLink}`);
  } catch (err) {
    console.error(`  ❌ Failed to generate password reset link:`, err.message);
  }

  console.log("\n==================================================================");
  console.log("INVESTIGATION COMPLETED");
  console.log("==================================================================");
  process.exit(0);
}

audit().catch((err) => {
  console.error(err);
  process.exit(1);
});
