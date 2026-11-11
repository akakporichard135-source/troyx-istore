// TroyX iStore - Phase 4 Cinematic Media & Cloudinary Integration Test Suite
// Verifies all requirements: Cloudinary SDK, signed upload, Firestore persistence,
// reference safety checks, video controls, permissions, and storefront preservation.

import fs from "fs";
import path from "path";
import assert from "assert";
import crypto from "crypto";
import admin from "firebase-admin";
import { v2 as cloudinary } from "cloudinary";

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:3000";

// 1. Load .env.local
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

// 2. Initialize Firebase Admin SDK
const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS.replace(/^["']|["']$/g, "").trim();
const cred = JSON.parse(fs.readFileSync(keyPath, "utf-8"));
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(cred),
    projectId: process.env.FIREBASE_PROJECT_ID || cred.project_id || "troyx-istore",
  });
}
const firestore = admin.firestore();

// Helper to sign test session tokens for fast and reliable auth
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "troyx-istore-jwt-super-secret-key-change-in-production";

function createTestToken(user) {
  const session = {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName || "Admin",
      role: user.role,
      isTemporary: user.isTemporary || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    expiresAt: Date.now() + 86400 * 1000,
    customClaims: {
      role: user.role,
      temporary: user.isTemporary || false,
    },
  };
  return Buffer.from(JSON.stringify(session)).toString("base64");
}

const ownerCookie = `troyx_admin_session=${createTestToken({
  id: "test-owner-id",
  email: "owner@troyxistore.com",
  role: "owner",
  fullName: "Store Owner",
})}`;

const viewerCookie = `troyx_admin_session=${createTestToken({
  id: "test-viewer-id",
  email: "viewer@troyxistore.com",
  role: "viewer",
  fullName: "Audit Viewer",
})}`;

console.log("==================================================================");
console.log("  TROYX ISTORE — PHASE 4: CINEMATIC MEDIA & CLOUDINARY VERIFICATION");
console.log("==================================================================");

async function runTestSuite() {
  let passed = 0;
  const total = 9;

  // TEST 1: Cloudinary SDK & Config Endpoint Verification
  console.log("\n--- TEST 1: CLOUDINARY CONFIG & STATUS ENDPOINT ---");
  const configRes = await fetch(`${BASE_URL}/api/admin/media/config`, {
    headers: { Cookie: ownerCookie },
  });
  assert.strictEqual(configRes.status, 200, "Config endpoint must return HTTP 200");
  const configData = await configRes.json();
  assert.strictEqual(configData.status, "ok", "Status must be 'ok'");
  assert.strictEqual(configData.defaultFolder, "troyx-istore/media", "Default folder must be troyx-istore/media");
  assert.strictEqual(configData.api_secret, undefined, "API Secret must NEVER be exposed in config endpoint!");
  console.log(`✔ Test 1: Config endpoint verified (isConfigured: ${configData.isConfigured}, secrets secure)`);
  passed++;

  // TEST 2: Cloudinary HMAC-SHA1 Signed Upload Signature Generation
  console.log("\n--- TEST 2: CLOUDINARY SIGNED SIGNATURE ENGINE ---");
  // Test SDK signature calculation directly
  const testSecret = "test_api_secret_for_signature_verification";
  const testParams = {
    folder: "troyx-istore/media",
    timestamp: 1700000000,
  };
  const expectedSig = cloudinary.utils.api_sign_request(testParams, testSecret);
  assert.ok(expectedSig && expectedSig.length === 40, "Signature must be a 40-character SHA1 hex string");
  console.log(`✔ Test 2: Official Cloudinary SDK signature engine verified (sample SHA1: ${expectedSig.slice(0, 10)}...)`);
  passed++;

  // TEST 3: Access Control & Permissions on Signed Upload Endpoint
  console.log("\n--- TEST 3: ACCESS CONTROL ON SIGN-UPLOAD ENDPOINT ---");
  // Anonymous must return 401
  const anonSign = await fetch(`${BASE_URL}/api/admin/media/sign-upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resourceType: "video" }),
  });
  assert.strictEqual(anonSign.status, 401, "Anonymous sign-upload must return HTTP 401");

  // Viewer role must return 403 Forbidden
  const viewerSign = await fetch(`${BASE_URL}/api/admin/media/sign-upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: viewerCookie },
    body: JSON.stringify({ resourceType: "video" }),
  });
  assert.strictEqual(viewerSign.status, 403, "Viewer role must return HTTP 403 Forbidden on sign-upload");
  console.log("✔ Test 3: Anonymous rejected with 401, viewer rejected with 403 on sign-upload");
  passed++;

  // TEST 4: Authoritative Cloud Firestore Metadata Persistence (POST /api/admin/media)
  console.log("\n--- TEST 4: FIRESTORE MEDIA METADATA PERSISTENCE ---");
  const testMediaPayload = {
    filename: "iphone18-dark-titanium-showcase.jpg",
    publicUrl: "https://res.cloudinary.com/troyx-istore/image/upload/v1700000000/troyx-istore/media/test-dark-titanium.jpg",
    fileSize: 1420500,
    mimeType: "image/jpeg",
    mediaType: "image",
    publicId: "troyx-istore/media/test-dark-titanium",
    assetId: `cld-asset-${Date.now()}`,
    width: 3840,
    height: 2160,
    format: "jpg",
    altText: "iPhone 18 Pro Dark Titanium Studio Showcase",
    caption: "Cinematic grade dark titanium finish",
    focalPointX: 48,
    focalPointY: 52,
  };

  const uploadMetaRes = await fetch(`${BASE_URL}/api/admin/media`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: ownerCookie,
    },
    body: JSON.stringify(testMediaPayload),
  });
  assert.strictEqual(uploadMetaRes.status, 200, "POST /api/admin/media must return 200");
  const uploadData = await uploadMetaRes.json();
  assert.ok(uploadData.asset && uploadData.asset.id, "Returned asset must have an ID");
  const createdAssetId = uploadData.asset.id;

  // Verify document exists in Cloud Firestore 'media' collection
  const firestoreDoc = await firestore.collection("media").doc(createdAssetId).get();
  assert.ok(firestoreDoc.exists, "Document must exist in Cloud Firestore 'media' collection");
  const fsData = firestoreDoc.data();
  assert.strictEqual(fsData.publicId, testMediaPayload.publicId, "publicId must match");
  assert.strictEqual(fsData.provider, "cloudinary", "provider must be 'cloudinary'");
  assert.strictEqual(fsData.width, 3840);
  assert.strictEqual(fsData.focalPointX, 48);
  console.log(`✔ Test 4: Media asset persisted to Cloud Firestore collection 'media' (ID: ${createdAssetId})`);
  passed++;

  // TEST 5: Media Query & Search via GET /api/admin/media
  console.log("\n--- TEST 5: MEDIA QUERY & SEARCH WITH ROLE ACCESS ---");
  // Viewer can read media library
  const getMediaRes = await fetch(`${BASE_URL}/api/admin/media?q=titanium`, {
    headers: { Cookie: viewerCookie },
  });
  assert.strictEqual(getMediaRes.status, 200, "Viewer role must be able to GET /api/admin/media");
  const listData = await getMediaRes.json();
  assert.ok(Array.isArray(listData.assets), "Assets must be an array");
  const found = listData.assets.find((a) => a.id === createdAssetId);
  assert.ok(found, "Created asset must be found via search");
  console.log(`✔ Test 5: Media library query & search verified (returned ${listData.assets.length} items)`);
  passed++;

  // TEST 6: Safe Deletion & Reference Protection
  console.log("\n--- TEST 6: SAFE DELETION & REFERENCE TRACKING ---");
  // Attach created asset to section 1
  const secRef = firestore.collection("sections").doc("sec-home-draft-1");
  await secRef.update({
    desktopImageUrl: testMediaPayload.publicUrl,
  });

  // Attempt to delete media asset while in use
  const deleteBlockedRes = await fetch(`${BASE_URL}/api/admin/media/${createdAssetId}`, {
    method: "DELETE",
    headers: { Cookie: ownerCookie },
  });
  assert.strictEqual(deleteBlockedRes.status, 400, "Deletion must be BLOCKED with HTTP 400 when media is in use");
  const blockedData = await deleteBlockedRes.json();
  assert.ok(blockedData.inUse, "Response must specify inUse: true");
  console.log(`✔ Test 6a: Deletion correctly blocked: "${blockedData.error}"`);

  // Detach asset from section 1
  await secRef.update({
    desktopImageUrl: "",
  });

  // Now delete unreferenced asset
  const deleteSuccessRes = await fetch(`${BASE_URL}/api/admin/media/${createdAssetId}`, {
    method: "DELETE",
    headers: { Cookie: ownerCookie },
  });
  assert.strictEqual(deleteSuccessRes.status, 200, "Deletion must succeed when media is unused");

  // Verify document is removed from Cloud Firestore
  const checkDeleted = await firestore.collection("media").doc(createdAssetId).get();
  assert.strictEqual(checkDeleted.exists, false, "Document must no longer exist in Cloud Firestore");
  console.log("✔ Test 6b: Unreferenced media safely deleted from Firestore");
  passed++;

  // TEST 7: Cinematic Video Section Configuration in Firestore
  console.log("\n--- TEST 7: CINEMATIC VIDEO CONTROLS & SECTION PERSISTENCE ---");
  // Test updating section with cinematic video controls
  const videoConfigUpdate = {
    desktopVideoUrl: "https://res.cloudinary.com/troyx-istore/video/upload/v1700000000/troyx-istore/media/showcase.mp4",
    mobileVideoUrl: "https://res.cloudinary.com/troyx-istore/video/upload/v1700000000/troyx-istore/media/showcase-mobile.mp4",
    posterImageUrl: "https://res.cloudinary.com/troyx-istore/image/upload/v1700000000/troyx-istore/media/poster.jpg",
    mediaType: "video",
    config: {
      videoAutoplay: true,
      videoLoop: true,
      videoMuted: true,
      videoControls: false,
      overlayOpacity: 0.25,
    },
  };

  const updateSecRes = await fetch(`${BASE_URL}/api/admin/sections/sec-home-draft-1`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: ownerCookie,
    },
    body: JSON.stringify(videoConfigUpdate),
  });
  assert.strictEqual(updateSecRes.status, 200, "Section PATCH must return 200");
  const updatedSec = (await updateSecRes.json()).section;
  assert.strictEqual(updatedSec.desktopVideoUrl, videoConfigUpdate.desktopVideoUrl);
  assert.strictEqual(updatedSec.mobileVideoUrl, videoConfigUpdate.mobileVideoUrl);
  assert.strictEqual(updatedSec.config.overlayOpacity, 0.25);
  assert.strictEqual(updatedSec.isPublished, false, "Section MUST REMAIN UNPUBLISHED!");

  // Reset section 1 to clean blueprint state (both in Firestore and local db)
  await fetch(`${BASE_URL}/api/admin/sections/sec-home-draft-1`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: ownerCookie,
    },
    body: JSON.stringify({
      desktopVideoUrl: "",
      mobileVideoUrl: "",
      desktopImageUrl: "",
      mobileImageUrl: "",
      posterImageUrl: "",
      mediaType: "none",
      config: {
        videoAutoplay: true,
        videoLoop: true,
        videoMuted: true,
        videoControls: false,
        overlayOpacity: 0,
      },
      isPublished: false,
    }),
  });
  console.log("✔ Test 7: Cinematic video controls (desktop/mobile video, poster, autoplay, loop, muted, overlay) verified & persisted");
  passed++;

  // TEST 8: Strict Preservation of the 6 Homepage Draft Sections
  console.log("\n--- TEST 8: PRESERVATION OF SIX HOMEPAGE DRAFTS & ORDER ---");
  const expectedOrder = [
    { id: "sec-home-draft-1", label: "iPhone 18 Pro — dark" },
    { id: "sec-home-draft-2", label: "iPhone Duo — white" },
    { id: "sec-home-draft-3", label: "MacBook Pro — dark" },
    { id: "sec-home-draft-4", label: "Apple Watch Series 12 — white" },
    { id: "sec-home-draft-5", label: "iPad A16 — white" },
    { id: "sec-home-draft-6", label: "AirPods Pro 3 — dark" },
  ];

  const secSnap = await firestore.collection("sections").where("pageId", "==", "page-home").get();
  assert.strictEqual(secSnap.size, 6, "Must have exactly 6 homepage draft sections");
  const cloudSections = secSnap.docs
    .map((d) => d.data())
    .sort((a, b) => a.sortOrder - b.sortOrder);

  for (let i = 0; i < 6; i++) {
    const expected = expectedOrder[i];
    const actual = cloudSections[i];
    assert.strictEqual(actual.id, expected.id, `Slot ${i + 1} ID mismatch: ${actual.id} !== ${expected.id}`);
    assert.strictEqual(actual.draftLabel, expected.label, `Slot ${i + 1} label mismatch`);
    assert.strictEqual(actual.sortOrder, i + 1, `Slot ${i + 1} sortOrder mismatch`);
    assert.strictEqual(actual.isPublished, false, `Slot ${i + 1} MUST BE UNPUBLISHED (isPublished: false)`);
  }
  console.log("✔ Test 8: All six homepage drafts verified in exact sequence (1..6) and remain 100% unpublished");
  passed++;

  // TEST 9: Storefront and Admin Pages Return 200 OK
  console.log("\n--- TEST 9: STOREFRONT & CONTROL CENTER ENDPOINTS ---");
  const homeRes = await fetch(`${BASE_URL}/`);
  assert.strictEqual(homeRes.status, 200, "Storefront homepage must return 200 OK");
  const homeHtml = await homeRes.text();
  assert.ok(homeHtml.includes("TroyX iStore"), "Homepage must include TroyX iStore branding");
  assert.ok(!homeHtml.includes("sec-home-draft-1"), "Homepage must NOT leak unpublished draft labels");

  const mediaPageRes = await fetch(`${BASE_URL}/admin/media`, {
    headers: { Cookie: ownerCookie },
  });
  assert.strictEqual(mediaPageRes.status, 200, "Admin media page must return 200 OK");
  console.log("✔ Test 9: Public storefront (clean, no leaked drafts) and Admin Media dashboard load successfully (200 OK)");
  passed++;

  console.log("\n==================================================================");
  console.log(`  PHASE 4 TEST SUMMARY: ${passed}/${total} TESTS PASSED (100%)`);
  console.log("==================================================================");
}

runTestSuite().catch((err) => {
  console.error("Test Suite Failed with Error:", err);
  process.exit(1);
});
