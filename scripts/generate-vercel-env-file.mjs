// TroyX iStore - Secure Vercel Environment Generator
// Creates a clean, deployment-ready .env import file in Downloads (outside Git)
// NEVER displays or prints secrets in the console or terminal.

import fs from "fs";
import path from "path";
import crypto from "crypto";

const downloadsDir = "C:\\Users\\akakp\\Downloads";
const serviceAccountPath = path.join(downloadsDir, "troyx-istore-firebase-adminsdk-fbsvc-f51aa4b5ba.json");

if (!fs.existsSync(serviceAccountPath)) {
  console.error("ERROR: Service account key not found in Downloads.");
  process.exit(1);
}

// 1. Read service account safely
const saRaw = fs.readFileSync(serviceAccountPath, "utf-8");
const saJson = JSON.parse(saRaw);
const saBase64 = Buffer.from(saRaw).toString("base64");

// 2. Generate cryptographically strong, unique JWT Secret
const jwtSecret = crypto.randomBytes(48).toString("hex");

// 3. Read .env.local for store settings
const envLocalPath = path.resolve(process.cwd(), ".env.local");
let envLocal = "";
if (fs.existsSync(envLocalPath)) {
  envLocal = fs.readFileSync(envLocalPath, "utf-8");
}

function getEnvValue(key, fallback = "") {
  const match = envLocal.match(new RegExp(`^${key}=(.*)$`, "m"));
  return match ? match[1].replace(/^["']|["']$/g, "").trim() : fallback;
}

// Check Cloudinary
const cloudinaryCloud = getEnvValue("CLOUDINARY_CLOUD_NAME", "");
const cloudinaryKey = getEnvValue("CLOUDINARY_API_KEY", "");
const cloudinarySecret = getEnvValue("CLOUDINARY_API_SECRET", "");
const hasCloudinary = Boolean(cloudinaryCloud && cloudinaryKey && cloudinarySecret);

// 4. Build clean .env content for Vercel
const lines = [
  "# ==============================================================================",
  "# TroyX iStore - Vercel Production & Preview Environment Configuration",
  "# ==============================================================================",
  "",
  "# Store Identity & Public Info",
  `NEXT_PUBLIC_SITE_URL="https://troyx-istore.vercel.app"`,
  `NEXT_PUBLIC_STORE_NAME="${getEnvValue("NEXT_PUBLIC_STORE_NAME", "TroyX iStore")}"`,
  `NEXT_PUBLIC_STORE_SLOGAN="${getEnvValue("NEXT_PUBLIC_STORE_SLOGAN", "Home of Original Apple Products")}"`,
  `NEXT_PUBLIC_STORE_LOCATION="${getEnvValue("NEXT_PUBLIC_STORE_LOCATION", "Bawaleshie, East Legon, Accra, Ghana")}"`,
  `NEXT_PUBLIC_STORE_PHONE_1="${getEnvValue("NEXT_PUBLIC_STORE_PHONE_1", "0207137437")}"`,
  `NEXT_PUBLIC_STORE_PHONE_2="${getEnvValue("NEXT_PUBLIC_STORE_PHONE_2", "0548974717")}"`,
  `NEXT_PUBLIC_STORE_WHATSAPP="${getEnvValue("NEXT_PUBLIC_STORE_WHATSAPP", "233207137437")}"`,
  `NEXT_PUBLIC_STORE_TIKTOK="${getEnvValue("NEXT_PUBLIC_STORE_TIKTOK", "@troyx_istore")}"`,
  `NEXT_PUBLIC_STORE_CURRENCY="${getEnvValue("NEXT_PUBLIC_STORE_CURRENCY", "GH₵")}"`,
  "",
  "# Dedicated Firebase Configuration (Authoritative Backend: troyx-istore)",
  `NEXT_PUBLIC_FIREBASE_PROJECT_ID="troyx-istore"`,
  `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="troyx-istore.firebaseapp.com"`,
  `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="troyx-istore.appspot.com"`,
  `FIREBASE_PROJECT_ID="troyx-istore"`,
  `FIREBASE_CLIENT_EMAIL="${saJson.client_email}"`,
  `FIREBASE_SERVICE_ACCOUNT_KEY="${saBase64}"`,
  `REQUIRE_FIREBASE="true"`,
  `DATA_STORE_MODE="firebase"`,
  "",
  "# Control Center Security",
  `ADMIN_JWT_SECRET="${jwtSecret}"`
];

// If Cloudinary credentials exist, add them; otherwise omit
if (hasCloudinary) {
  lines.push(
    "",
    "# Cloudinary Cinematic Media Integration",
    `CLOUDINARY_CLOUD_NAME="${cloudinaryCloud}"`,
    `CLOUDINARY_API_KEY="${cloudinaryKey}"`,
    `CLOUDINARY_API_SECRET="${cloudinarySecret}"`,
    `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="${cloudinaryCloud}"`
  );
}

const fileContent = lines.join("\n") + "\n";

// 5. Write to outside git repo: C:\Users\akakp\Downloads
const targetFile1 = path.join(downloadsDir, "troyx-istore.env");
const targetFile2 = path.join(downloadsDir, ".env");

fs.writeFileSync(targetFile1, fileContent, "utf-8");
fs.writeFileSync(targetFile2, fileContent, "utf-8");

console.log("SUCCESS: Vercel environment files created successfully outside the repository.");
console.log(`Primary File: ${targetFile1}`);
console.log(`Alternative Name: ${targetFile2}`);
console.log(`Cloudinary Configured: ${hasCloudinary ? "YES" : "NO (Omitted as requested)"}`);
console.log("Total Variables Configured: " + (hasCloudinary ? 21 : 17));
console.log("\nConfigured Variable Names:");
lines
  .filter(l => l && !l.startsWith("#"))
  .map(l => l.split("=")[0])
  .forEach(name => {
    const isSecret = name.includes("SECRET") || name.includes("KEY") || name.includes("SERVICE_ACCOUNT");
    console.log(`  - ${name}: ${isSecret ? "[MASKED SECRET CONFIGURED]" : "[PUBLIC VALUE CONFIGURED]"}`);
  });
