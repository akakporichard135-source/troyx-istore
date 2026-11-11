import fs from "fs";
import path from "path";
import admin from "firebase-admin";

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

console.log("Checking Firebase Admin Auth for project:", process.env.FIREBASE_PROJECT_ID);

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS.replace(/^["']|["']$/g, "").trim();
const cred = JSON.parse(fs.readFileSync(keyPath, "utf-8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(cred),
    projectId: process.env.FIREBASE_PROJECT_ID || cred.project_id,
  });
}

const auth = admin.auth();

try {
  const users = await auth.listUsers(5);
  console.log("SUCCESS: Firebase Auth is active and accessible via Admin SDK!");
  console.log("Existing user count in Firebase Auth:", users.users.length);
  users.users.forEach((u) => {
    console.log(` - User: ${u.email} (UID: ${u.uid}), CustomClaims:`, u.customClaims);
  });
} catch (err) {
  console.error("Firebase Auth Error:", err.code, err.message);
}
