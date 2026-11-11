// TroyX iStore - Generate Official Firebase Password Reset Link
// Bypasses unauthenticated SMTP/email delivery issues by generating the direct Google reset URL.

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";

const keyPath = "C:\\Users\\akakp\\Downloads\\troyx-istore-firebase-adminsdk-fbsvc-f51aa4b5ba.json";
const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
}

const auth = getAuth();
const targetEmail = "akakporichard135@gmail.com";

async function main() {
  console.log("Generating official Firebase Password Reset Link for:", targetEmail);
  const link = await auth.generatePasswordResetLink(targetEmail);
  console.log("\n==================================================================");
  console.log("OFFICIAL FIREBASE PASSWORD RESET LINK (Single-use, expires in 1 hour):");
  console.log(link);
  console.log("==================================================================");

  setTimeout(() => process.exit(0), 100);
}

main().catch((err) => {
  console.error("Failed to generate link:", err.message);
  process.exit(1);
});
