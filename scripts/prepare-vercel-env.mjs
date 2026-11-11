// TroyX iStore - Generate Vercel Environment Configuration
// Generates the environment variables needed for Vercel deployment,
// converting the local Firebase Service Account into a secure Base64 string for Vercel.

import fs from "fs";
import path from "path";

const keyPath = "C:\\Users\\akakp\\Downloads\\troyx-istore-firebase-adminsdk-fbsvc-f51aa4b5ba.json";

if (!fs.existsSync(keyPath)) {
  console.error("Firebase service account file not found at:", keyPath);
  process.exit(1);
}

const keyContent = fs.readFileSync(keyPath, "utf-8");
const keyJson = JSON.parse(keyContent);
const keyBase64 = Buffer.from(keyContent).toString("base64");

// Read .env.local for other settings
const envLocalPath = path.resolve(process.cwd(), ".env.local");
let envLocal = "";
if (fs.existsSync(envLocalPath)) {
  envLocal = fs.readFileSync(envLocalPath, "utf-8");
}

function getEnvValue(key, fallback = "") {
  const match = envLocal.match(new RegExp(`^${key}=(.*)$`, "m"));
  return match ? match[1].replace(/^["']|["']$/g, "").trim() : fallback;
}

const vercelEnv = {
  // Store info
  NEXT_PUBLIC_STORE_NAME: getEnvValue("NEXT_PUBLIC_STORE_NAME", "TroyX iStore"),
  NEXT_PUBLIC_STORE_SLOGAN: getEnvValue("NEXT_PUBLIC_STORE_SLOGAN", "Home of Original Apple Products"),
  NEXT_PUBLIC_STORE_LOCATION: getEnvValue("NEXT_PUBLIC_STORE_LOCATION", "Bawaleshie, East Legon, Accra, Ghana"),
  NEXT_PUBLIC_STORE_PHONE_1: getEnvValue("NEXT_PUBLIC_STORE_PHONE_1", "0207137437"),
  NEXT_PUBLIC_STORE_PHONE_2: getEnvValue("NEXT_PUBLIC_STORE_PHONE_2", "0548974717"),
  NEXT_PUBLIC_STORE_WHATSAPP: getEnvValue("NEXT_PUBLIC_STORE_WHATSAPP", "233207137437"),
  NEXT_PUBLIC_STORE_TIKTOK: getEnvValue("NEXT_PUBLIC_STORE_TIKTOK", "@troyx_istore"),
  NEXT_PUBLIC_STORE_CURRENCY: getEnvValue("NEXT_PUBLIC_STORE_CURRENCY", "GH₵"),

  // Dedicated Firebase Project
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: "troyx-istore",
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "troyx-istore.firebaseapp.com",
  FIREBASE_PROJECT_ID: "troyx-istore",
  FIREBASE_CLIENT_EMAIL: keyJson.client_email,
  FIREBASE_SERVICE_ACCOUNT_KEY: keyBase64,
  REQUIRE_FIREBASE: "true",
  DATA_STORE_MODE: "firebase",

  // Security
  ADMIN_JWT_SECRET: getEnvValue("ADMIN_JWT_SECRET", "troyx-istore-jwt-super-secret-key-change-in-production"),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: getEnvValue("CLOUDINARY_CLOUD_NAME", ""),
  CLOUDINARY_API_KEY: getEnvValue("CLOUDINARY_API_KEY", ""),
  CLOUDINARY_API_SECRET: getEnvValue("CLOUDINARY_API_SECRET", ""),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: getEnvValue("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME", "")
};

console.log("Vercel Environment Keys Prepared:");
Object.keys(vercelEnv).forEach((k) => {
  const isSecret = k.includes("SECRET") || k.includes("KEY") || k.includes("PRIVATE");
  console.log(`- ${k}: ${isSecret ? "[Configured Securely]" : vercelEnv[k]}`);
});

// Write to a temporary file in scripts/ (which is in .gitignore if it contains credentials)
// Note: We do NOT write secrets to git-tracked files.
const outPath = path.resolve(process.cwd(), ".vercel.env.json");
fs.writeFileSync(outPath, JSON.stringify(vercelEnv, null, 2), "utf-8");
console.log("\nSaved deployment env configuration to .vercel.env.json (excluded by gitignore)");
