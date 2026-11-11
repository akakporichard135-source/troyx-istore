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

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS.replace(/^["']|["']$/g, "").trim();
const cred = JSON.parse(fs.readFileSync(keyPath, "utf-8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(cred),
    projectId: process.env.FIREBASE_PROJECT_ID || cred.project_id,
  });
}

try {
  // Try to create a user directly to see what error or if it creates
  const testUser = await admin.auth().createUser({
    email: "temp-test@troyxistore.com",
    password: "TempPassword123!",
  });
  console.log("Create user SUCCESS:", testUser.uid);
  await admin.auth().deleteUser(testUser.uid);
  console.log("Cleanup test user SUCCESS");
} catch (e) {
  console.log("Create user error code:", e.code);
  console.log("Create user error message:", e.message);
}
