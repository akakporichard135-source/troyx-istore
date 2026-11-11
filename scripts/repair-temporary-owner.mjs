import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";
import path from "path";

console.log("==================================================================");
console.log("TROYX iSTORE — REPAIR TEMPORARY STORE OWNER AUTHORIZATION");
console.log("==================================================================\n");

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
const auth = getAuth();
const targetEmail = "akakporichard135@gmail.com";

async function repairOwnerRole() {
  console.log(`[Step 1] Repairing Firebase Auth custom claims for: ${targetEmail}...`);
  let authUser;
  try {
    authUser = await auth.getUserByEmail(targetEmail);
  } catch (err) {
    console.error(`❌ User ${targetEmail} not found in Firebase Auth:`, err.message);
    process.exit(1);
  }

  // Set verified owner custom claims in Firebase Auth
  await auth.setCustomUserClaims(authUser.uid, {
    role: "owner",
    temporary: true,
  });

  // Enable account if disabled
  await auth.updateUser(authUser.uid, {
    disabled: false,
    displayName: "TroyX Temporary Store Owner",
  });

  const refreshedAuthUser = await auth.getUser(authUser.uid);
  console.log("  ✔ Firebase Auth updated successfully:");
  console.log("    - UID:", refreshedAuthUser.uid);
  console.log("    - Email:", refreshedAuthUser.email);
  console.log("    - Disabled:", refreshedAuthUser.disabled);
  console.log("    - Custom Claims:", JSON.stringify(refreshedAuthUser.customClaims));

  console.log(`\n[Step 2] Repairing Cloud Firestore user record for: ${targetEmail}...`);
  const snap = await db.collection("users").where("email", "==", targetEmail).get();
  if (snap.empty) {
    console.log("  ℹ Creating new user document in Firestore...");
    await db.collection("users").doc(authUser.uid).set({
      id: authUser.uid,
      email: targetEmail,
      fullName: "TroyX Temporary Store Owner",
      role: "owner",
      isTemporary: true,
      disabled: false,
      isSetupComplete: true,
      customClaims: { role: "owner", temporary: true },
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
  } else {
    for (const doc of snap.docs) {
      console.log(`  Updating Firestore doc: ${doc.id}...`);
      await db.collection("users").doc(doc.id).update({
        role: "owner",
        isTemporary: true,
        disabled: false,
        customClaims: { role: "owner", temporary: true },
        updatedAt: new Date().toISOString(),
      });
    }
  }

  const updatedSnap = await db.collection("users").where("email", "==", targetEmail).get();
  updatedSnap.docs.forEach((doc) => {
    const data = doc.data();
    console.log(`  ✔ Firestore Doc [${doc.id}]:`);
    console.log(`    - Role: ${data.role}`);
    console.log(`    - Disabled: ${data.disabled}`);
    console.log(`    - isTemporary: ${data.isTemporary}`);
    console.log(`    - Custom Claims:`, JSON.stringify(data.customClaims));
  });

  console.log("\n[Step 3] Verifying viewer accounts remain read-only...");
  const viewerSnap = await db.collection("users").where("role", "==", "viewer").get();
  console.log(`  Found ${viewerSnap.docs.length} designated viewer accounts in Firestore.`);
  viewerSnap.docs.forEach((doc) => {
    console.log(`    • Viewer [${doc.id}]: ${doc.data().email} (Role: ${doc.data().role})`);
  });

  console.log("\n==================================================================");
  console.log("TEMPORARY STORE OWNER ROLE REPAIRED: ROLE IS NOW 'owner'");
  console.log("==================================================================");
}

repairOwnerRole().catch(console.error);
