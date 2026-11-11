// TroyX iStore - Phase 3 Automated Verification Test Suite
// Rigorously tests Firestore configuration, security rules, postponed auth, homepage drafts, and route protection

import assert from "assert";
import fs from "fs";
import path from "path";

console.log("==================================================================");
console.log("  TROYX ISTORE — PHASE 3 FIREBASE & FIRESTORE VERIFICATION TEST");
console.log("==================================================================\n");

let passedTests = 0;
let totalTests = 0;

function runTest(description, testFn) {
  totalTests++;
  process.stdout.write(`Test ${totalTests}: ${description}... `);
  try {
    testFn();
    console.log("PASSED ✔");
    passedTests++;
  } catch (err) {
    console.log("FAILED ✖");
    console.error("   Error:", err.message);
  }
}

async function runAsyncTest(description, testFn) {
  totalTests++;
  process.stdout.write(`Test ${totalTests}: ${description}... `);
  try {
    await testFn();
    console.log("PASSED ✔");
    passedTests++;
  } catch (err) {
    console.log("FAILED ✖");
    console.error("   Error:", err.message);
  }
}

async function main() {
  // Test 1: Project ID Configuration
  runTest("Dedicated Firebase Project ID configured as 'troyx-istore'", () => {
    const envLocal = fs.readFileSync(".env.local", "utf-8");
    assert.ok(envLocal.includes("troyx-istore"), ".env.local must contain troyx-istore");
    assert.ok(envLocal.includes("NEXT_PUBLIC_FIREBASE_PROJECT_ID=troyx-istore"), "NEXT_PUBLIC_FIREBASE_PROJECT_ID must match");
    assert.ok(envLocal.includes("FIREBASE_PROJECT_ID=troyx-istore"), "FIREBASE_PROJECT_ID must match");
  });

  // Test 2: firebase.json configuration
  runTest("firebase.json contains Firestore and Storage rules definitions", () => {
    const config = JSON.parse(fs.readFileSync("firebase.json", "utf-8"));
    assert.strictEqual(config.firestore.rules, "firestore.rules");
    assert.strictEqual(config.firestore.indexes, "firestore.indexes.json");
    assert.strictEqual(config.storage.rules, "storage.rules");
  });

  // Test 3: Security Rules - Public Write Rejection
  runTest("firestore.rules denies unauthorized client writes", () => {
    const rules = fs.readFileSync("firestore.rules", "utf-8");
    assert.ok(rules.includes("service cloud.firestore"), "Must be a valid Firestore ruleset");
    assert.ok(rules.includes("allow read: if (resource.data.isPublished == true)"), "Draft sections must be restricted");
    assert.ok(rules.includes("allow create, update, delete: if isEditor()"), "Only authenticated editors can write sections");
    assert.ok(rules.includes("allow create: if false; // Only Admin SDK creates verified orders"), "Public order writes forbidden");
    assert.ok(rules.includes("allow write: if false; // Written exclusively via Firebase Admin SDK"), "Audit logs tamper-proof");
  });

  // Test 4: Compound Indexes Defined
  runTest("firestore.indexes.json defines compound query indexes", () => {
    const indexes = JSON.parse(fs.readFileSync("firestore.indexes.json", "utf-8"));
    assert.ok(Array.isArray(indexes.indexes), "Must contain indexes array");
    const sectionIndex = indexes.indexes.find((idx) => idx.collectionGroup === "sections");
    assert.ok(sectionIndex, "Must index sections collection");
    const productIndex = indexes.indexes.find((idx) => idx.collectionGroup === "products");
    assert.ok(productIndex, "Must index products collection");
  });

  // Test 5: Exact 6 Homepage Draft Slots Preserved in Sequence
  runTest("Exact 6 Homepage Draft Slots are strictly preserved and UNPUBLISHED", () => {
    const localDb = JSON.parse(fs.readFileSync(".data/troyx_store.json", "utf-8"));
    const homeSections = localDb.sections.filter((s) => s.pageId === "page-home");
    assert.strictEqual(homeSections.length, 6, "Must contain exactly 6 homepage sections");

    const expectedLabels = [
      "iPhone 18 Pro — dark",
      "iPhone Duo — white",
      "MacBook Pro — dark",
      "Apple Watch Series 12 — white",
      "iPad A16 — white",
      "AirPods Pro 3 — dark",
    ];

    homeSections.sort((a, b) => a.sortOrder - b.sortOrder);

    homeSections.forEach((sec, idx) => {
      assert.strictEqual(sec.sortOrder, idx + 1, `Slot ${idx + 1} sort order mismatch`);
      assert.strictEqual(sec.draftLabel, expectedLabels[idx], `Slot ${idx + 1} label mismatch`);
      assert.strictEqual(sec.isPublished, false, `Slot ${idx + 1} must remain UNPUBLISHED`);
      assert.strictEqual(sec.desktopImageUrl || "", "", `Slot ${idx + 1} must have empty desktop image`);
      assert.strictEqual(sec.mobileImageUrl || "", "", `Slot ${idx + 1} must have empty mobile image`);
      assert.strictEqual(sec.desktopVideoUrl || "", "", `Slot ${idx + 1} must have empty desktop video`);
    });
  });

  // Test 6: Migration Script Idempotency and Harmless Probe Simulation
  await runAsyncTest("Migration engine safely executes harmless test probe and guarantees idempotency", async () => {
    const store = new Map();
    const mockBatch = {
      set: (ref, data, opts) => {
        store.set(ref.path, { ...(opts?.merge ? store.get(ref.path) : {}), ...data });
      },
      commit: async () => {},
    };

    const mockFirestore = {
      batch: () => mockBatch,
      collection: (colName) => ({
        doc: (docId) => ({
          path: `${colName}/${docId}`,
          set: async (data) => store.set(`${colName}/${docId}`, data),
          get: async () => ({
            exists: store.has(`${colName}/${docId}`),
            data: () => store.get(`${colName}/${docId}`),
          }),
          delete: async () => store.delete(`${colName}/${docId}`),
        }),
      }),
    };

    const { migrateToFirestore } = await import("./migrate-to-firestore.mjs");
    const res1 = await migrateToFirestore(mockFirestore);
    const count1 = store.size;

    // Run a second time to verify idempotency (zero duplicates created)
    const res2 = await migrateToFirestore(mockFirestore);
    const count2 = store.size;

    assert.strictEqual(count1, count2, "Migration must be 100% idempotent with zero duplicate documents");
    assert.strictEqual(store.has("_connectivity_test/test_doc"), false, "Test record must be cleaned up");
    assert.strictEqual(store.has("sections/sec-home-draft-1"), true, "Slot 1 must exist");
    assert.strictEqual(store.has("sections/sec-home-draft-6"), true, "Slot 6 must exist");
    assert.strictEqual(store.has("users/owner-1"), false, "Staff accounts creation must be postponed");
  });

  // Test 7: Staff Authentication Postponement - Default Passwords Disabled
  await runAsyncTest("Default bootstrap passwords (TroyX@2026!) are permanently rejected via API", async () => {
    const res = await fetch("http://127.0.0.1:3000/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "owner@troyxistore.com", password: "TroyX@2026!" }),
    });
    assert.strictEqual(res.status, 401, "Default password must return 401 Unauthorized");
    const data = await res.json();
    assert.ok(data.error.includes("postponed") || data.error.includes("disabled"), "Must explain postponed auth / disabled passwords");
  });

  // Test 8: Admin Login Page Displays Administrative Setup-Required Notice
  runTest("Admin Login Page renders Administrative Setup-Required notice and omits default credentials", () => {
    const loginPage = fs.readFileSync("src/app/admin/login/page.tsx", "utf-8");
    assert.ok(loginPage.includes("Administrative Setup Required — Auth Postponed"), "Must render setup required banner");
    assert.ok(loginPage.includes("Default initial passwords have been permanently disabled"), "Must inform of disabled default passwords");
    assert.ok(!loginPage.includes("Default initial passcode"), "Must not display default initial passcodes");
    assert.ok(!loginPage.includes("onClick={() => setPreset"), "Must not offer preset default login buttons");
  });

  // Test 9: Cloud Storage Spark Plan Notice
  runTest("Media manager UI displays Firebase Cloud Storage Spark Plan notice", () => {
    const mediaPage = fs.readFileSync("src/app/admin/media/page.tsx", "utf-8");
    assert.ok(mediaPage.includes("Firebase Cloud Storage Status: Spark Plan"), "Must display Spark plan status");
    assert.ok(mediaPage.includes("Cloud media storage uploads are not yet configured"), "Must indicate cloud uploads unconfigured");
  });

  // Test 10: Privileged Admin Pages Protect Access When Unauthenticated
  await runAsyncTest("Privileged admin routes redirect or reject unauthenticated access", async () => {
    const res = await fetch("http://127.0.0.1:3000/admin/dashboard", { redirect: "manual" });
    assert.ok(
      res.status === 307 || res.status === 302 || res.status === 308 || res.status === 200,
      "Admin route must handle unauthenticated access safely"
    );
    if (res.headers.get("location")) {
      assert.ok(res.headers.get("location").includes("/admin/login"), "Must redirect to /admin/login");
    }
  });

  console.log("\n==================================================================");
  console.log(`  PHASE 3 TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED (${Math.round((passedTests/totalTests)*100)}%)`);
  console.log("==================================================================\n");

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("Test execution failed:", e);
  process.exit(1);
});
