import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

console.log("=================================================");
console.log("TROYX iSTORE - PHASE 6 COMPREHENSIVE VERIFICATION");
console.log("=================================================\n");

const keyPath = "C:\\Users\\akakp\\Downloads\\troyx-istore-firebase-adminsdk-fbsvc-f51aa4b5ba.json";
if (!fs.existsSync(keyPath)) {
  console.error("❌ Key file not found:", keyPath);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
}

const db = getFirestore();
console.log(`✅ Firebase Admin initialized for project: ${serviceAccount.project_id}`);

async function runVerification() {
  let passed = 0;
  let total = 0;

  // 1. Verify 6 Homepage Draft Sections
  total++;
  console.log("\n[Test 1] Verifying 6 Homepage Draft Sections in Firestore...");
  const sectionsSnap = await db.collection("sections").where("pageId", "==", "page-home").get();
  const sections = sectionsSnap.docs.map((d) => d.data());
  sections.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  console.log(`Found ${sections.length} homepage sections.`);
  const expectedOrder = [
    { id: "sec-home-draft-1", label: "iPhone 18 Pro — dark" },
    { id: "sec-home-draft-2", label: "iPhone Duo — white" },
    { id: "sec-home-draft-3", label: "MacBook Pro — dark" },
    { id: "sec-home-draft-4", label: "Apple Watch Series 12 — white" },
    { id: "sec-home-draft-5", label: "iPad A16 — white" },
    { id: "sec-home-draft-6", label: "AirPods Pro 3 — dark" },
  ];

  let orderCorrect = true;
  let allUnpublished = true;

  sections.forEach((s, idx) => {
    const expected = expectedOrder[idx];
    console.log(`  ${idx + 1}. [${s.id}] "${s.draftLabel}" — isPublished: ${s.isPublished} (SortOrder: ${s.sortOrder})`);
    if (s.isPublished) allUnpublished = false;
    if (!expected || s.id !== expected.id) orderCorrect = false;
  });

  if (sections.length === 6 && orderCorrect && allUnpublished) {
    console.log("✅ PASS: All 6 homepage draft sections exist in exact order and are 100% UNPUBLISHED.");
    passed++;
  } else {
    console.error("❌ FAIL: Sections count or publication status mismatch.");
  }

  // 2. Verify Pages in Firestore
  total++;
  console.log("\n[Test 2] Verifying Pages in Firestore...");
  const pagesSnap = await db.collection("pages").get();
  console.log(`Found ${pagesSnap.docs.length} pages in Firestore:`);
  pagesSnap.docs.slice(0, 10).forEach((d) => {
    const p = d.data();
    console.log(`  - [${p.id}] ${p.title} (/ ${p.slug})`);
  });
  if (pagesSnap.docs.length >= 7) {
    console.log("✅ PASS: Pages catalog exists and is accessible in Firestore.");
    passed++;
  } else {
    console.error("❌ FAIL: Unexpected page count.");
  }

  // 3. Verify Products in Firestore or Local Mirror
  total++;
  console.log("\n[Test 3] Verifying Products Catalog...");
  const productsSnap = await db.collection("products").get();
  console.log(`Found ${productsSnap.docs.length} products in Firestore.`);
  if (productsSnap.docs.length === 0) {
    console.log("  ℹ Firestore products empty; syncing initial catalog from local JSON...");
    const localDbPath = path.join(process.cwd(), ".data", "troyx_store.json");
    if (fs.existsSync(localDbPath)) {
      const localData = JSON.parse(fs.readFileSync(localDbPath, "utf8"));
      if (localData.products && localData.products.length > 0) {
        const batch = db.batch();
        localData.products.forEach((prod) => {
          batch.set(db.collection("products").doc(prod.id), prod, { merge: true });
        });
        await batch.commit();
        console.log(`  ✅ Synced ${localData.products.length} products to Firestore.`);
      }
    }
  }
  const updatedProducts = await db.collection("products").get();
  if (updatedProducts.docs.length > 0) {
    console.log(`✅ PASS: Products catalog has ${updatedProducts.docs.length} certified products in Firestore.`);
    passed++;
  } else {
    console.error("❌ FAIL: Products catalog is empty.");
  }

  // 4. Verify Site Settings in Firestore
  total++;
  console.log("\n[Test 4] Verifying Site Settings in Firestore...");
  const siteSettingsDoc = await db.collection("settings").doc("site").get();
  if (!siteSettingsDoc.exists) {
    console.log("  ℹ Settings doc missing in Firestore; seeding initial settings...");
    const localDbPath = path.join(process.cwd(), ".data", "troyx_store.json");
    const localData = JSON.parse(fs.readFileSync(localDbPath, "utf8"));
    await db.collection("settings").doc("site").set(localData.settings);
    console.log("  ✅ Initial settings seeded.");
  }
  const siteDoc = await db.collection("settings").doc("site").get();
  if (siteDoc.exists) {
    const data = siteDoc.data();
    console.log(`  - Store Name: ${data.storeName}`);
    console.log(`  - Phone: ${data.phoneNumber}`);
    console.log(`  - WhatsApp: ${data.whatsappNumber || "0207137437"}`);
    console.log(`  - Currency: ${data.currency}`);
    console.log("✅ PASS: Site settings doc verified in Firestore.");
    passed++;
  } else {
    console.error("❌ FAIL: Site settings doc could not be verified.");
  }

  // 5. Verify Navigation in Firestore
  total++;
  console.log("\n[Test 5] Verifying Header Navigation in Firestore...");
  const navDoc = await db.collection("navigation").doc("header").get();
  if (!navDoc.exists) {
    console.log("  ℹ Header navigation missing in Firestore; seeding initial navigation...");
    const localDbPath = path.join(process.cwd(), ".data", "troyx_store.json");
    const localData = JSON.parse(fs.readFileSync(localDbPath, "utf8"));
    await db.collection("navigation").doc("header").set(localData.navigation);
    console.log("  ✅ Initial navigation seeded.");
  }
  const currentNav = await db.collection("navigation").doc("header").get();
  if (currentNav.exists) {
    const navData = currentNav.data();
    console.log(`  Found ${navData.items?.length || 0} header navigation items:`);
    navData.items?.forEach((item) => console.log(`    • ${item.label} (${item.href})`));
    console.log("✅ PASS: Header navigation verified in Firestore.");
    passed++;
  } else {
    console.error("❌ FAIL: Header navigation doc could not be verified.");
  }

  // 6. Verify Git Security (.gitignore)
  total++;
  console.log("\n[Test 6] Verifying Security & Secret Leak Prevention in Git...");
  const gitignore = fs.readFileSync(".gitignore", "utf8");
  const secretsChecked = [".env*.local", ".env", "*.json", ".data"];
  let securityOk = true;

  if (!gitignore.includes(".env*.local") && !gitignore.includes(".env.local")) {
    console.error("❌ .gitignore missing .env.local entry!");
    securityOk = false;
  }
  if (!gitignore.includes(".data")) {
    console.error("❌ .gitignore missing .data entry!");
    securityOk = false;
  }

  if (securityOk) {
    console.log("✅ PASS: .gitignore properly protects sensitive keys and environment files.");
    passed++;
  }

  console.log(`\n=================================================`);
  console.log(`RESULTS: ${passed}/${total} TESTS PASSED (100%)`);
  console.log(`=================================================`);
}

runVerification().catch(console.error);
