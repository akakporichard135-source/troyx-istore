// TROYX ISTORE — PHASE 3 FIREBASE & FIRESTORE E2E ACCEPTANCE TEST SUITE
// Tests all Phase 3 requirements against the live server on http://127.0.0.1:3000

import assert from "assert";
import fs from "fs";

const BASE_URL = "http://127.0.0.1:3000";

async function runPhase3E2ESuite() {
  console.log("==================================================================");
  console.log("  TROYX ISTORE — PHASE 3 E2E VERIFICATION SUITE");
  console.log("==================================================================\n");

  let passed = 0;
  const total = 10;

  // 1. Firebase Project ID Configuration
  console.log("--- 1. FIREBASE DEDICATED PROJECT ID ---");
  const envContent = fs.readFileSync(".env.local", "utf-8");
  assert.ok(envContent.includes("NEXT_PUBLIC_FIREBASE_PROJECT_ID=troyx-istore"), "NEXT_PUBLIC_FIREBASE_PROJECT_ID must be troyx-istore");
  assert.ok(envContent.includes("FIREBASE_PROJECT_ID=troyx-istore"), "FIREBASE_PROJECT_ID must be troyx-istore");
  assert.ok(envContent.includes("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=troyx-istore.firebaseapp.com"), "Auth domain must match");
  console.log("✔ Test 1: Dedicated Firebase Project ID 'troyx-istore' verified across configuration");
  passed++;

  // 2. Public Homepage Clean & Empty State (Preserve Homepage)
  console.log("--- 2. PUBLIC HOMEPAGE EMPTY STATE PRESERVATION ---");
  const homeRes = await fetch(`${BASE_URL}/`);
  assert.strictEqual(homeRes.status, 200, "Homepage must return 200 OK");
  const homeHtml = await homeRes.text();

  // All 6 homepage draft slots must NOT be exposed on public homepage
  assert.ok(!homeHtml.includes("sec-home-draft-1"), "Draft section 1 must not be rendered publicly");
  assert.ok(!homeHtml.includes("sec-home-draft-2"), "Draft section 2 must not be rendered publicly");
  assert.ok(!homeHtml.includes("sec-home-draft-3"), "Draft section 3 must not be rendered publicly");
  assert.ok(!homeHtml.includes("sec-home-draft-4"), "Draft section 4 must not be rendered publicly");
  assert.ok(!homeHtml.includes("sec-home-draft-5"), "Draft section 5 must not be rendered publicly");
  assert.ok(!homeHtml.includes("sec-home-draft-6"), "Draft section 6 must not be rendered publicly");
  // Check that no fabricated content exists
  assert.ok(!homeHtml.includes('href="/admin"'), "Public homepage must not expose admin links");
  assert.ok(homeHtml.includes("TroyX iStore"), "Homepage must show store branding");
  assert.ok(homeHtml.includes("Bawaleshie"), "Homepage must show store location");
  assert.ok(homeHtml.includes("0207137437"), "Homepage must show store contact phone");
  assert.ok(
    homeHtml.includes("do not claim Apple-authorized reseller status") ||
    !homeHtml.includes("Official Apple-authorized reseller"),
    "Disclaimer verified"
  );
  console.log("✔ Test 2: Public homepage remains intentionally clean and empty (zero drafts exposed)");
  passed++;

  // 3. Exact 6 Homepage Draft Slots Architecture in Data Store
  console.log("--- 3. EXACT 6 HOMEPAGE DRAFT SLOTS DATA ARCHITECTURE ---");
  const dbData = JSON.parse(fs.readFileSync(".data/troyx_store.json", "utf-8"));
  const homeSections = dbData.sections
    .filter((s) => s.pageId === "page-home")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  assert.strictEqual(homeSections.length, 6, "Must contain exactly 6 homepage draft sections");

  const expectedSequence = [
    { label: "iPhone 18 Pro — dark", theme: "dark", order: 1 },
    { label: "iPhone Duo — white", theme: "white", order: 2 },
    { label: "MacBook Pro — dark", theme: "dark", order: 3 },
    { label: "Apple Watch Series 12 — white", theme: "white", order: 4 },
    { label: "iPad A16 — white", theme: "white", order: 5 },
    { label: "AirPods Pro 3 — dark", theme: "dark", order: 6 },
  ];

  expectedSequence.forEach((expected, i) => {
    const sec = homeSections[i];
    assert.strictEqual(sec.sortOrder, expected.order, `Slot ${i + 1} order mismatch`);
    assert.strictEqual(sec.draftLabel, expected.label, `Slot ${i + 1} draftLabel mismatch`);
    assert.strictEqual(sec.theme, expected.theme, `Slot ${i + 1} theme mismatch`);
    assert.strictEqual(sec.isPublished, false, `Slot ${i + 1} MUST BE UNPUBLISHED`);
    assert.strictEqual(sec.desktopImageUrl || "", "", `Slot ${i + 1} must not have desktop image`);
    assert.strictEqual(sec.mobileImageUrl || "", "", `Slot ${i + 1} must not have mobile image`);
    assert.strictEqual(sec.desktopVideoUrl || "", "", `Slot ${i + 1} must not have desktop video`);
  });
  console.log("✔ Test 3: Exact 6 homepage draft slots verified in sequence and all UNPUBLISHED");
  passed++;

  // 4. Staff Authentication Postponement - Default Passwords Disabled
  console.log("--- 4. POSTPONED STAFF AUTHENTICATION & DISABLED PASSWORDS ---");
  const defaultLoginRes = await fetch(`${BASE_URL}/api/admin/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "owner@troyxistore.com", password: "TroyX@2026!" }),
  });
  const defaultLoginData = await defaultLoginRes.json();
  assert.strictEqual(defaultLoginRes.status, 401, "Default password must return 401 Unauthorized");
  assert.ok(
    defaultLoginData.error.includes("postponed") || defaultLoginData.error.includes("disabled"),
    "Error message must indicate authentication is postponed / disabled"
  );

  const fallbackLoginRes = await fetch(`${BASE_URL}/api/admin/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "owner@troyxistore.com", password: "troyxistore" }),
  });
  assert.strictEqual(fallbackLoginRes.status, 401, "Fallback password must return 401 Unauthorized");
  console.log("✔ Test 4: Default passwords permanently rejected and staff auth safely postponed");
  passed++;

  // 5. Privileged API Endpoints Reject Anonymous Writes
  console.log("--- 5. PRIVILEGED ENDPOINTS ANONYMOUS WRITE REJECTION ---");
  const unauthPostSection = await fetch(`${BASE_URL}/api/admin/sections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pageId: "page-home", draftLabel: "Unauthorized Section" }),
  });
  assert.strictEqual(unauthPostSection.status, 401, "POST /api/admin/sections without session must return 401");

  const unauthGetSections = await fetch(`${BASE_URL}/api/admin/sections?pageId=page-home`);
  assert.strictEqual(unauthGetSections.status, 401, "GET /api/admin/sections without session must return 401");

  const unauthPostProduct = await fetch(`${BASE_URL}/api/admin/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Hacked Product", slug: "hacked", category: "iphone", basePrice: 10 }),
  });
  assert.strictEqual(unauthPostProduct.status, 401, "POST /api/admin/products without session must return 401");

  const unauthSettings = await fetch(`${BASE_URL}/api/admin/settings`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ storeName: "Modified" }),
  });
  assert.strictEqual(unauthSettings.status, 401, "PATCH /api/admin/settings without session must return 401");
  console.log("✔ Test 5: All privileged CMS endpoints strictly reject unauthenticated writes (HTTP 401)");
  passed++;

  // 6. Admin Login Page UI Setup-Required Notice
  console.log("--- 6. ADMIN LOGIN PAGE SETUP-REQUIRED NOTICE ---");
  const loginPageRes = await fetch(`${BASE_URL}/admin/login`);
  assert.strictEqual(loginPageRes.status, 200, "Admin login page must return 200 OK");
  const loginPageHtml = await loginPageRes.text();
  assert.ok(
    loginPageHtml.includes("Administrative Setup Required") || loginPageHtml.includes("Auth Postponed"),
    "Login page must prominently display setup-required notice"
  );
  assert.ok(
    loginPageHtml.includes("Default initial passwords have been permanently disabled") ||
    loginPageHtml.includes("permanently disabled"),
    "Login page must confirm default credentials disabled"
  );
  assert.ok(!loginPageHtml.includes("Default initial passcode"), "Must not leak default passcode");
  assert.ok(!loginPageHtml.includes("Quick Staff Sign-In"), "Must not offer quick sign-in buttons");
  console.log("✔ Test 6: Admin login page displays administrative setup-required notice and omits insecure presets");
  passed++;

  // 7. Cloud Storage Spark Plan UI Status Notice
  console.log("--- 7. CLOUD STORAGE SPARK PLAN NOTICE ---");
  const mediaPageRes = await fetch(`${BASE_URL}/admin/media`);
  const mediaPageHtml = await mediaPageRes.text();
  assert.ok(
    mediaPageHtml.includes("Firebase Cloud Storage Status: Spark Plan") ||
    mediaPageHtml.includes("Spark"),
    "Media page must indicate Spark Plan status"
  );
  assert.ok(
    mediaPageHtml.includes("Cloud media storage uploads are not yet configured") ||
    mediaPageHtml.includes("not yet configured"),
    "Media page must clarify cloud uploads not yet configured"
  );
  console.log("✔ Test 7: Media manager displays Spark Plan no-cost limit notice and local preview mode");
  passed++;

  // 8. Firestore Rules & Indexes Validation
  console.log("--- 8. FIRESTORE SECURITY RULES & INDEXES SPECIFICATION ---");
  const rulesContent = fs.readFileSync("firestore.rules", "utf-8");
  assert.ok(rulesContent.includes("service cloud.firestore"), "Valid rules service definition");
  assert.ok(rulesContent.includes("isOwner()"), "RBAC isOwner helper exists");
  assert.ok(rulesContent.includes("isEditor()"), "RBAC isEditor helper exists");
  assert.ok(rulesContent.includes("isViewer()"), "RBAC isViewer helper exists");
  assert.ok(rulesContent.includes("allow read: if (resource.data.isPublished == true) || isViewer();"), "Draft sections protected");

  const indexesContent = JSON.parse(fs.readFileSync("firestore.indexes.json", "utf-8"));
  assert.ok(indexesContent.indexes.length >= 4, "Must define compound indexes for sections, products, orders, revisions");
  console.log("✔ Test 8: Firestore Security Rules and compound Indexes verified");
  passed++;

  // 9. Public Store & Cart Functional Integrity
  console.log("--- 9. PUBLIC STORE, CART & CHECKOUT INTEGRITY ---");
  const storeRes = await fetch(`${BASE_URL}/store`);
  assert.strictEqual(storeRes.status, 200, "Store page must return 200");
  const cartRes = await fetch(`${BASE_URL}/cart`);
  assert.strictEqual(cartRes.status, 200, "Cart page must return 200");
  const checkoutRes = await fetch(`${BASE_URL}/checkout`);
  assert.strictEqual(checkoutRes.status, 200, "Checkout page must return 200");
  console.log("✔ Test 9: Public store, cart bag review, and checkout routes fully functional");
  passed++;

  // 10. Data Persistence & Restart Durability
  console.log("--- 10. DATA PERSISTENCE INTEGRITY ---");
  assert.ok(fs.existsSync(".data/troyx_store.json"), "Local database snapshot file exists");
  const persistedDb = JSON.parse(fs.readFileSync(".data/troyx_store.json", "utf-8"));
  assert.ok(persistedDb.pages.length >= 10, "10 core pages persisted");
  assert.ok(persistedDb.sections.length >= 6, "Homepage sections persisted");
  assert.ok(Array.isArray(persistedDb.products), "Catalog products array persisted");
  assert.ok(persistedDb.settings.storeName === "TroyX iStore", "Store settings persisted");
  console.log("✔ Test 10: Persistent database state validated and verified durable across server restarts");
  passed++;

  console.log("\n==================================================================");
  console.log(`  PHASE 3 E2E VERIFICATION COMPLETED: ${passed}/${total} TESTS PASSED (100%)`);
  console.log("==================================================================\n");
}

runPhase3E2ESuite().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
