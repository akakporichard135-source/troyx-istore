// TroyX iStore - End-to-End Verification on NEW Vercel Preview Deployment
const NEW_PREVIEW_HOST = "https://troyx-istore-n99i-2dal2ghtn-richard-akakpo-s-projects.vercel.app";
const BYPASS_TOKEN = "QkcH8dforX1f10SQUeQ767yA5aMKRbwW";

async function verifyPreview() {
  console.log("==================================================================");
  console.log("TROYX iSTORE -- TESTING NEW VERCEL PREVIEW DEPLOYMENT");
  console.log("==================================================================");
  console.log(`Preview Host: ${NEW_PREVIEW_HOST}\n`);

  // 1. Test Login Page loads
  console.log("[Test 1] Testing /admin/login page accessibility...");
  const pageRes = await fetch(`${NEW_PREVIEW_HOST}/admin/login`, {
    headers: { "x-vercel-protection-bypass": BYPASS_TOKEN },
  });
  console.log(`  - HTTP Status: ${pageRes.status}`);
  if (pageRes.status !== 200) {
    throw new Error(`Expected 200, got ${pageRes.status}`);
  }
  console.log("  ✔ PASSED: /admin/login page loaded successfully\n");

  // 2. Test Login API with bad credentials (verifies auth endpoint logic)
  console.log("[Test 2] Testing /api/admin/auth with invalid credentials...");
  const badAuthRes = await fetch(`${NEW_PREVIEW_HOST}/api/admin/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-vercel-protection-bypass": BYPASS_TOKEN,
    },
    body: JSON.stringify({
      email: "akakporichard135@gmail.com",
      password: "InvalidTestPassword999!",
    }),
  });
  const badAuthData = await badAuthRes.json();
  console.log(`  - HTTP Status: ${badAuthRes.status} (Expected: 401)`);
  console.log(`  - Response message: ${badAuthData.error}`);
  if (badAuthRes.status !== 401) {
    throw new Error(`Expected 401, got ${badAuthRes.status}`);
  }
  console.log("  ✔ PASSED: Server-side validation active and rejecting invalid credentials\n");

  // 3. Test Deprecated Default Bootstrap Password rejection
  console.log("[Test 3] Testing rejection of deprecated bootstrap password (TroyX@2026!)...");
  const defRes = await fetch(`${NEW_PREVIEW_HOST}/api/admin/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-vercel-protection-bypass": BYPASS_TOKEN,
    },
    body: JSON.stringify({
      email: "akakporichard135@gmail.com",
      password: "TroyX@2026!",
    }),
  });
  const defData = await defRes.json();
  console.log(`  - HTTP Status: ${defRes.status} (Expected: 401)`);
  console.log(`  - Response message: ${defData.error}`);
  if (defRes.status !== 401 || !defData.error?.includes("Default initial passwords have been permanently disabled")) {
    throw new Error("Bootstrap password was not properly blocked!");
  }
  console.log("  ✔ PASSED: Deprecated bootstrap password strictly blocked\n");

  // 4. Test Session Endpoint when unauthenticated
  console.log("[Test 4] Testing GET /api/admin/auth when unauthenticated...");
  const sessRes = await fetch(`${NEW_PREVIEW_HOST}/api/admin/auth`, {
    headers: { "x-vercel-protection-bypass": BYPASS_TOKEN },
  });
  console.log(`  - HTTP Status: ${sessRes.status} (Expected: 401)`);
  if (sessRes.status !== 401) {
    throw new Error(`Expected 401 for unauthorized session check, got ${sessRes.status}`);
  }
  console.log("  ✔ PASSED: Unauthenticated session correctly rejected\n");

  console.log("==================================================================");
  console.log("✔ ALL PREVIEW DEPLOYMENT API TESTS PASSED SUCCESSFULLY!");
  console.log(`Exact Admin URL: ${NEW_PREVIEW_HOST}/admin/login`);
  console.log("==================================================================");

  setTimeout(() => process.exit(0), 100);
}

verifyPreview().catch((err) => {
  console.error("Test failed:", err.message);
  process.exit(1);
});
