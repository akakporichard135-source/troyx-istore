// TroyX iStore - Search Downloads for Firebase Service Account Key
import fs from "fs";
import path from "path";

const downloadsDir = "C:\\Users\\akakp\\Downloads";
console.log(`Inspecting ${downloadsDir}...`);

try {
  const entries = fs.readdirSync(downloadsDir);
  console.log(`Total items in Downloads: ${entries.length}`);

  const matches = [];

  for (const file of entries) {
    if (file.toLowerCase().endsWith(".json")) {
      const fullPath = path.join(downloadsDir, file);
      try {
        const content = fs.readFileSync(fullPath, "utf-8");
        if (content.includes("service_account") || content.includes("private_key") || content.includes("troyx")) {
          const parsed = JSON.parse(content);
          matches.push({
            fullPath,
            fileName: file,
            projectId: parsed.project_id,
            clientEmail: parsed.client_email,
            type: parsed.type,
            hasPrivateKey: Boolean(parsed.private_key),
          });
        }
      } catch (err) {
        // Not a readable/valid json, skip
      }
    }
  }

  console.log(`Found ${matches.length} matching Firebase Service Account file(s):`);
  for (const m of matches) {
    console.log("------------------------------------------------------------------");
    console.log("File Path:       ", m.fullPath);
    console.log("Project ID:      ", m.projectId);
    console.log("Client Email:    ", m.clientEmail);
    console.log("Account Type:    ", m.type);
    console.log("Has Private Key: ", m.hasPrivateKey);
    console.log("Belongs to TroyX:", m.projectId === "troyx-istore");
    // NEVER PRINT PRIVATE KEY
    console.log("------------------------------------------------------------------");
  }

  if (matches.length === 0) {
    console.log("No Firebase service account JSON files found in Downloads.");
  }
} catch (e) {
  console.error("Error reading Downloads folder:", e.message);
}
