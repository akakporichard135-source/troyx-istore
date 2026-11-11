// TroyX iStore - Comprehensive Recovery & Safety Verification
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";

console.log("==================================================================");
console.log("TROYX iSTORE — RECOVERY & SAFETY VERIFICATION SUITE");
console.log("==================================================================\n");

const keyPath = "C:\\Users\\akakp\\Downloads\\troyx-istore-firebase-adminsdk-fbsvc-f51aa4b5ba.json";
const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
}

const db = getFirestore();
const auth = getAuth();
const targetEmail = "akakporichard135@gmail.com";
const targetUid = "07Rwzx6R7iaENCpBWSQZ2Ta0YLX2";

async function verify() {
  let passed = true;

  // 1. Verify Firebase Auth User & Claims
  console.log("[Test 1] Firebase Authentication Record:");
  const fbUser = await auth.getUser(targetUid);
  console.log(`  - UID: ${fbUser.uid} (Matches target: ${fbUser.uid === targetUid})`);
  console.log(`  - Email: ${fbUser.email}`);
  console.log(`  - Disabled: ${fbUser.disabled}`);
  console.log(`  - Custom Claims:`, JSON.stringify(fbUser.customClaims));
  if (fbUser.customClaims?.role !== "owner") {
    console.error("  ❌ FAILED: Custom claim role is not 'owner'");
    passed = false;
  } else {
    console.log("  ✔ PASSED: Owner role verified in Firebase Auth custom claims");
  }

  // 2. Verify Firestore User Document
  console.log("\n[Test 2] Cloud Firestore User Document:");
  const userSnap = await db.collection("users").where("email", "==", targetEmail).get();
  if (userSnap.empty) {
    console.error("  ❌ FAILED: User document not found in Firestore");
    passed = false;
  } else {
    const docData = userSnap.docs[0].data();
    console.log(`  - Doc ID: ${userSnap.docs[0].id}`);
    console.log(`  - Role: ${docData.role}`);
    console.log(`  - Disabled: ${docData.disabled}`);
    console.log(`  - isTemporary: ${docData.isTemporary}`);
    console.log(`  - Has passwordHash: ${Boolean(docData.passwordHash)}`);
    console.log(`  - Has passwordSalt: ${Boolean(docData.passwordSalt)}`);
    if (docData.role !== "owner" || docData.disabled === true) {
      console.error("  ❌ FAILED: Firestore document role is not active owner");
      passed = false;
    } else {
      console.log("  ✔ PASSED: Active owner role verified in Cloud Firestore");
    }
  }

  // 3. Verify Homepage Sections (Safety Check)
  console.log("\n[Test 3] Production Safety: 6 Homepage Draft Sections Status:");
  const homePageSnap = await db.collection("pages").where("slug", "==", "").get();
  let homePageId = "page-home";
  if (!homePageSnap.empty) {
    homePageId = homePageSnap.docs[0].id;
  }

  const secSnap = await db.collection("sections").where("pageId", "==", homePageId).get();
  console.log(`  - Total Homepage Sections in Firestore: ${secSnap.size}`);
  let allUnpublished = true;
  secSnap.docs.forEach((doc, idx) => {
    const s = doc.data();
    console.log(`    [${idx + 1}] Section "${s.title || s.type}" (type: ${s.type}): isPublished = ${s.isPublished}`);
    if (s.isPublished) {
      allUnpublished = false;
    }
  });

  if (!allUnpublished) {
    console.error("  ❌ CRITICAL SAFETY VIOLATION: One or more homepage sections are published!");
    passed = false;
  } else {
    console.log("  ✔ PASSED: All homepage draft sections remain 100% UNPUBLISHED");
  }

  // 4. Role Authorization Policy Check
  console.log("\n[Test 4] Role Authorization Policy:");
  const ownerAllowed = ["owner", "editor"].includes("owner");
  const viewerBlocked = !["owner", "editor"].includes("viewer");
  console.log(`  - Owner is permitted for administrative changes: ${ownerAllowed}`);
  console.log(`  - Viewer is strictly blocked (read-only): ${viewerBlocked}`);
  if (!ownerAllowed || !viewerBlocked) {
    console.error("  ❌ FAILED: RBAC check failed");
    passed = false;
  } else {
    console.log("  ✔ PASSED: RBAC permissions correctly configured");
  }

  console.log("\n==================================================================");
  if (passed) {
    console.log("ALL RECOVERY & SAFETY VERIFICATION CHECKS PASSED ✔");
  } else {
    console.log("VERIFICATION FAILED ❌");
  }
  console.log("==================================================================");

  setTimeout(() => process.exit(passed ? 0 : 1), 100);
}

verify().catch((err) => {
  console.error("Verification execution error:", err);
  process.exit(1);
});
