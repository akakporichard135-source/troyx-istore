import fs from "fs";
import path from "path";
import admin from "firebase-admin";

const keyPath = "C:\\Users\\akakp\\Downloads\\troyx-istore-firebase-adminsdk-fbsvc-f51aa4b5ba.json";
const cred = JSON.parse(fs.readFileSync(keyPath, "utf-8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(cred),
    projectId: "troyx-istore",
  });
}

const firestore = admin.firestore();
const pagesSnap = await firestore.collection("pages").get();
console.log("Found", pagesSnap.docs.length, "pages in Firestore:");
pagesSnap.docs.forEach((d) => {
  const data = d.data();
  console.log(`- ID: ${d.id} | Slug: ${data.slug} | Title: ${data.title}`);
});

const sectionsSnap = await firestore.collection("sections").get();
console.log("\nFound", sectionsSnap.docs.length, "sections in Firestore:");
sectionsSnap.docs.forEach((d) => {
  const data = d.data();
  console.log(`- ID: ${d.id} | PageId: ${data.pageId} | SectionType: ${data.sectionType} | Label: ${data.draftLabel} | Published: ${data.isPublished}`);
});
