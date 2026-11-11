// TroyX iStore - Firestore Data Migration & Seeding Engine
// Idempotently migrates all collections and preserves the exact 6 homepage draft slots
// Postpones staff authentication account creation per owner instructions

import fs from "fs";
import path from "path";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

// Helper to load .env.local in plain node
function loadEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

export async function migrateToFirestore(firestore) {
  console.log("==================================================================");
  console.log("  TROYX ISTORE — CLOUD FIRESTORE MIGRATION & VERIFICATION");
  console.log("  Dedicated Project: troyx-istore");
  console.log("==================================================================\n");

  if (!firestore) {
    throw new Error("Firestore instance required for migration");
  }

  // 1. Temporary Harmless Test Record Verification
  console.log("--> Step 1: Performing harmless temporary test record roundtrip...");
  const testRef = firestore.collection("_connectivity_test").doc("test_doc");
  const testPayload = {
    testId: "harmless-probe-" + Date.now(),
    project: "troyx-istore",
    timestamp: new Date().toISOString(),
    status: "verified",
  };
  await testRef.set(testPayload);
  const testSnap = await testRef.get();
  if (!testSnap.exists || testSnap.data()?.testId !== testPayload.testId) {
    throw new Error("Temporary test record verification failed: data mismatch");
  }
  await testRef.delete();
  console.log("✔ Temporary test record written, verified, and cleaned up successfully.");

  // Load existing data from local store
  const dataPath = path.join(process.cwd(), ".data", "troyx_store.json");
  let localDb = null;
  if (fs.existsSync(dataPath)) {
    try {
      localDb = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
      console.log("✔ Loaded existing local database snapshot from .data/troyx_store.json");
    } catch (e) {
      console.warn("Could not parse .data/troyx_store.json, using defaults", e);
    }
  }

  const batch = firestore.batch();
  let docCount = 0;

  // 2. Site Settings
  console.log("--> Step 2: Migrating Site Settings...");
  const settingsRef = firestore.collection("settings").doc("site");
  const settingsData = localDb?.settings || {
    storeName: "TroyX iStore",
    storeSlogan: "Home of Original Apple Products",
    location: "Bawaleshie, East Legon, Accra, Ghana",
    contactPhones: ["0207137437", "0548974717"],
    tikTokHandle: "@troyx_istore",
    currency: "GH₵",
    isAnnouncementActive: false,
    maintenanceMode: false,
    updatedAt: new Date().toISOString(),
  };
  batch.set(settingsRef, settingsData, { merge: true });
  docCount++;

  // 3. Navigation Header & Footer
  console.log("--> Step 3: Migrating Navigation Structure...");
  const navRef = firestore.collection("navigation").doc("header");
  const navData = localDb?.navigation || {
    id: "header-nav",
    location: "header",
    items: [
      { id: "store", label: "Store", href: "/store" },
      { id: "mac", label: "Mac", href: "/mac" },
      { id: "ipad", label: "iPad", href: "/ipad" },
      { id: "iphone", label: "iPhone", href: "/iphone" },
      { id: "watch", label: "Watch", href: "/watch" },
      { id: "airpods", label: "AirPods", href: "/airpods" },
      { id: "accessories", label: "Accessories", href: "/accessories" },
      { id: "compare", label: "Compare", href: "/compare" },
      { id: "deals", label: "Deals", href: "/deals" },
    ],
    updatedAt: new Date().toISOString(),
  };
  batch.set(navRef, navData, { merge: true });
  docCount++;

  const footerRef = firestore.collection("navigation").doc("footer");
  const footerData = {
    columns: localDb?.footerColumns || [],
    updatedAt: new Date().toISOString(),
  };
  batch.set(footerRef, footerData, { merge: true });
  docCount++;

  // 4. Pages Architecture
  console.log("--> Step 4: Migrating Core Pages Architecture...");
  const pages = localDb?.pages || [
    { id: "page-home", slug: "home", title: "TroyX iStore — Home of Original Apple Products", isPublished: true, inNavigation: false, navigationOrder: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "page-store", slug: "store", title: "Apple Store", isPublished: true, inNavigation: true, navigationOrder: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "page-iphone", slug: "iphone", title: "iPhone", isPublished: true, inNavigation: true, navigationOrder: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "page-mac", slug: "mac", title: "Mac", isPublished: true, inNavigation: true, navigationOrder: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "page-ipad", slug: "ipad", title: "iPad", isPublished: true, inNavigation: true, navigationOrder: 4, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "page-watch", slug: "watch", title: "Watch", isPublished: true, inNavigation: true, navigationOrder: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "page-airpods", slug: "airpods", title: "AirPods", isPublished: true, inNavigation: true, navigationOrder: 6, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "page-accessories", slug: "accessories", title: "Accessories", isPublished: true, inNavigation: true, navigationOrder: 7, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "page-compare", slug: "compare", title: "Compare Models", isPublished: true, inNavigation: true, navigationOrder: 8, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "page-deals", slug: "deals", title: "Deals & Promotions", isPublished: true, inNavigation: true, navigationOrder: 9, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ];

  pages.forEach((p) => {
    batch.set(firestore.collection("pages").doc(p.id), p, { merge: true });
    docCount++;
  });

  // 5. Exact 6 Homepage Draft Slots (Strictly ordered, strictly UNPUBLISHED, zero fabricated content)
  console.log("--> Step 5: Migrating Exact 6 Homepage Draft Slots (Unpublished & Empty)...");
  const expectedDrafts = [
    { id: "sec-home-draft-1", draftLabel: "iPhone 18 Pro — dark", sortOrder: 1, theme: "dark", backgroundColor: "#000000", textColor: "#f5f5f7" },
    { id: "sec-home-draft-2", draftLabel: "iPhone Duo — white", sortOrder: 2, theme: "white", backgroundColor: "#ffffff", textColor: "#1d1d1f" },
    { id: "sec-home-draft-3", draftLabel: "MacBook Pro — dark", sortOrder: 3, theme: "dark", backgroundColor: "#000000", textColor: "#f5f5f7" },
    { id: "sec-home-draft-4", draftLabel: "Apple Watch Series 12 — white", sortOrder: 4, theme: "white", backgroundColor: "#ffffff", textColor: "#1d1d1f" },
    { id: "sec-home-draft-5", draftLabel: "iPad A16 — white", sortOrder: 5, theme: "white", backgroundColor: "#ffffff", textColor: "#1d1d1f" },
    { id: "sec-home-draft-6", draftLabel: "AirPods Pro 3 — dark", sortOrder: 6, theme: "dark", backgroundColor: "#000000", textColor: "#f5f5f7" },
  ];

  expectedDrafts.forEach((draft) => {
    const existing = localDb?.sections?.find((s) => s.id === draft.id || s.draftLabel === draft.draftLabel);
    const secDoc = {
      id: draft.id,
      pageId: "page-home",
      sectionType: existing?.sectionType || "cinematic_hero",
      draftLabel: draft.draftLabel,
      title: "",
      subtitle: "",
      tagline: "",
      sortOrder: draft.sortOrder,
      isPublished: false, // STRICTLY UNPUBLISHED
      theme: draft.theme,
      backgroundColor: draft.backgroundColor,
      textColor: draft.textColor,
      textAlignment: "center",
      mediaType: "none",
      desktopImageUrl: "",
      mobileImageUrl: "",
      desktopVideoUrl: "",
      mobileVideoUrl: "",
      posterImageUrl: "",
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    batch.set(firestore.collection("sections").doc(draft.id), secDoc, { merge: true });
    docCount++;
  });

  // 6. Products Catalog
  if (localDb?.products && localDb.products.length > 0) {
    console.log(`--> Step 6: Migrating ${localDb.products.length} Catalog Products...`);
    localDb.products.forEach((prod) => {
      batch.set(firestore.collection("products").doc(prod.id), prod, { merge: true });
      docCount++;
    });
  }

  // 7. Promotions
  if (localDb?.promotions && localDb.promotions.length > 0) {
    console.log(`--> Step 7: Migrating ${localDb.promotions.length} Promotions...`);
    localDb.promotions.forEach((promo) => {
      batch.set(firestore.collection("promotions").doc(promo.id), promo, { merge: true });
      docCount++;
    });
  }

  // 8. Staff Authentication Postponement
  console.log("--> Step 8: Staff Accounts Postponed — omitting users collection creation until verified owner credentials are provided.");

  // Commit batch write
  await batch.commit();

  console.log("\n==================================================================");
  console.log(`  FIRESTORE MIGRATION COMPLETED SUCCESSFULLY! (${docCount} documents synced)`);
  console.log("  • Site Settings & Navigation initialized");
  console.log("  • Exact 6 Homepage draft slots preserved (all UNPUBLISHED)");
  console.log("  • Zero duplicate sections created (idempotent document keys)");
  console.log("  • Staff user creation safely postponed awaiting owner details");
  console.log("==================================================================\n");

  return { docCount };
}

// Standalone execution handler
async function main() {
  console.log("Checking Firestore connection configuration...");
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "troyx-istore";
  console.log(`Target Firebase Project ID: ${projectId}`);

  let firestore = null;
  let hasCredentials = false;

  if (process.env.FIRESTORE_EMULATOR_HOST) {
    console.log(`Using Firestore Emulator at ${process.env.FIRESTORE_EMULATOR_HOST}`);
    const app = admin.apps.length > 0 ? admin.apps[0] : admin.initializeApp({ projectId });
    firestore = getFirestore(app);
    hasCredentials = true;
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
    console.log(`Using GOOGLE_APPLICATION_CREDENTIALS: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
    const keyData = JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, "utf-8"));
    const app = admin.apps.length > 0 ? admin.apps[0] : admin.initializeApp({ credential: admin.credential.cert(keyData), projectId });
    firestore = getFirestore(app);
    hasCredentials = true;
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim();
      let cred;
      if (raw.startsWith("{")) {
        cred = admin.credential.cert(JSON.parse(raw));
      } else {
        const resolvedPath = path.isAbsolute(raw) ? raw : path.join(process.cwd(), raw);
        cred = admin.credential.cert(JSON.parse(fs.readFileSync(resolvedPath, "utf-8")));
      }
      const app = admin.apps.length > 0 ? admin.apps[0] : admin.initializeApp({ credential: cred, projectId });
      firestore = getFirestore(app);
      hasCredentials = true;
    } catch (e) {
      console.warn("Could not initialize with FIREBASE_SERVICE_ACCOUNT_KEY:", e.message);
    }
  } else if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    try {
      const app = admin.apps.length > 0 ? admin.apps[0] : admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
        projectId,
      });
      firestore = getFirestore(app);
      hasCredentials = true;
    } catch (e) {
      console.warn("Could not initialize with private key environment variables:", e.message);
    }
  }

  if (hasCredentials && firestore) {
    await migrateToFirestore(firestore);
  } else {
    console.log("\n------------------------------------------------------------------");
    console.log("ℹ STATUS: Firebase Project ID 'troyx-istore' is successfully configured.");
    console.log("ℹ Cloud Firestore Admin SDK is awaiting service account private key.");
    console.log("ℹ To connect directly to the live cloud Firestore instance:");
    console.log("   1. Go to Firebase Console -> Project Settings -> Service accounts");
    console.log("   2. Click 'Generate new private key' and save as serviceAccountKey.json");
    console.log("   3. Set FIREBASE_SERVICE_ACCOUNT_KEY=./serviceAccountKey.json in .env.local");
    console.log("------------------------------------------------------------------\n");
  }
}

if (process.argv[1] && process.argv[1].endsWith("migrate-to-firestore.mjs")) {
  main().catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
}
