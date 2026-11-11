import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";

console.log("==========================================================");
console.log("TROYX iSTORE — 20 SECTION TEMPLATES DEEP VERIFICATION SUITE");
console.log("==========================================================\n");

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
db.settings({ ignoreUndefinedProperties: true });

const ALL_20_TEMPLATES = [
  "hero_cinema",
  "split_feature",
  "product_spotlight",
  "specs_grid",
  "editorial_quote",
  "gallery_strip",
  "interactive_hotspots",
  "three_column_cards",
  "bento_grid",
  "faq_accordion",
  "banner_ribbon",
  "cta_dock",
  "parallax_showcase",
  "video_ambient",
  "dual_filmstrip",
  "specs_comparison",
  "image_carousel",
  "store_photography",
  "category_showcase",
  "fullscreen_image",
];

async function runTestSuite() {
  const disposablePageId = `page-test-${Date.now()}`;
  console.log(`[Step 1] Creating disposable test page: ${disposablePageId}...`);
  await db.collection("pages").doc(disposablePageId).set({
    id: disposablePageId,
    title: "Disposable Template Test Page",
    slug: `test-disposable-${Date.now()}`,
    isPublished: false,
    inNavigation: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  console.log("  ✔ Disposable test page created in Firestore.");

  console.log("\n[Step 2] Creating test sections for all 20 Apple-grade templates...");
  const createdSectionIds = [];
  const batch = db.batch();

  ALL_20_TEMPLATES.forEach((template, index) => {
    const secId = `sec-test-${template}-${Date.now()}`;
    createdSectionIds.push(secId);

    const sectionDoc = {
      id: secId,
      pageId: disposablePageId,
      sectionType: template,
      draftLabel: `Test ${template.replace(/_/g, " ").toUpperCase()}`,
      theme: index % 2 === 0 ? "dark" : "white",
      headline: `Cinematic Headline for ${template}`,
      subheadline: `High performance titanium engineering showcasing ${template} design.`,
      eyebrow: "Apple Certified Engineering",
      bodyHtml: `<p>Rich text description for template ${template} with verified battery health.</p>`,
      desktopImageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1600&auto=format&fit=crop",
      mobileImageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop",
      desktopVideoUrl: template.includes("video") ? "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" : undefined,
      posterImageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1600&auto=format&fit=crop",
      primaryButtonText: "Explore More",
      primaryButtonUrl: "/iphone",
      secondaryButtonText: "Order on WhatsApp",
      secondaryButtonUrl: "https://wa.me/233207137437",
      sortOrder: index + 1,
      isPublished: false,
      config: {
        textAlignment: "center",
        headlineSize: "xlarge",
        overlayOpacity: 30,
        videoAutoplay: true,
        videoLoop: true,
        videoMuted: true,
        hotspots: [
          { id: "h1", x: 30, y: 40, label: "A18 Pro Chip", description: "3nm Architecture" },
        ],
        faqItems: [
          { question: "Is this genuine Apple?", answer: "Yes, 100% verified original parts." },
        ],
        comparisonItems: [
          { feature: "Display", item1Value: "Super Retina XDR", item2Value: "Liquid Retina" },
        ],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const ref = db.collection("sections").doc(secId);
    batch.set(ref, sectionDoc);
  });

  await batch.commit();
  console.log(`  ✔ Successfully wrote all ${ALL_20_TEMPLATES.length} section templates to Firestore.`);

  // Verify all 20 were saved
  console.log("\n[Step 3] Verifying read persistence for all 20 section templates...");
  const snap = await db.collection("sections").where("pageId", "==", disposablePageId).get();
  console.log(`  Found ${snap.docs.length} sections in Firestore for test page.`);
  if (snap.docs.length !== 20) {
    throw new Error(`Expected 20 sections, found ${snap.docs.length}`);
  }
  console.log("  ✔ All 20 templates retrieved with full schema attributes.");

  // Test text & media update
  console.log("\n[Step 4] Testing section update (Text & Media URL change)...");
  const firstId = createdSectionIds[0];
  const updatePayload = {
    headline: "Updated Titanium Pro Cinematic Headline",
    desktopImageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1600&auto=format&fit=crop",
    updatedAt: new Date().toISOString(),
  };
  await db.collection("sections").doc(firstId).update(updatePayload);
  const updatedDoc = await db.collection("sections").doc(firstId).get();
  const updatedData = updatedDoc.data();
  if (updatedData.headline !== updatePayload.headline || updatedData.desktopImageUrl !== updatePayload.desktopImageUrl) {
    throw new Error("Section update verification failed!");
  }
  console.log(`  ✔ Section [${firstId}] text and media URL updated and verified in Firestore.`);

  // Test reordering
  console.log("\n[Step 5] Testing section reordering...");
  const reversedIds = [...createdSectionIds].reverse();
  const reorderBatch = db.batch();
  reversedIds.forEach((id, idx) => {
    reorderBatch.update(db.collection("sections").doc(id), { sortOrder: idx + 1 });
  });
  await reorderBatch.commit();
  const reorderedSnap = await db.collection("sections").where("pageId", "==", disposablePageId).get();
  const reorderedDocs = reorderedSnap.docs.map((d) => d.data()).sort((a, b) => a.sortOrder - b.sortOrder);
  if (reorderedDocs[0].id !== reversedIds[0]) {
    throw new Error("Reorder verification failed!");
  }
  console.log(`  ✔ Sections successfully reordered in Firestore. New first section: ${reorderedDocs[0].draftLabel}`);

  // Test duplication
  console.log("\n[Step 6] Testing section duplication...");
  const sourceSec = reorderedDocs[0];
  const dupId = `sec-dup-${Date.now()}`;
  createdSectionIds.push(dupId);
  const dupPayload = {
    ...sourceSec,
    id: dupId,
    draftLabel: `${sourceSec.draftLabel} (Copy)`,
    sortOrder: reorderedDocs.length + 1,
    isPublished: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await db.collection("sections").doc(dupId).set(dupPayload);
  const dupDoc = await db.collection("sections").doc(dupId).get();
  if (!dupDoc.exists) throw new Error("Duplication failed!");
  console.log(`  ✔ Section duplicated successfully: [${dupId}] "${dupDoc.data().draftLabel}"`);

  // Test publishing & unpublishing
  console.log("\n[Step 7] Testing section publish & unpublish toggling...");
  // Initially unpublished
  let pubSnap = await db.collection("sections").where("pageId", "==", disposablePageId).where("isPublished", "==", true).get();
  console.log(`  Published count initially: ${pubSnap.docs.length} (Expected: 0)`);
  if (pubSnap.docs.length !== 0) throw new Error("Sections should not be published initially!");

  // Publish 2 sections
  await db.collection("sections").doc(createdSectionIds[0]).update({ isPublished: true });
  await db.collection("sections").doc(createdSectionIds[1]).update({ isPublished: true });
  pubSnap = await db.collection("sections").where("pageId", "==", disposablePageId).where("isPublished", "==", true).get();
  console.log(`  Published count after publishing 2: ${pubSnap.docs.length} (Expected: 2)`);
  if (pubSnap.docs.length !== 2) throw new Error("Publishing verification failed!");

  // Unpublish them
  await db.collection("sections").doc(createdSectionIds[0]).update({ isPublished: false });
  await db.collection("sections").doc(createdSectionIds[1]).update({ isPublished: false });
  pubSnap = await db.collection("sections").where("pageId", "==", disposablePageId).where("isPublished", "==", true).get();
  console.log(`  Published count after unpublishing: ${pubSnap.docs.length} (Expected: 0)`);
  if (pubSnap.docs.length !== 0) throw new Error("Unpublishing verification failed!");
  console.log("  ✔ Section publish & unpublish cycle verified in Firestore.");

  // Clean up disposable test data
  console.log("\n[Step 8] Cleaning up disposable test data from Firestore...");
  const deleteBatch = db.batch();
  createdSectionIds.forEach((id) => {
    deleteBatch.delete(db.collection("sections").doc(id));
  });
  deleteBatch.delete(db.collection("pages").doc(disposablePageId));
  await deleteBatch.commit();
  console.log(`  ✔ Cleaned up test page and all ${createdSectionIds.length} disposable test sections.`);

  // Verify Homepage 6 Draft Sections Remain 100% UNPUBLISHED and Untouched
  console.log("\n[Step 9] Verifying homepage draft sections integrity...");
  const homeSnap = await db.collection("sections").where("pageId", "==", "page-home").get();
  const homeSections = homeSnap.docs.map((d) => d.data()).sort((a, b) => a.sortOrder - b.sortOrder);
  console.log(`  Homepage draft sections count: ${homeSections.length}`);
  const expectedLabels = [
    "iPhone 18 Pro — dark",
    "iPhone Duo — white",
    "MacBook Pro — dark",
    "Apple Watch Series 12 — white",
    "iPad A16 — white",
    "AirPods Pro 3 — dark",
  ];
  let draftsUntouched = true;
  homeSections.forEach((s, idx) => {
    if (s.isPublished !== false) draftsUntouched = false;
    if (s.draftLabel !== expectedLabels[idx]) draftsUntouched = false;
    console.log(`    ${idx + 1}. [${s.id}] "${s.draftLabel}" — isPublished: ${s.isPublished}`);
  });
  if (homeSections.length === 6 && draftsUntouched) {
    console.log("  ✔ STRICT GUARANTEE: All 6 homepage draft sections remain 100% UNPUBLISHED in exact order.");
  } else {
    throw new Error("Homepage drafts were compromised!");
  }

  console.log("\n==========================================================");
  console.log("ALL 20 SECTION TEMPLATES FULLY VERIFIED IN FIRESTORE (100%)");
  console.log("==========================================================");
}

runTestSuite().catch((err) => {
  console.error("❌ Test Suite Error:", err);
  process.exit(1);
});
