// TroyX iStore - Hybrid Database & Storage Engine
// Provides high-performance persistence with dual backends:
// 1. Supabase PostgreSQL (when environment variables are configured)
// 2. High-integrity local JSON store (for zero-setup development, automated tests, and offline mode)

import fs from "fs";
import path from "path";
import { isFirebaseAdminConfigured, getAdminFirestore } from "../firebase/admin";
import {
  PageRecord,
  PageSection,
  PageRevision,
  MediaAsset,
  ProductRecord,
  OrderRecord,
  PromotionRecord,
  SiteSettings,
  NavigationConfig,
  FooterColumn,
  AuditLogRecord,
  UserProfile,
} from "../types";
import {
  INITIAL_SITE_SETTINGS,
  INITIAL_USERS,
  INITIAL_PAGES,
  INITIAL_HOMEPAGE_SECTIONS,
  INITIAL_PRODUCTS,
  INITIAL_PROMOTIONS,
  INITIAL_HEADER_NAV,
  INITIAL_FOOTER_COLUMNS,
} from "./initial-data";

interface LocalDatabaseState {
  settings: SiteSettings;
  users: UserProfile[];
  pages: PageRecord[];
  sections: PageSection[];
  revisions: PageRevision[];
  media: MediaAsset[];
  products: ProductRecord[];
  orders: OrderRecord[];
  promotions: PromotionRecord[];
  navigation: NavigationConfig;
  footerColumns: FooterColumn[];
  auditLogs: AuditLogRecord[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "troyx_store.json");

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadLocalDatabase(): LocalDatabaseState {
  try {
    ensureDirectoryExists(DATA_DIR);
    if (!fs.existsSync(DB_FILE)) {
      const initial: LocalDatabaseState = {
        settings: INITIAL_SITE_SETTINGS,
        users: INITIAL_USERS,
        pages: INITIAL_PAGES,
        sections: INITIAL_HOMEPAGE_SECTIONS,
        revisions: [],
        media: [],
        products: INITIAL_PRODUCTS,
        orders: [],
        promotions: INITIAL_PROMOTIONS,
        navigation: INITIAL_HEADER_NAV,
        footerColumns: INITIAL_FOOTER_COLUMNS,
        auditLogs: [
          {
            id: `audit-${Date.now()}`,
            action: "SYSTEM_INITIALIZED",
            entityType: "system",
            details: {
              message: "TroyX iStore platform initialized with 6 unpublished homepage drafts.",
            },
            createdAt: new Date().toISOString(),
          },
        ],
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }

    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error loading local database, falling back to defaults:", err);
    return {
      settings: INITIAL_SITE_SETTINGS,
      users: INITIAL_USERS,
      pages: INITIAL_PAGES,
      sections: INITIAL_HOMEPAGE_SECTIONS,
      revisions: [],
      media: [],
      products: INITIAL_PRODUCTS,
      orders: [],
      promotions: INITIAL_PROMOTIONS,
      navigation: INITIAL_HEADER_NAV,
      footerColumns: INITIAL_FOOTER_COLUMNS,
      auditLogs: [],
    };
  }
}

function saveLocalDatabase(data: LocalDatabaseState) {
  try {
    ensureDirectoryExists(DATA_DIR);
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to local database:", err);
  }
}

// Check if live Supabase is configured
export function isSupabaseConfigured(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.SUPABASE_SERVICE_ROLE_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project")
  );
}

// Check if dedicated Firebase is configured
export function isFirebaseConfigured(): boolean {
  return isFirebaseAdminConfigured();
}

/**
 * Returns true if Firebase mode is explicitly selected.
 * When Firebase mode is selected, silent fallback to local JSON is STRICTLY DISABLED.
 */
export function isFirebaseMode(): boolean {
  return (
    process.env.DATA_STORE_MODE === "firebase" ||
    process.env.REQUIRE_FIREBASE === "true" ||
    Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_KEY) ||
    Boolean(process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) ||
    Boolean(process.env.FIRESTORE_EMULATOR_HOST)
  );
}

function getRequiredFirestore() {
  const firestore = getAdminFirestore();
  if (!firestore) {
    throw new Error(
      "[Cloud Firestore Engine] Firebase mode is selected, but Firebase Admin credentials are not configured or valid. Silent fallback to local JSON is disabled."
    );
  }
  return firestore;
}

// Users & Security
export async function getUsers(): Promise<UserProfile[]> {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const snap = await firestore.collection("users").get();
    return snap.docs.map((d) => d.data() as UserProfile);
  }
  const db = loadLocalDatabase();
  return db.users;
}

export async function getUserByEmail(email: string): Promise<UserProfile | null> {
  const normalized = email.trim().toLowerCase();
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const snap = await firestore
      .collection("users")
      .where("email", "==", normalized)
      .limit(1)
      .get();
    if (!snap.empty) {
      const doc = snap.docs[0];
      const data = doc.data() as UserProfile;
      return { ...data, id: data.id || doc.id };
    }
  }
  const db = loadLocalDatabase();
  return (
    db.users.find((u) => u.email.toLowerCase() === normalized) || null
  );
}

export async function getUserById(id: string): Promise<UserProfile | null> {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const doc = await firestore.collection("users").doc(id).get();
    if (doc.exists) {
      return doc.data() as UserProfile;
    }
  }
  const db = loadLocalDatabase();
  return db.users.find((u) => u.id === id) || null;
}

export async function createOrUpdateUser(user: UserProfile): Promise<UserProfile> {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    await firestore.collection("users").doc(user.id).set(user, { merge: true });
  }
  const db = loadLocalDatabase();
  const idx = db.users.findIndex(
    (u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase()
  );
  if (idx !== -1) {
    db.users[idx] = { ...db.users[idx], ...user };
  } else {
    db.users.push(user);
  }
  saveLocalDatabase(db);
  return user;
}

export async function updateUserPassword(
  userId: string,
  passwordHash: string,
  passwordSalt: string
): Promise<boolean> {
  const now = new Date().toISOString();
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const ref = firestore.collection("users").doc(userId);
    const doc = await ref.get();
    if (doc.exists) {
      await ref.update({
        passwordHash,
        passwordSalt,
        isSetupComplete: true,
        updatedAt: now,
      });
      await recordAuditLog({
        userId,
        action: "UPDATE_STAFF_PASSWORD",
        entityType: "user",
        entityId: userId,
        details: { email: (doc.data() as any).email },
      });
      return true;
    }
  }

  const db = loadLocalDatabase();
  const index = db.users.findIndex((u) => u.id === userId);
  if (index === -1) return false;

  db.users[index].passwordHash = passwordHash;
  db.users[index].passwordSalt = passwordSalt;
  db.users[index].isSetupComplete = true;
  db.users[index].updatedAt = now;

  saveLocalDatabase(db);
  await recordAuditLog({
    userId,
    action: "UPDATE_STAFF_PASSWORD",
    entityType: "user",
    entityId: userId,
    details: { email: db.users[index].email },
  });
  return true;
}

// Site Settings
export async function getSiteSettings(): Promise<SiteSettings> {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const doc = await firestore.collection("settings").doc("site").get();
    if (doc.exists) {
      return doc.data() as SiteSettings;
    }
  }

  const db = loadLocalDatabase();
  return db.settings;
}

export async function updateSiteSettings(
  partial: Partial<SiteSettings>,
  userId?: string
): Promise<SiteSettings> {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const docRef = firestore.collection("settings").doc("site");
    const snap = await docRef.get();
    const current = snap.exists ? (snap.data() as SiteSettings) : INITIAL_SITE_SETTINGS;
    const updated: SiteSettings = {
      ...current,
      ...partial,
      updatedAt: new Date().toISOString(),
    };
    await docRef.set(cleanFirestoreData(updated), { merge: true });
    await recordAuditLog({
      userId,
      action: "UPDATE_SITE_SETTINGS",
      entityType: "settings",
      details: partial,
    });
    return updated;
  }

  const db = loadLocalDatabase();
  db.settings = { ...db.settings, ...partial, updatedAt: new Date().toISOString() };
  saveLocalDatabase(db);
  await recordAuditLog({
    userId,
    action: "UPDATE_SITE_SETTINGS",
    entityType: "settings",
    details: partial,
  });
  return db.settings;
}

// Pages
export async function getPages(): Promise<PageRecord[]> {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const snap = await firestore.collection("pages").get();
    return snap.docs
      .map((d) => ({ id: d.id, ...(d.data() as any) }))
      .sort((a, b) => (a.navigationOrder ?? 0) - (b.navigationOrder ?? 0));
  }

  const db = loadLocalDatabase();
  return db.pages.sort((a, b) => a.navigationOrder - b.navigationOrder);
}

export async function getPageBySlug(slug: string): Promise<PageRecord | null> {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const snap = await firestore.collection("pages").where("slug", "==", slug).limit(1).get();
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...(snap.docs[0].data() as any) };
  }

  const db = loadLocalDatabase();
  return db.pages.find((p) => p.slug === slug) || null;
}

export async function getPageById(id: string): Promise<PageRecord | null> {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const doc = await firestore.collection("pages").doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...(doc.data() as any) };
  }

  const db = loadLocalDatabase();
  return db.pages.find((p) => p.id === id) || null;
}

export async function createPage(
  data: Omit<PageRecord, "id" | "createdAt" | "updatedAt">,
  userId?: string
): Promise<PageRecord> {
  const newPage: PageRecord = {
    ...data,
    id: `page-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    await firestore.collection("pages").doc(newPage.id).set(cleanFirestoreData(newPage));
    await recordAuditLog({
      userId,
      action: "CREATE_PAGE",
      entityType: "page",
      entityId: newPage.id,
      details: { title: newPage.title, slug: newPage.slug },
    });
    return newPage;
  }

  const db = loadLocalDatabase();
  db.pages.push(newPage);
  saveLocalDatabase(db);
  await recordAuditLog({
    userId,
    action: "CREATE_PAGE",
    entityType: "page",
    entityId: newPage.id,
    details: { title: newPage.title, slug: newPage.slug },
  });
  return newPage;
}

export async function updatePage(
  id: string,
  data: Partial<PageRecord>,
  userId?: string
): Promise<PageRecord | null> {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const docRef = firestore.collection("pages").doc(id);
    const snap = await docRef.get();
    if (!snap.exists) return null;
    const updated = {
      ...(snap.data() as PageRecord),
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await docRef.set(cleanFirestoreData(updated), { merge: true });
    await recordAuditLog({
      userId,
      action: "UPDATE_PAGE",
      entityType: "page",
      entityId: id,
      details: data,
    });
    return updated;
  }

  const db = loadLocalDatabase();
  const index = db.pages.findIndex((p) => p.id === id);
  if (index === -1) return null;

  db.pages[index] = {
    ...db.pages[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  saveLocalDatabase(db);
  await recordAuditLog({
    userId,
    action: "UPDATE_PAGE",
    entityType: "page",
    entityId: id,
    details: data,
  });
  return db.pages[index];
}

export async function deletePage(id: string, userId?: string): Promise<boolean> {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const pageDoc = await firestore.collection("pages").doc(id).get();
    if (!pageDoc.exists) return false;
    const pageData = pageDoc.data() as PageRecord;
    if (pageData.slug === "home") return false;

    await firestore.collection("pages").doc(id).delete();
    const secSnap = await firestore.collection("sections").where("pageId", "==", id).get();
    const batch = firestore.batch();
    secSnap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();

    await recordAuditLog({
      userId,
      action: "DELETE_PAGE",
      entityType: "page",
      entityId: id,
      details: { slug: pageData.slug },
    });
    return true;
  }

  const db = loadLocalDatabase();
  const page = db.pages.find((p) => p.id === id);
  if (!page) return false;
  // Disallow deleting home page
  if (page.slug === "home") return false;

  db.pages = db.pages.filter((p) => p.id !== id);
  db.sections = db.sections.filter((s) => s.pageId !== id);
  saveLocalDatabase(db);
  await recordAuditLog({
    userId,
    action: "DELETE_PAGE",
    entityType: "page",
    entityId: id,
    details: { slug: page.slug },
  });
  return true;
}

// Page Sections
export async function getPageSections(pageId: string): Promise<PageSection[]> {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const snap = await firestore
      .collection("sections")
      .where("pageId", "==", pageId)
      .get();
    return snap.docs
      .map((d) => d.data() as PageSection)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }

  const db = loadLocalDatabase();
  return db.sections
    .filter((s) => s.pageId === pageId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getPublishedSections(pageId: string): Promise<PageSection[]> {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const snap = await firestore
      .collection("sections")
      .where("pageId", "==", pageId)
      .where("isPublished", "==", true)
      .get();
    return snap.docs
      .map((d) => d.data() as PageSection)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }

  const db = loadLocalDatabase();
  return db.sections
    .filter((s) => s.pageId === pageId && s.isPublished)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getSectionById(id: string): Promise<PageSection | null> {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const doc = await firestore.collection("sections").doc(id).get();
    if (doc.exists) {
      return doc.data() as PageSection;
    }
  }
  const db = loadLocalDatabase();
  return db.sections.find((s) => s.id === id) || null;
}

export async function getAllSections(): Promise<PageSection[]> {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const snap = await firestore.collection("sections").get();
    const list = snap.docs.map((d) => d.data() as PageSection);
    return list.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }
  const db = loadLocalDatabase();
  return [...db.sections];
}

export async function createSection(
  data: Omit<PageSection, "id" | "createdAt" | "updatedAt">,
  userId?: string
): Promise<PageSection> {
  const newSection: PageSection = {
    ...data,
    id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    await firestore.collection("sections").doc(newSection.id).set(newSection);
  }

  const db = loadLocalDatabase();
  db.sections.push(newSection);
  saveLocalDatabase(db);

  await recordAuditLog({
    userId,
    action: "CREATE_SECTION",
    entityType: "section",
    entityId: newSection.id,
    details: { draftLabel: newSection.draftLabel, pageId: newSection.pageId },
  });
  return newSection;
}

export async function updateSection(
  id: string,
  data: Partial<PageSection>,
  userId?: string
): Promise<PageSection | null> {
  const now = new Date().toISOString();

  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const ref = firestore.collection("sections").doc(id);
    const doc = await ref.get();
    if (doc.exists) {
      const cleanData: any = { ...data, updatedAt: now };
      Object.keys(cleanData).forEach((k) => cleanData[k] === undefined && delete cleanData[k]);
      await ref.update(cleanData);
      const updatedSnap = await ref.get();

      // Keep local mirror in sync
      const db = loadLocalDatabase();
      const localIdx = db.sections.findIndex((s) => s.id === id);
      if (localIdx !== -1) {
        db.sections[localIdx] = { ...db.sections[localIdx], ...cleanData };
        saveLocalDatabase(db);
      }

      await recordAuditLog({
        userId,
        action: "UPDATE_SECTION",
        entityType: "section",
        entityId: id,
        details: data,
      });
      return updatedSnap.data() as PageSection;
    }
  }

  const db = loadLocalDatabase();
  const index = db.sections.findIndex((s) => s.id === id);
  if (index === -1) return null;

  db.sections[index] = {
    ...db.sections[index],
    ...data,
    updatedAt: now,
  };
  saveLocalDatabase(db);
  await recordAuditLog({
    userId,
    action: "UPDATE_SECTION",
    entityType: "section",
    entityId: id,
    details: data,
  });
  return db.sections[index];
}

export async function deleteSection(id: string, userId?: string): Promise<boolean> {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const ref = firestore.collection("sections").doc(id);
    const doc = await ref.get();
    if (doc.exists) {
      const sec = doc.data() as PageSection;
      await ref.delete();

      const db = loadLocalDatabase();
      db.sections = db.sections.filter((s) => s.id !== id);
      saveLocalDatabase(db);

      await recordAuditLog({
        userId,
        action: "DELETE_SECTION",
        entityType: "section",
        entityId: id,
        details: { draftLabel: sec.draftLabel, pageId: sec.pageId },
      });
      return true;
    }
  }

  const db = loadLocalDatabase();
  const sec = db.sections.find((s) => s.id === id);
  if (!sec) return false;

  db.sections = db.sections.filter((s) => s.id !== id);
  saveLocalDatabase(db);
  await recordAuditLog({
    userId,
    action: "DELETE_SECTION",
    entityType: "section",
    entityId: id,
    details: { draftLabel: sec.draftLabel, pageId: sec.pageId },
  });
  return true;
}

export async function reorderSections(
  sectionIds: string[],
  pageId: string,
  userId?: string
): Promise<PageSection[]> {
  const now = new Date().toISOString();
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const batch = firestore.batch();
    sectionIds.forEach((id, index) => {
      const ref = firestore.collection("sections").doc(id);
      batch.update(ref, { sortOrder: index + 1, updatedAt: now });
    });
    await batch.commit();

    const db = loadLocalDatabase();
    sectionIds.forEach((id, index) => {
      const section = db.sections.find((s) => s.id === id && s.pageId === pageId);
      if (section) {
        section.sortOrder = index + 1;
        section.updatedAt = now;
      }
    });
    saveLocalDatabase(db);

    await recordAuditLog({
      userId,
      action: "REORDER_SECTIONS",
      entityType: "page",
      entityId: pageId,
      details: { order: sectionIds },
    });
    return getPageSections(pageId);
  }

  const db = loadLocalDatabase();
  sectionIds.forEach((id, index) => {
    const section = db.sections.find((s) => s.id === id && s.pageId === pageId);
    if (section) {
      section.sortOrder = index + 1;
      section.updatedAt = now;
    }
  });
  saveLocalDatabase(db);
  await recordAuditLog({
    userId,
    action: "REORDER_SECTIONS",
    entityType: "page",
    entityId: pageId,
    details: { order: sectionIds },
  });
  return db.sections
    .filter((s) => s.pageId === pageId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

// Revisions & Version Control
export async function createPageRevision(
  pageId: string,
  notes?: string,
  userId?: string
): Promise<PageRevision | null> {
  const page = await getPageById(pageId);
  if (!page) return null;

  const sections = await getPageSections(pageId);

  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const existingSnap = await firestore
      .collection("revisions")
      .where("pageId", "==", pageId)
      .get();
    const versionNumber = existingSnap.docs.length + 1;

    const revision: PageRevision = {
      id: `rev-${pageId}-v${versionNumber}-${Date.now()}`,
      pageId,
      versionNumber,
      title: page.title,
      slug: page.slug,
      contentSnapshot: {
        page: JSON.parse(JSON.stringify(page)),
        sections: JSON.parse(JSON.stringify(sections)),
      },
      revisionNotes: notes || `Revision snapshot v${versionNumber}`,
      createdBy: userId || "admin",
      createdAt: new Date().toISOString(),
    };

    await firestore.collection("revisions").doc(revision.id).set(cleanFirestoreData(revision));
    await recordAuditLog({
      userId,
      action: "CREATE_REVISION",
      entityType: "page_revision",
      entityId: revision.id,
      details: { versionNumber, pageId },
    });
    return revision;
  }

  const db = loadLocalDatabase();
  const existingRevisions = db.revisions.filter((r) => r.pageId === pageId);
  const versionNumber = existingRevisions.length + 1;

  const revision: PageRevision = {
    id: `rev-${pageId}-v${versionNumber}-${Date.now()}`,
    pageId,
    versionNumber,
    title: page.title,
    slug: page.slug,
    contentSnapshot: {
      page: JSON.parse(JSON.stringify(page)),
      sections: JSON.parse(JSON.stringify(sections)),
    },
    revisionNotes: notes || `Revision snapshot v${versionNumber}`,
    createdBy: userId || "admin",
    createdAt: new Date().toISOString(),
  };

  db.revisions.push(revision);
  saveLocalDatabase(db);
  await recordAuditLog({
    userId,
    action: "CREATE_REVISION",
    entityType: "page_revision",
    entityId: revision.id,
    details: { versionNumber, pageId },
  });
  return revision;
}

export async function getPageRevisions(pageId: string): Promise<PageRevision[]> {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const snap = await firestore
      .collection("revisions")
      .where("pageId", "==", pageId)
      .get();
    return snap.docs
      .map((d) => ({ id: d.id, ...(d.data() as any) }))
      .sort((a, b) => (b.versionNumber ?? 0) - (a.versionNumber ?? 0));
  }

  const db = loadLocalDatabase();
  return db.revisions
    .filter((r) => r.pageId === pageId)
    .sort((a, b) => b.versionNumber - a.versionNumber);
}

export async function rollbackPageRevision(
  revisionId: string,
  userId?: string
): Promise<boolean> {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const revDoc = await firestore.collection("revisions").doc(revisionId).get();
    if (!revDoc.exists) return false;
    const revision = revDoc.data() as PageRevision;
    const { page, sections } = revision.contentSnapshot;

    // Restore page
    await firestore.collection("pages").doc(page.id).set(cleanFirestoreData(page), { merge: true });

    // Delete current sections
    const currentSecSnap = await firestore
      .collection("sections")
      .where("pageId", "==", page.id)
      .get();
    const batch = firestore.batch();
    currentSecSnap.docs.forEach((d) => batch.delete(d.ref));

    // Restore snapshotted sections
    sections.forEach((sec) => {
      const ref = firestore.collection("sections").doc(sec.id);
      batch.set(ref, cleanFirestoreData(sec));
    });
    await batch.commit();

    await recordAuditLog({
      userId,
      action: "ROLLBACK_REVISION",
      entityType: "page_revision",
      entityId: revisionId,
      details: { pageId: page.id, versionNumber: revision.versionNumber },
    });
    return true;
  }

  const db = loadLocalDatabase();
  const revision = db.revisions.find((r) => r.id === revisionId);
  if (!revision) return false;

  const pageId = revision.pageId;
  const pageIndex = db.pages.findIndex((p) => p.id === pageId);
  if (pageIndex === -1) return false;

  // Restore page properties
  db.pages[pageIndex] = {
    ...revision.contentSnapshot.page,
    updatedAt: new Date().toISOString(),
  };

  // Restore sections
  db.sections = db.sections.filter((s) => s.pageId !== pageId);
  revision.contentSnapshot.sections.forEach((sec) => {
    db.sections.push({
      ...sec,
      updatedAt: new Date().toISOString(),
    });
  });

  saveLocalDatabase(db);
  await recordAuditLog({
    userId,
    action: "ROLLBACK_REVISION",
    entityType: "page_revision",
    entityId: revisionId,
    details: { pageId, versionNumber: revision.versionNumber },
  });
  return true;
}

// Media Assets
export async function getMediaAssets(filter?: {
  mediaType?: "image" | "video";
  search?: string;
}): Promise<MediaAsset[]> {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    let query: any = firestore.collection("media");
    if (filter?.mediaType) {
      query = query.where("mediaType", "==", filter.mediaType);
    }
    const snap = await query.get();
    let items = snap.docs.map((d: any) => d.data() as MediaAsset);

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      items = items.filter(
        (m: MediaAsset) =>
          m.filename.toLowerCase().includes(q) ||
          (m.altText && m.altText.toLowerCase().includes(q)) ||
          (m.caption && m.caption.toLowerCase().includes(q))
      );
    }

    return items.sort((a: MediaAsset, b: MediaAsset) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const db = loadLocalDatabase();
  let items = [...db.media];

  if (filter?.mediaType) {
    items = items.filter((m) => m.mediaType === filter.mediaType);
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    items = items.filter(
      (m) =>
        m.filename.toLowerCase().includes(q) ||
        (m.altText && m.altText.toLowerCase().includes(q)) ||
        (m.caption && m.caption.toLowerCase().includes(q))
    );
  }

  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getMediaAssetById(id: string): Promise<MediaAsset | null> {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const doc = await firestore.collection("media").doc(id).get();
    if (!doc.exists) return null;
    return doc.data() as MediaAsset;
  }
  const db = loadLocalDatabase();
  return db.media.find((m) => m.id === id) || null;
}

function cleanFirestoreData<T extends Record<string, any>>(obj: T): T {
  const clean: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      clean[key] = value;
    }
  }
  return clean as T;
}

export async function createMediaAsset(
  data: Omit<MediaAsset, "id" | "createdAt" | "updatedAt"> & { id?: string; createdAt?: string; updatedAt?: string },
  userId?: string
): Promise<MediaAsset> {
  const newAsset: MediaAsset = {
    ...data,
    id: data.id || `media-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    usageCount: data.usageCount ?? 0,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
  };

  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    await firestore.collection("media").doc(newAsset.id).set(cleanFirestoreData(newAsset));

    const db = loadLocalDatabase();
    db.media.push(newAsset);
    saveLocalDatabase(db);

    await recordAuditLog({
      userId,
      action: "UPLOAD_MEDIA",
      entityType: "media",
      entityId: newAsset.id,
      details: { filename: newAsset.filename, type: newAsset.mediaType, provider: newAsset.provider },
    });
    return newAsset;
  }

  const db = loadLocalDatabase();
  db.media.push(newAsset);
  saveLocalDatabase(db);
  await recordAuditLog({
    userId,
    action: "UPLOAD_MEDIA",
    entityType: "media",
    entityId: newAsset.id,
    details: { filename: newAsset.filename, type: newAsset.mediaType },
  });
  return newAsset;
}

export async function updateMediaAsset(
  id: string,
  data: Partial<MediaAsset>,
  userId?: string
): Promise<MediaAsset | null> {
  const now = new Date().toISOString();

  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const ref = firestore.collection("media").doc(id);
    const doc = await ref.get();
    if (!doc.exists) return null;
    const updated = { ...doc.data(), ...data, updatedAt: now } as MediaAsset;
    await ref.update(cleanFirestoreData({ ...data, updatedAt: now }));

    const db = loadLocalDatabase();
    const index = db.media.findIndex((m) => m.id === id);
    if (index !== -1) {
      db.media[index] = updated;
      saveLocalDatabase(db);
    }

    await recordAuditLog({
      userId,
      action: "UPDATE_MEDIA",
      entityType: "media",
      entityId: id,
      details: data,
    });
    return updated;
  }

  const db = loadLocalDatabase();
  const index = db.media.findIndex((m) => m.id === id);
  if (index === -1) return null;

  db.media[index] = {
    ...db.media[index],
    ...data,
    updatedAt: now,
  };
  saveLocalDatabase(db);
  await recordAuditLog({
    userId,
    action: "UPDATE_MEDIA",
    entityType: "media",
    entityId: id,
    details: data,
  });
  return db.media[index];
}

export async function deleteMediaAsset(id: string, userId?: string): Promise<boolean> {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const ref = firestore.collection("media").doc(id);
    const doc = await ref.get();
    if (!doc.exists) return false;
    const asset = doc.data() as MediaAsset;
    await ref.delete();

    const db = loadLocalDatabase();
    db.media = db.media.filter((m) => m.id !== id);
    saveLocalDatabase(db);

    await recordAuditLog({
      userId,
      action: "DELETE_MEDIA",
      entityType: "media",
      entityId: id,
      details: { filename: asset.filename, publicId: asset.publicId },
    });
    return true;
  }

  const db = loadLocalDatabase();
  const asset = db.media.find((m) => m.id === id);
  if (!asset) return false;

  db.media = db.media.filter((m) => m.id !== id);
  saveLocalDatabase(db);
  await recordAuditLog({
    userId,
    action: "DELETE_MEDIA",
    entityType: "media",
    entityId: id,
    details: { filename: asset.filename },
  });
  return true;
}

export async function checkMediaAssetUsage(publicUrl: string): Promise<{
  inUse: boolean;
  references: Array<{ type: "section" | "product"; label: string }>;
}> {
  const [sections, products] = await Promise.all([
    getAllSections(),
    getProducts(),
  ]);

  const references: Array<{ type: "section" | "product"; label: string }> = [];

  sections.forEach((s) => {
    if (
      s.desktopImageUrl === publicUrl ||
      s.mobileImageUrl === publicUrl ||
      s.desktopVideoUrl === publicUrl ||
      s.mobileVideoUrl === publicUrl ||
      s.posterImageUrl === publicUrl
    ) {
      references.push({
        type: "section",
        label: `Section: ${s.draftLabel || s.id} (Page: ${s.pageId})`,
      });
    }
  });

  products.forEach((p) => {
    if (
      p.images?.includes(publicUrl) ||
      p.variants?.some((v) => v.imageUrl === publicUrl)
    ) {
      references.push({
        type: "product",
        label: `Product: ${p.name}`,
      });
    }
  });

  return {
    inUse: references.length > 0,
    references,
  };
}

// Products Catalog
export async function getProducts(options?: {
  category?: string;
  isPublished?: boolean;
}): Promise<ProductRecord[]> {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    let query: any = firestore.collection("products");
    if (options?.category) {
      query = query.where("category", "==", options.category);
    }
    if (options?.isPublished !== undefined) {
      query = query.where("isPublished", "==", options.isPublished);
    }
    const snap = await query.get();
    const list = snap.docs.map((d: any) => d.data() as ProductRecord);
    return list.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const db = loadLocalDatabase();
  let list = [...db.products];
  if (options?.category) {
    list = list.filter((p) => p.category === options.category);
  }
  if (options?.isPublished !== undefined) {
    list = list.filter((p) => p.isPublished === options.isPublished);
  }
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getProductBySlug(slug: string): Promise<ProductRecord | null> {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const snap = await firestore
      .collection("products")
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (!snap.empty) {
      return snap.docs[0].data() as ProductRecord;
    }
    return null;
  }
  const db = loadLocalDatabase();
  return db.products.find((p) => p.slug === slug) || null;
}

export async function getProductById(id: string): Promise<ProductRecord | null> {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const doc = await firestore.collection("products").doc(id).get();
    if (doc.exists) {
      return doc.data() as ProductRecord;
    }
    return null;
  }
  const db = loadLocalDatabase();
  return db.products.find((p) => p.id === id) || null;
}

export async function createProduct(
  data: Omit<ProductRecord, "id" | "createdAt" | "updatedAt">,
  userId?: string
): Promise<ProductRecord> {
  const newProduct: ProductRecord = {
    ...data,
    id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    await firestore.collection("products").doc(newProduct.id).set(cleanFirestoreData(newProduct));

    const db = loadLocalDatabase();
    db.products.push(newProduct);
    saveLocalDatabase(db);

    await recordAuditLog({
      userId,
      action: "CREATE_PRODUCT",
      entityType: "product",
      entityId: newProduct.id,
      details: { name: newProduct.name, sku: newProduct.sku, basePrice: newProduct.basePrice },
    });
    return newProduct;
  }

  const db = loadLocalDatabase();
  db.products.push(newProduct);
  saveLocalDatabase(db);
  await recordAuditLog({
    userId,
    action: "CREATE_PRODUCT",
    entityType: "product",
    entityId: newProduct.id,
    details: { name: newProduct.name, sku: newProduct.sku, basePrice: newProduct.basePrice },
  });
  return newProduct;
}

export async function updateProduct(
  id: string,
  data: Partial<ProductRecord>,
  userId?: string
): Promise<ProductRecord | null> {
  const now = new Date().toISOString();

  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const ref = firestore.collection("products").doc(id);
    const doc = await ref.get();
    if (!doc.exists) return null;
    const updated = {
      ...(doc.data() as ProductRecord),
      ...data,
      updatedAt: now,
    };
    await ref.set(cleanFirestoreData(updated), { merge: true });

    const db = loadLocalDatabase();
    const index = db.products.findIndex((p) => p.id === id);
    if (index !== -1) {
      db.products[index] = updated;
      saveLocalDatabase(db);
    }

    await recordAuditLog({
      userId,
      action: "UPDATE_PRODUCT",
      entityType: "product",
      entityId: id,
      details: data,
    });
    return updated;
  }

  const db = loadLocalDatabase();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  db.products[index] = {
    ...db.products[index],
    ...data,
    updatedAt: now,
  };
  saveLocalDatabase(db);
  await recordAuditLog({
    userId,
    action: "UPDATE_PRODUCT",
    entityType: "product",
    entityId: id,
    details: data,
  });
  return db.products[index];
}

export async function deleteProduct(id: string, userId?: string): Promise<boolean> {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const ref = firestore.collection("products").doc(id);
    const doc = await ref.get();
    if (!doc.exists) return false;
    const prod = doc.data() as ProductRecord;
    await ref.delete();

    const db = loadLocalDatabase();
    db.products = db.products.filter((p) => p.id !== id);
    saveLocalDatabase(db);

    await recordAuditLog({
      userId,
      action: "DELETE_PRODUCT",
      entityType: "product",
      entityId: id,
      details: { name: prod.name, sku: prod.sku },
    });
    return true;
  }

  const db = loadLocalDatabase();
  const prod = db.products.find((p) => p.id === id);
  if (!prod) return false;

  db.products = db.products.filter((p) => p.id !== id);
  saveLocalDatabase(db);
  await recordAuditLog({
    userId,
    action: "DELETE_PRODUCT",
    entityType: "product",
    entityId: id,
    details: { name: prod.name, sku: prod.sku },
  });
  return true;
}

export async function bulkUpdateProductPrices(
  updates: Array<{ id: string; basePrice: number; discountPrice?: number | null }>,
  userId?: string
): Promise<number> {
  const now = new Date().toISOString();

  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const batch = firestore.batch();
    let count = 0;
    updates.forEach((item) => {
      if (item.basePrice > 0) {
        const ref = firestore.collection("products").doc(item.id);
        const updatePayload: any = { basePrice: item.basePrice, updatedAt: now };
        if (item.discountPrice !== undefined) {
          updatePayload.discountPrice = item.discountPrice;
        }
        batch.set(ref, updatePayload, { merge: true });
        count++;
      }
    });
    if (count > 0) {
      await batch.commit();
    }

    const db = loadLocalDatabase();
    updates.forEach((item) => {
      const prod = db.products.find((p) => p.id === item.id);
      if (prod && item.basePrice > 0) {
        prod.basePrice = item.basePrice;
        if (item.discountPrice !== undefined) {
          prod.discountPrice = item.discountPrice;
        }
        prod.updatedAt = now;
      }
    });
    saveLocalDatabase(db);

    await recordAuditLog({
      userId,
      action: "BULK_UPDATE_PRICES",
      entityType: "product",
      details: { count, updates },
    });
    return count;
  }

  const db = loadLocalDatabase();
  let updatedCount = 0;

  updates.forEach((item) => {
    const prod = db.products.find((p) => p.id === item.id);
    if (prod && item.basePrice > 0) {
      prod.basePrice = item.basePrice;
      if (item.discountPrice !== undefined) {
        prod.discountPrice = item.discountPrice;
      }
      prod.updatedAt = new Date().toISOString();
      updatedCount++;
    }
  });

  saveLocalDatabase(db);
  await recordAuditLog({
    userId,
    action: "BULK_UPDATE_PRICES",
    entityType: "product",
    details: { count: updatedCount, updates },
  });
  return updatedCount;
}

// Orders & Checkout
export async function getOrders(): Promise<OrderRecord[]> {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const snap = await firestore.collection("orders").get();
    return snap.docs
      .map((d) => d.data() as OrderRecord)
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
  const db = loadLocalDatabase();
  return db.orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getOrderById(id: string): Promise<OrderRecord | null> {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const doc = await firestore.collection("orders").doc(id).get();
    if (doc.exists) return doc.data() as OrderRecord;
    return null;
  }
  const db = loadLocalDatabase();
  return db.orders.find((o) => o.id === id) || null;
}

export async function createOrder(
  data: Omit<OrderRecord, "id" | "orderNumber" | "createdAt" | "updatedAt">
): Promise<OrderRecord> {
  const now = new Date().toISOString();
  const orderNumber = `TX-${Date.now().toString().slice(-6)}`;
  const newOrder: OrderRecord = {
    ...data,
    id: `order-${Date.now()}`,
    orderNumber,
    createdAt: now,
    updatedAt: now,
  };

  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    await firestore.collection("orders").doc(newOrder.id).set(cleanFirestoreData(newOrder));

    // Decrement inventory safely in Firestore
    for (const item of newOrder.items) {
      try {
        const prodRef = firestore.collection("products").doc(item.productId);
        const prodDoc = await prodRef.get();
        if (prodDoc.exists) {
          const currentStock = prodDoc.data()?.stockQuantity || 0;
          if (currentStock >= item.quantity) {
            await prodRef.update({
              stockQuantity: currentStock - item.quantity,
              updatedAt: now,
            });
          }
        }
      } catch (err) {
        console.error("Inventory decrement error:", err);
      }
    }

    const db = loadLocalDatabase();
    db.orders.push(newOrder);
    saveLocalDatabase(db);

    await recordAuditLog({
      action: "CREATE_ORDER",
      entityType: "order",
      entityId: newOrder.id,
      details: {
        orderNumber,
        totalAmount: newOrder.totalAmount,
        customerName: newOrder.customerName,
      },
    });
    return newOrder;
  }

  const db = loadLocalDatabase();
  db.orders.push(newOrder);

  // Decrement inventory safely if products exist
  newOrder.items.forEach((item) => {
    const prod = db.products.find((p) => p.id === item.productId);
    if (prod && prod.stockQuantity >= item.quantity) {
      prod.stockQuantity -= item.quantity;
      prod.updatedAt = new Date().toISOString();
    }
  });

  saveLocalDatabase(db);
  await recordAuditLog({
    action: "CREATE_ORDER",
    entityType: "order",
    entityId: newOrder.id,
    details: {
      orderNumber,
      totalAmount: newOrder.totalAmount,
      customerName: newOrder.customerName,
    },
  });
  return newOrder;
}

export async function updateOrderStatus(
  id: string,
  status: OrderRecord["status"],
  paymentStatus?: OrderRecord["paymentStatus"],
  userId?: string
): Promise<OrderRecord | null> {
  const now = new Date().toISOString();

  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const ref = firestore.collection("orders").doc(id);
    const doc = await ref.get();
    if (!doc.exists) return null;
    const updatePayload: any = { status, updatedAt: now };
    if (paymentStatus) {
      updatePayload.paymentStatus = paymentStatus;
    }
    await ref.update(updatePayload);
    const updated = { ...(doc.data() as OrderRecord), ...updatePayload };

    const db = loadLocalDatabase();
    const index = db.orders.findIndex((o) => o.id === id);
    if (index !== -1) {
      db.orders[index] = updated;
      saveLocalDatabase(db);
    }

    await recordAuditLog({
      userId,
      action: "UPDATE_ORDER_STATUS",
      entityType: "order",
      entityId: id,
      details: { status, paymentStatus },
    });
    return updated;
  }

  const db = loadLocalDatabase();
  const index = db.orders.findIndex((o) => o.id === id);
  if (index === -1) return null;

  db.orders[index].status = status;
  if (paymentStatus) {
    db.orders[index].paymentStatus = paymentStatus;
  }
  db.orders[index].updatedAt = new Date().toISOString();

  saveLocalDatabase(db);
  await recordAuditLog({
    userId,
    action: "UPDATE_ORDER_STATUS",
    entityType: "order",
    entityId: id,
    details: { status, paymentStatus },
  });
  return db.orders[index];
}

// Promotions
export async function getPromotions(): Promise<PromotionRecord[]> {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const snap = await firestore.collection("promotions").get();
    return snap.docs
      .map((d) => d.data() as PromotionRecord)
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
  const db = loadLocalDatabase();
  return db.promotions.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createPromotion(
  data: Omit<PromotionRecord, "id" | "createdAt" | "updatedAt">,
  userId?: string
): Promise<PromotionRecord> {
  const newPromo: PromotionRecord = {
    ...data,
    id: `promo-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    await firestore.collection("promotions").doc(newPromo.id).set(cleanFirestoreData(newPromo));

    const db = loadLocalDatabase();
    db.promotions.push(newPromo);
    saveLocalDatabase(db);

    await recordAuditLog({
      userId,
      action: "CREATE_PROMOTION",
      entityType: "promotion",
      entityId: newPromo.id,
      details: { title: newPromo.title, code: newPromo.code },
    });
    return newPromo;
  }

  const db = loadLocalDatabase();
  db.promotions.push(newPromo);
  saveLocalDatabase(db);
  await recordAuditLog({
    userId,
    action: "CREATE_PROMOTION",
    entityType: "promotion",
    entityId: newPromo.id,
    details: { title: newPromo.title, code: newPromo.code },
  });
  return newPromo;
}

export async function updatePromotion(
  id: string,
  data: Partial<PromotionRecord>,
  userId?: string
): Promise<PromotionRecord | null> {
  const now = new Date().toISOString();

  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const ref = firestore.collection("promotions").doc(id);
    const doc = await ref.get();
    if (!doc.exists) return null;
    const updated = {
      ...(doc.data() as PromotionRecord),
      ...data,
      updatedAt: now,
    };
    await ref.set(cleanFirestoreData(updated), { merge: true });

    const db = loadLocalDatabase();
    const index = db.promotions.findIndex((p) => p.id === id);
    if (index !== -1) {
      db.promotions[index] = updated;
      saveLocalDatabase(db);
    }

    await recordAuditLog({
      userId,
      action: "UPDATE_PROMOTION",
      entityType: "promotion",
      entityId: id,
      details: data,
    });
    return updated;
  }

  const db = loadLocalDatabase();
  const index = db.promotions.findIndex((p) => p.id === id);
  if (index === -1) return null;

  db.promotions[index] = {
    ...db.promotions[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  saveLocalDatabase(db);
  await recordAuditLog({
    userId,
    action: "UPDATE_PROMOTION",
    entityType: "promotion",
    entityId: id,
    details: data,
  });
  return db.promotions[index];
}

// Navigation & Footer
export async function getNavigation(): Promise<NavigationConfig> {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const doc = await firestore.collection("navigation").doc("header").get();
    if (doc.exists) {
      return doc.data() as NavigationConfig;
    }
  }

  const db = loadLocalDatabase();
  return db.navigation;
}

export async function updateNavigation(
  items: NavigationConfig["items"],
  userId?: string
): Promise<NavigationConfig> {
  const now = new Date().toISOString();

  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const nav: NavigationConfig = { id: "header", location: "header", items, updatedAt: now };
    await firestore.collection("navigation").doc("header").set(cleanFirestoreData(nav));

    const db = loadLocalDatabase();
    db.navigation = nav;
    saveLocalDatabase(db);

    await recordAuditLog({
      userId,
      action: "UPDATE_NAVIGATION",
      entityType: "navigation",
      details: { count: items.length },
    });
    return nav;
  }

  const db = loadLocalDatabase();
  db.navigation.items = items;
  db.navigation.updatedAt = new Date().toISOString();
  saveLocalDatabase(db);
  await recordAuditLog({
    userId,
    action: "UPDATE_NAVIGATION",
    entityType: "navigation",
    details: { count: items.length },
  });
  return db.navigation;
}

export async function getFooterColumns(): Promise<FooterColumn[]> {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const doc = await firestore.collection("navigation").doc("footer").get();
    if (doc.exists) {
      const data = doc.data() as { columns: FooterColumn[] };
      return data.columns || [];
    }
  }

  const db = loadLocalDatabase();
  return db.footerColumns;
}

export async function updateFooterColumns(
  columns: FooterColumn[],
  userId?: string
): Promise<FooterColumn[]> {
  const now = new Date().toISOString();

  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    await firestore.collection("navigation").doc("footer").set({
      columns: cleanFirestoreData(columns),
      updatedAt: now,
    });

    const db = loadLocalDatabase();
    db.footerColumns = columns;
    saveLocalDatabase(db);

    await recordAuditLog({
      userId,
      action: "UPDATE_FOOTER",
      entityType: "footer",
      details: { count: columns.length },
    });
    return columns;
  }

  const db = loadLocalDatabase();
  db.footerColumns = columns;
  saveLocalDatabase(db);
  await recordAuditLog({
    userId,
    action: "UPDATE_FOOTER",
    entityType: "footer",
    details: { count: columns.length },
  });
  return db.footerColumns;
}

// Audit Logs
export async function recordAuditLog(
  entry: Omit<AuditLogRecord, "id" | "createdAt">
): Promise<AuditLogRecord> {
  const log: AuditLogRecord = {
    ...entry,
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    createdAt: new Date().toISOString(),
  };

  if (isFirebaseMode()) {
    try {
      const firestore = getRequiredFirestore();
      await firestore.collection("audit_logs").doc(log.id).set(cleanFirestoreData(log));
    } catch (e) {
      console.error("Failed to write audit log to Firestore:", e);
    }
  }

  const db = loadLocalDatabase();
  db.auditLogs.unshift(log);
  // Keep last 500 records
  if (db.auditLogs.length > 500) {
    db.auditLogs = db.auditLogs.slice(0, 500);
  }
  saveLocalDatabase(db);
  return log;
}

export async function getAuditLogs(limit = 100): Promise<AuditLogRecord[]> {
  if (isFirebaseMode()) {
    try {
      const firestore = getRequiredFirestore();
      const snap = await firestore.collection("audit_logs").get();
      const logs = snap.docs.map((d) => d.data() as AuditLogRecord);
      logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return logs.slice(0, limit);
    } catch (e) {
      console.error("Failed to read audit logs from Firestore:", e);
    }
  }

  const db = loadLocalDatabase();
  return db.auditLogs.slice(0, limit);
}

// Dashboard real metrics (no fake metrics!)
export async function getDashboardStats() {
  if (isFirebaseMode()) {
    const firestore = getRequiredFirestore();
    const [sectionsSnap, productsSnap, pagesSnap, ordersSnap, mediaSnap, promosSnap] = await Promise.all([
      firestore.collection("sections").get(),
      firestore.collection("products").get(),
      firestore.collection("pages").get(),
      firestore.collection("orders").get().catch(() => ({ docs: [] })),
      firestore.collection("media").get().catch(() => ({ docs: [] })),
      firestore.collection("promotions").get().catch(() => ({ docs: [] })),
    ]);

    const sections = sectionsSnap.docs.map((d) => d.data() as PageSection);
    const products = productsSnap.docs.map((d) => d.data() as ProductRecord);
    const pages = pagesSnap.docs.map((d) => d.data() as PageRecord);
    const orders = ordersSnap.docs.map((d) => d.data() as OrderRecord);
    const promos = promosSnap.docs.map((d) => d.data() as PromotionRecord);

    const homepageDraftSections = sections.filter(
      (s) => s.pageId === "page-home" && !s.isPublished
    ).length;
    const publishedHomepageSections = sections.filter(
      (s) => s.pageId === "page-home" && s.isPublished
    ).length;

    return {
      totalProducts: products.length,
      publishedProducts: products.filter((p) => p.isPublished).length,
      totalPages: pages.length,
      publishedPages: pages.filter((p) => p.isPublished).length,
      homepageDraftSections,
      publishedHomepageSections,
      totalOrders: orders.length,
      pendingOrders: orders.filter((o) => o.status === "pending").length,
      totalRevenue: orders
        .filter((o) => o.paymentStatus !== "unpaid" && o.status !== "cancelled")
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0),
      mediaCount: mediaSnap.docs.length,
      activePromotions: promos.filter((p) => p.isActive).length,
    };
  }

  const db = loadLocalDatabase();
  const totalProducts = db.products.length;
  const publishedProducts = db.products.filter((p) => p.isPublished).length;
  const totalPages = db.pages.length;
  const publishedPages = db.pages.filter((p) => p.isPublished).length;
  const homepageDraftSections = db.sections.filter(
    (s) => s.pageId === "page-home" && !s.isPublished
  ).length;
  const publishedHomepageSections = db.sections.filter(
    (s) => s.pageId === "page-home" && s.isPublished
  ).length;
  const totalOrders = db.orders.length;
  const pendingOrders = db.orders.filter((o) => o.status === "pending").length;
  const totalRevenue = db.orders
    .filter((o) => o.paymentStatus !== "unpaid" && o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return {
    totalProducts,
    publishedProducts,
    totalPages,
    publishedPages,
    homepageDraftSections,
    publishedHomepageSections,
    totalOrders,
    pendingOrders,
    totalRevenue,
    mediaCount: db.media.length,
    activePromotions: db.promotions.filter((p) => p.isActive).length,
  };
}
