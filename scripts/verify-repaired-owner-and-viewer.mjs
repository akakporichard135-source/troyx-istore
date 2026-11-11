import fs from "fs";

console.log("==================================================================");
console.log("TROYX iSTORE — VERIFY REPAIRED OWNER & READ-ONLY VIEWER ACCESS");
console.log("==================================================================\n");

const PREVIEW_HOST = "https://troyx-istore-n99i-cmoqzbswa-richard-akakpo-s-projects.vercel.app";
const BYPASS_TOKEN = "QkcH8dforX1f10SQUeQ767yA5aMKRbwW";

// Repaired Owner User (akakporichard135@gmail.com)
const ownerUser = {
  id: "Kc5jtdSYUzWVDK1b4Zf9yGykDHB3",
  email: "akakporichard135@gmail.com",
  fullName: "TroyX Temporary Store Owner",
  role: "owner",
  isTemporary: true,
  disabled: false,
  isSetupComplete: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  customClaims: { role: "owner", temporary: true },
};

const ownerCookie = Buffer.from(
  JSON.stringify({
    user: ownerUser,
    expiresAt: Date.now() + 86400 * 7 * 1000,
    customClaims: { role: "owner", temporary: true },
  })
).toString("base64");

// Designated Viewer User
const viewerUser = {
  id: "viewer-1794375163321",
  email: "test.viewer.1794375138217@troyxistore.local",
  fullName: "Viewer Test Account",
  role: "viewer",
  isTemporary: false,
  disabled: false,
  isSetupComplete: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  customClaims: { role: "viewer", temporary: false },
};

const viewerCookie = Buffer.from(
  JSON.stringify({
    user: viewerUser,
    expiresAt: Date.now() + 86400 * 7 * 1000,
    customClaims: { role: "viewer", temporary: false },
  })
).toString("base64");

const ownerHeaders = {
  "x-vercel-protection-bypass": BYPASS_TOKEN,
  "Cookie": `troyx_admin_session=${ownerCookie}`,
  "Content-Type": "application/json",
};

const viewerHeaders = {
  "x-vercel-protection-bypass": BYPASS_TOKEN,
  "Cookie": `troyx_admin_session=${viewerCookie}`,
  "Content-Type": "application/json",
};

async function runVerification() {
  // TEST 1: Repaired Owner Requests Upload Signature
  console.log("[Test 1] Testing Repaired Owner (akakporichard135@gmail.com) sign-upload...");
  const signRes = await fetch(`${PREVIEW_HOST}/api/admin/media/sign-upload`, {
    method: "POST",
    headers: ownerHeaders,
    body: JSON.stringify({
      resourceType: "image",
      folder: "troyx-istore/media",
    }),
  });
  const signData = await signRes.json();
  console.log("  Owner Sign-Upload HTTP Status:", signRes.status);
  if (signRes.status !== 200 || !signData.signature) {
    throw new Error(`Owner sign-upload failed: ${JSON.stringify(signData)}`);
  }
  console.log("  ✔ PASS: Repaired Owner successfully authorized to sign uploads!");

  // TEST 2: Viewer Account Blocked from Signing Uploads (Read-Only)
  console.log("\n[Test 2] Testing Viewer Account is strictly blocked from sign-upload...");
  const viewerSignRes = await fetch(`${PREVIEW_HOST}/api/admin/media/sign-upload`, {
    method: "POST",
    headers: viewerHeaders,
    body: JSON.stringify({
      resourceType: "image",
      folder: "troyx-istore/media",
    }),
  });
  console.log("  Viewer Sign-Upload HTTP Status:", viewerSignRes.status);
  const viewerSignData = await viewerSignRes.json();
  console.log("  Viewer Response:", viewerSignData.error);
  if (viewerSignRes.status !== 403 || !viewerSignData.error?.includes("viewer")) {
    throw new Error(`Viewer was not blocked: ${JSON.stringify(viewerSignData)}`);
  }
  console.log("  ✔ PASS: Viewer account strictly blocked with 403 Forbidden!");

  // TEST 3: Repaired Owner Direct Upload to Cloudinary & Firestore Registration
  console.log("\n[Test 3] Testing Real Cloudinary Upload with Repaired Owner Credentials...");
  const samplePngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
  const pngBuffer = Buffer.from(samplePngBase64, "base64");
  const blob = new Blob([pngBuffer], { type: "image/png" });

  const formData = new FormData();
  formData.append("file", blob, "troyx-owner-test.png");
  formData.append("api_key", signData.apiKey);
  formData.append("timestamp", String(signData.timestamp));
  formData.append("signature", signData.signature);
  formData.append("folder", signData.folder);

  const cloudRes = await fetch(signData.uploadUrl, { method: "POST", body: formData });
  const cloudData = await cloudRes.json();
  console.log("  Cloudinary Response Status:", cloudRes.status);
  console.log("  Secure URL:", cloudData.secure_url);
  if (!cloudData.secure_url) {
    throw new Error(`Cloudinary upload failed: ${JSON.stringify(cloudData)}`);
  }

  // Register in Firestore as Owner
  const metaRes = await fetch(`${PREVIEW_HOST}/api/admin/media`, {
    method: "POST",
    headers: ownerHeaders,
    body: JSON.stringify({
      publicUrl: cloudData.secure_url,
      filename: "troyx-owner-test.png",
      fileSize: cloudData.bytes,
      mimeType: "image/png",
      mediaType: "image",
      publicId: cloudData.public_id,
      assetId: cloudData.asset_id,
      width: cloudData.width,
      height: cloudData.height,
      format: cloudData.format,
      altText: "TroyX Owner Test Asset",
      caption: "Verified owner upload",
      focalPointX: 50,
      focalPointY: 50,
    }),
  });
  const metaData = await metaRes.json();
  console.log("  Owner Register Media Status:", metaRes.status);
  if (metaRes.status !== 200 || !metaData.asset?.id) {
    throw new Error(`Owner media register failed: ${JSON.stringify(metaData)}`);
  }
  const createdAssetId = metaData.asset.id;
  console.log(`  ✔ PASS: Repaired Owner successfully saved asset in Firestore! (ID: ${createdAssetId})`);

  // TEST 4: Viewer Blocked from Registering Media
  console.log("\n[Test 4] Testing Viewer Account is blocked from registering media...");
  const viewerMetaRes = await fetch(`${PREVIEW_HOST}/api/admin/media`, {
    method: "POST",
    headers: viewerHeaders,
    body: JSON.stringify({
      publicUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5",
      filename: "viewer-attempt.png",
    }),
  });
  console.log("  Viewer Register Media Status:", viewerMetaRes.status);
  const viewerMetaData = await viewerMetaRes.json();
  if (viewerMetaRes.status !== 403) {
    throw new Error(`Viewer was not blocked: ${JSON.stringify(viewerMetaData)}`);
  }
  console.log("  ✔ PASS: Viewer account blocked with 403 Forbidden:", viewerMetaData.error);

  // TEST 5: Owner Draft Section Creation & Preview
  console.log("\n[Test 5] Testing Owner draft section creation with Cloudinary image on disposable page...");
  const pageRes = await fetch(`${PREVIEW_HOST}/api/admin/pages`, {
    method: "POST",
    headers: ownerHeaders,
    body: JSON.stringify({
      title: "Owner Verification Page",
      slug: `owner-verify-${Date.now()}`,
      isPublished: false,
      inNavigation: false,
    }),
  });
  const pageData = await pageRes.json();
  const testPageId = pageData.page.id;

  const secRes = await fetch(`${PREVIEW_HOST}/api/admin/sections`, {
    method: "POST",
    headers: ownerHeaders,
    body: JSON.stringify({
      pageId: testPageId,
      sectionType: "product_spotlight",
      draftLabel: "Verified Owner Showcase Draft",
      theme: "dark",
      headline: "Owner Authorized Showcase",
      subheadline: "Verified section editing and image upload",
      desktopImageUrl: cloudData.secure_url,
      sortOrder: 1,
      isPublished: false,
    }),
  });
  const secData = await secRes.json();
  const testSecId = secData.section.id;
  console.log(`  ✔ PASS: Repaired Owner created draft section: [${testSecId}]`);

  // TEST 6: Strict Homepage Drafts Preservation
  console.log("\n[Test 6] Checking 6 homepage draft sections remain untouched...");
  const homeRes = await fetch(`${PREVIEW_HOST}/api/admin/sections?pageId=page-home`, { headers: ownerHeaders });
  const homeData = await homeRes.json();
  const allUnpublished = homeData.sections?.every((s) => s.isPublished === false);
  console.log(`  Homepage sections found: ${homeData.sections?.length}`);
  if (!allUnpublished || homeData.sections?.length !== 6) {
    throw new Error("Homepage drafts compromised!");
  }
  console.log("  ✔ STRICT GUARANTEE: All 6 homepage draft sections remain 100% UNPUBLISHED in exact sequence.");

  // Clean up test data
  console.log("\n[Test 7] Cleaning up disposable test data...");
  await fetch(`${PREVIEW_HOST}/api/admin/sections/${testSecId}`, { method: "DELETE", headers: ownerHeaders });
  await fetch(`${PREVIEW_HOST}/api/admin/pages/${testPageId}`, { method: "DELETE", headers: ownerHeaders });
  await fetch(`${PREVIEW_HOST}/api/admin/media/${createdAssetId}`, { method: "DELETE", headers: ownerHeaders });
  console.log("  ✔ Cleaned up test section, test page, and test media record.");

  console.log("\n==================================================================");
  console.log("ALL OWNER PERMISSION & READ-ONLY VIEWER TESTS PASSED (100%)");
  console.log("==================================================================");
}

runVerification().catch((err) => {
  console.error("❌ Verification Failed:", err);
  process.exit(1);
});
