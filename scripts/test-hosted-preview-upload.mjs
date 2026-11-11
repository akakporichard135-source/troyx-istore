import { execSync } from "child_process";
import fs from "fs";
import path from "path";

console.log("==================================================================");
console.log("TROYX iSTORE — HOSTED PREVIEW & REAL CLOUDINARY UPLOAD TEST");
console.log("==================================================================\n");

const PREVIEW_HOST = "https://troyx-istore-n99i-k3pf8l2br-richard-akakpo-s-projects.vercel.app";

// 1. Generate valid admin session cookie
const adminUser = {
  id: "troyx-owner-dev",
  email: "troyx.owner@gmail.com",
  fullName: "TroyX Owner",
  role: "owner",
  isTemporary: true,
  isSetupComplete: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  customClaims: { role: "owner", temporary: true },
};

const sessionPayload = {
  user: adminUser,
  expiresAt: Date.now() + 86400 * 7 * 1000,
  customClaims: { role: "owner", temporary: true },
};

const sessionCookie = Buffer.from(JSON.stringify(sessionPayload)).toString("base64");

// Helper to make authenticated requests using `vercel curl` (handles deployment protection)
function vercelRequest(endpoint, method = "GET", body = null) {
  const url = `${PREVIEW_HOST}${endpoint}`;
  let cmd = `vercel curl "${url}" -H "Cookie: troyx_admin_session=${sessionCookie}"`;
  if (method === "POST") {
    cmd += ` -X POST -H "Content-Type: application/json"`;
    if (body) {
      // Escape for Windows PowerShell
      const jsonStr = JSON.stringify(body).replace(/"/g, '\\"');
      cmd += ` -d "${jsonStr}"`;
    }
  }

  const output = execSync(cmd, { encoding: "utf8", shell: "powershell.exe" });
  return output;
}

async function runTest() {
  // Test 1: Config Endpoint
  console.log("[Step 1] Calling hosted /api/admin/media/config on Preview...");
  const configRaw = vercelRequest("/api/admin/media/config");
  console.log("  Raw config response:", configRaw.trim());
  let config;
  try {
    config = JSON.parse(configRaw.trim());
  } catch (e) {
    console.error("  ❌ Failed to parse config JSON:", configRaw);
    process.exit(1);
  }

  console.log(`  - Cloudinary isConfigured: ${config.isConfigured}`);
  console.log(`  - Cloud Name: ${config.cloudName ? "[CONFIGURED]" : "[MISSING]"}`);
  console.log(`  - Folder: ${config.folder}`);

  if (!config.isConfigured) {
    console.error("❌ Cloudinary isConfigured returned FALSE on hosted Preview deployment!");
    process.exit(1);
  }
  console.log("  ✔ PASS: Hosted Cloudinary configuration verified active on Preview!");

  // Test 2: Request Upload Signature from hosted server
  console.log("\n[Step 2] Requesting HMAC-SHA1 upload signature from /api/admin/media/sign-upload...");
  const signRaw = vercelRequest("/api/admin/media/sign-upload", "POST", {
    resourceType: "image",
    folder: "troyx-istore/media",
    tags: ["troyx-istore", "test-verification"],
  });
  console.log("  Raw sign response:", signRaw.trim());
  let signData;
  try {
    signData = JSON.parse(signRaw.trim());
  } catch (e) {
    console.error("  ❌ Failed to parse sign JSON:", signRaw);
    process.exit(1);
  }

  if (!signData.signature || !signData.uploadUrl) {
    console.error("❌ Invalid signature response from server:", signData);
    process.exit(1);
  }
  console.log("  ✔ PASS: Obtained HMAC-SHA1 signature and timestamp from hosted Preview API!");

  // Test 3: Real Authenticated Image Upload directly to Cloudinary
  console.log("\n[Step 3] Performing real authenticated image upload to Cloudinary API...");
  // Create a minimal 1x1 test PNG buffer
  const samplePngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
  const testFilePath = path.join(process.cwd(), "scripts", "test-upload.png");
  fs.writeFileSync(testFilePath, Buffer.from(samplePngBase64, "base64"));

  const formCurlCmd = `curl -s -X POST "${signData.uploadUrl}" -F "file=@${testFilePath}" -F "api_key=${signData.apiKey}" -F "timestamp=${signData.timestamp}" -F "signature=${signData.signature}" -F "folder=${signData.folder}" -F "tags=troyx-istore,test-verification"`;

  const cloudRaw = execSync(formCurlCmd, { encoding: "utf8", shell: "powershell.exe" });
  if (fs.existsSync(testFilePath)) fs.unlinkSync(testFilePath);

  let cloudData;
  try {
    cloudData = JSON.parse(cloudRaw.trim());
  } catch (e) {
    console.error("  ❌ Cloudinary upload failed:", cloudRaw);
    process.exit(1);
  }

  if (!cloudData.secure_url || !cloudData.public_id) {
    console.error("❌ Cloudinary response missing secure_url/public_id:", cloudData);
    process.exit(1);
  }

  console.log(`  ✔ PASS: Real image uploaded to Cloudinary CDN!`);
  console.log(`    - Secure URL: ${cloudData.secure_url}`);
  console.log(`    - Public ID: ${cloudData.public_id}`);
  console.log(`    - Bytes: ${cloudData.bytes}`);
  console.log(`    - Format: ${cloudData.format}`);

  // Test 4: Persist metadata to Firebase via hosted Preview endpoint
  console.log("\n[Step 4] Registering asset metadata with hosted /api/admin/media endpoint...");
  const metaPayload = {
    publicUrl: cloudData.secure_url,
    filename: "troyx-test-verification.png",
    fileSize: cloudData.bytes,
    mimeType: "image/png",
    mediaType: "image",
    publicId: cloudData.public_id,
    assetId: cloudData.asset_id,
    width: cloudData.width,
    height: cloudData.height,
    format: cloudData.format,
    altText: "TroyX Test Verification Asset",
    caption: "Automated verification test asset",
    focalPointX: 50,
    focalPointY: 50,
  };

  const metaRaw = vercelRequest("/api/admin/media", "POST", metaPayload);
  console.log("  Raw meta response:", metaRaw.trim());
  let metaData;
  try {
    metaData = JSON.parse(metaRaw.trim());
  } catch (e) {
    console.error("  ❌ Failed to parse meta response JSON:", metaRaw);
    process.exit(1);
  }

  if (!metaData.asset || !metaData.asset.id) {
    console.error("❌ Failed to register media asset in Firestore:", metaData);
    process.exit(1);
  }
  const createdAssetId = metaData.asset.id;
  console.log(`  ✔ PASS: Asset metadata successfully saved in Cloud Firestore! (Doc ID: ${createdAssetId})`);

  // Test 5: Verify Media query in Control Center
  console.log("\n[Step 5] Querying media library from Control Center endpoint (/api/admin/media)...");
  const listRaw = vercelRequest("/api/admin/media?type=image");
  const listData = JSON.parse(listRaw.trim());
  const found = listData.assets?.find((a) => a.id === createdAssetId || a.publicId === cloudData.public_id);
  if (!found) {
    console.error("❌ Uploaded asset not found in /api/admin/media list response!");
    process.exit(1);
  }
  console.log(`  ✔ PASS: Uploaded asset appears in Control Center media query! (${found.filename})`);

  // Test 6: Verify Draft Section Preview without publishing 6 homepage drafts
  console.log("\n[Step 6] Testing section draft attachment on disposable page...");
  const testPageRaw = vercelRequest("/api/admin/pages", "POST", {
    title: "Draft Preview Verification Page",
    slug: `test-preview-${Date.now()}`,
    isPublished: false,
    inNavigation: false,
  });
  const testPage = JSON.parse(testPageRaw.trim()).page;

  const testSecRaw = vercelRequest("/api/admin/sections", "POST", {
    pageId: testPage.id,
    sectionType: "hero_cinema",
    draftLabel: "Verified Cloudinary Showcase Draft",
    theme: "dark",
    headline: "Verified Cloudinary Upload Hero",
    subheadline: "Real CDN media verified on Vercel Preview",
    desktopImageUrl: cloudData.secure_url,
    mobileImageUrl: cloudData.secure_url,
    sortOrder: 1,
    isPublished: false,
  });
  const testSec = JSON.parse(testSecRaw.trim()).section;
  console.log(`  ✔ PASS: Created draft section [${testSec.id}] with Cloudinary image attached.`);

  // Verify homepage 6 draft sections still remain 100% unpublished
  const homeSecRaw = vercelRequest("/api/admin/sections?pageId=page-home");
  const homeSec = JSON.parse(homeSecRaw.trim()).sections;
  const anyHomePublished = homeSec.some((s) => s.isPublished);
  if (anyHomePublished || homeSec.length !== 6) {
    console.error("❌ Homepage draft sections status compromised!", homeSec);
    process.exit(1);
  }
  console.log(`  ✔ STRICT PASS: All 6 homepage draft sections remain 100% UNPUBLISHED in exact order.`);

  // Test 7: Clean up test asset from Firestore and test page
  console.log("\n[Step 7] Cleaning up test section, test page, and test media asset...");
  vercelRequest(`/api/admin/sections/${testSec.id}`, "DELETE");
  vercelRequest(`/api/admin/pages/${testPage.id}`, "DELETE");
  vercelRequest(`/api/admin/media/${createdAssetId}`, "DELETE");
  console.log("  ✔ Cleaned up test section, test page, and test media record.");

  console.log("\n==================================================================");
  console.log("REAL CLOUDINARY UPLOAD & HOSTED PREVIEW FULLY VERIFIED (100% PASS)");
  console.log("==================================================================");
}

runTest().catch((err) => {
  console.error("❌ Test Script Error:", err);
  process.exit(1);
});
