// TroyX iStore - Search machine for Firebase credentials
import fs from "fs";
import path from "path";

const userHome = process.env.USERPROFILE || "C:\\Users\\akakp";

const searchPaths = [
  path.join(userHome, "Downloads"),
  path.join(userHome, "Desktop"),
  path.join(userHome, "OneDrive", "Desktop"),
  path.join(userHome, "OneDrive", "Documents"),
  path.join(userHome, "AppData", "Roaming", "gcloud"),
  path.join(userHome, ".config", "gcloud"),
  path.join(userHome, ".config", "configstore"),
  process.cwd(),
];

console.log("Searching candidate directories for Firebase credentials...");

const candidates = [];

for (const dir of searchPaths) {
  try {
    if (!fs.existsSync(dir)) continue;
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const lower = item.toLowerCase();
      if (
        lower.includes("firebase") ||
        lower.includes("adminsdk") ||
        lower.includes("serviceaccount") ||
        lower.includes("troyx") ||
        lower.endsWith(".json")
      ) {
        const fullPath = path.join(dir, item);
        try {
          const stat = fs.statSync(fullPath);
          if (stat.isFile()) {
            candidates.push({ fullPath, mtime: stat.mtime, size: stat.size });
          }
        } catch {}
      }
    }
  } catch {}
}

console.log(`Found ${candidates.length} candidate file(s):`);

for (const c of candidates) {
  try {
    const raw = fs.readFileSync(c.fullPath, "utf-8");
    if (raw.includes("service_account") || raw.includes("private_key") || raw.includes("troyx-istore")) {
      const json = JSON.parse(raw);
      console.log("✔ MATCHING SERVICE ACCOUNT CANDIDATE:", c.fullPath);
      console.log("   type:", json.type);
      console.log("   project_id:", json.project_id);
      console.log("   client_email:", json.client_email);
      console.log("   has_private_key:", Boolean(json.private_key));
      // NEVER PRINT PRIVATE KEY
    } else {
      console.log("   Candidate (not service account):", c.fullPath);
    }
  } catch {
    console.log("   Candidate (non-JSON):", c.fullPath);
  }
}
