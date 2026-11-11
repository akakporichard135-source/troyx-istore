// TroyX iStore - Private Password Verification Engine
// Tests credentials against Google Identity Toolkit API without exposing them.
// Receives password strictly via stdin pipe.

import fs from "fs";

const FIREBASE_API_KEY = "AIzaSyBUNbaT_ZwYlax2TrsRAYaq2ckOCu74rfo";
const targetEmail = "akakporichard135@gmail.com";
const expectedUid = "07Rwzx6R7iaENCpBWSQZ2Ta0YLX2";

function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => {
      resolve(data.replace(/[\r\n]+$/, ""));
    });
    process.stdin.resume();
  });
}

async function main() {
  let password = await readStdin();
  if (!password) {
    console.error("[ERROR] Empty password input received.");
    process.exit(1);
  }

  console.log("Connecting directly to Google Firebase Identity Toolkit API...");
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: targetEmail,
        password,
        returnSecureToken: true,
      }),
    }
  );

  password = "";

  const data = await res.json();
  if (res.ok && data.localId) {
    console.log("\n==================================================================");
    console.log("[SUCCESS] GOOGLE FIREBASE AUTHENTICATION VERIFIED!");
    console.log(`  - Account:          ${data.email}`);
    console.log(`  - Firebase UID:     ${data.localId} (Matches target: ${data.localId === expectedUid})`);
    console.log(`  - Status:           Active and verified in Firebase Authentication`);
    console.log(`  - ID Token:         [VERIFIED & REDACTED]`);
    console.log("==================================================================\n");
    process.exit(0);
  } else {
    console.error("\n==================================================================");
    console.error("[FAILED] Google Firebase Authentication rejected credentials.");
    console.error(`  - HTTP Status:      ${res.status}`);
    console.error(`  - Firebase Message: ${data.error?.message || "Authentication failed"}`);
    console.error("==================================================================\n");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[ERROR]", err.message);
  process.exit(1);
});
