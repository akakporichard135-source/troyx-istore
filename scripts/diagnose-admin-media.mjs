import fs from "fs";
import path from "path";

console.log("=== DIAGNOSTIC 1: SCANNING ADMIN PAGES FOR MEDIA HANDLING ===");

const adminDir = path.resolve(process.cwd(), "src/app/admin");

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(full);
    } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
      const content = fs.readFileSync(full, "utf-8");
      const hasFileInput = content.includes('type="file"');
      const hasUploadApi = content.includes("/api/admin/media");
      const hasSignUpload = content.includes("sign-upload");
      const hasImageFields = content.includes("imageUrl") || content.includes("desktopMediaId") || content.includes("mediaId");
      
      console.log(`\nFile: ${path.relative(process.cwd(), full)}`);
      console.log(`  - File Input (<input type="file">): ${hasFileInput}`);
      console.log(`  - Calls /api/admin/media: ${hasUploadApi}`);
      console.log(`  - Calls sign-upload: ${hasSignUpload}`);
      console.log(`  - Contains image/media state fields: ${hasImageFields}`);
    }
  }
}

scanDir(adminDir);

console.log("\n=== DIAGNOSTIC 2: SECTION TYPES IN SECTIONRENDERER ===");
const rendererContent = fs.readFileSync(path.resolve(process.cwd(), "src/components/public/SectionRenderer.tsx"), "utf-8");
const typeMatches = [...rendererContent.matchAll(/section\.sectionType === ["']([^"']+)["']/g)].map(m => m[1]);
console.log("Supported section types in SectionRenderer:", Array.from(new Set(typeMatches)));
