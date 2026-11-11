// TroyX iStore - Firebase Admin SDK Server Engine
// Trusted operations: Staff management, custom claims, order persistence, safe media verification
// NEVER exposed to or imported in client-side code

import admin from "firebase-admin";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";
import { getStorage, Storage } from "firebase-admin/storage";
import fs from "fs";
import path from "path";

/**
 * Checks if trusted server-side Firebase credentials are configured
 */
export function isFirebaseAdminConfigured(): boolean {
  if (typeof window !== "undefined") {
    return false; // Never run Admin SDK on client
  }

  // Active if Firestore Emulator is running
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    return true;
  }

  // Active if Application Default Credentials are set
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return true;
  }

  // Or if Service Account credentials exist
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    return true;
  }

  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY &&
    !process.env.FIREBASE_PRIVATE_KEY.includes("your-private-key")
  );
}

/**
 * Returns the trusted Firebase Admin App singleton
 */
export function getAdminApp(): admin.app.App | null {
  if (typeof window !== "undefined") {
    return null;
  }

  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  if (!isFirebaseAdminConfigured()) {
    return null;
  }

  try {
    const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "troyx-istore.appspot.com";

    // 1. Service account JSON environment string (raw JSON or base64 encoded)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.replace(/^["']|["']$/g, "").trim();
      let cred: any = null;

      if (raw.startsWith("{")) {
        try {
          cred = admin.credential.cert(JSON.parse(raw));
        } catch (e) {
          console.warn("Failed to parse raw FIREBASE_SERVICE_ACCOUNT_KEY JSON string:", e);
        }
      } else {
        // Try base64 decoding (common for Vercel/cloud environments)
        try {
          const decoded = Buffer.from(raw, "base64").toString("utf-8");
          if (decoded.trim().startsWith("{")) {
            cred = admin.credential.cert(JSON.parse(decoded));
          }
        } catch {}

        // If not base64 JSON, check if it's a valid local file path
        if (!cred) {
          const resolvedPath = path.isAbsolute(raw) ? raw : path.join(process.cwd(), raw);
          if (fs.existsSync(resolvedPath)) {
            const fileContent = JSON.parse(fs.readFileSync(resolvedPath, "utf-8"));
            cred = admin.credential.cert(fileContent);
          }
        }
      }

      if (cred) {
        return admin.initializeApp({ credential: cred, storageBucket: bucket });
      }
    }

    // 2. Individual server environment variables (clean cloud environment standard)
    if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
      return admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: bucket,
      });
    }

    // 3. Google Application Default Credentials via existing file path
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      const gPath = process.env.GOOGLE_APPLICATION_CREDENTIALS.replace(/^["']|["']$/g, "").trim();
      if (fs.existsSync(gPath)) {
        const fileContent = JSON.parse(fs.readFileSync(gPath, "utf-8"));
        return admin.initializeApp({
          credential: admin.credential.cert(fileContent),
          projectId: process.env.FIREBASE_PROJECT_ID || fileContent.project_id || "troyx-istore",
          storageBucket: bucket,
        });
      }
    }

    // 4. Local Emulator mode
    if (process.env.FIRESTORE_EMULATOR_HOST) {
      return admin.initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "troyx-istore",
      });
    }

    return null;
  } catch (err) {
    console.error("Firebase Admin initialization error:", err);
    return null;
  }
}

export function getAdminAuth(): Auth | null {
  const app = getAdminApp();
  return app ? getAuth(app) : null;
}

export function getAdminFirestore(): Firestore | null {
  const app = getAdminApp();
  if (!app) return null;
  const db = getFirestore(app);
  try {
    db.settings({ ignoreUndefinedProperties: true });
  } catch {
    // Settings already applied
  }
  return db;
}

export function getAdminStorage(): Storage | null {
  const app = getAdminApp();
  return app ? getStorage(app) : null;
}
