import fs from "fs";
import path from "path";
import os from "os";

const homeDir = os.homedir();
const appData = process.env.APPDATA || path.join(homeDir, "AppData", "Roaming");
const localAppData = process.env.LOCALAPPDATA || path.join(homeDir, "AppData", "Local");

console.log("Checking Vercel credentials files...");

const possiblePaths = [
  path.join(appData, "com.vercel.cli", "auth.json"),
  path.join(localAppData, "com.vercel.cli", "auth.json"),
  path.join(homeDir, ".vercel", "auth.json"),
  path.join(appData, "vercel", "auth.json"),
  path.join(homeDir, ".config", "vercel", "auth.json")
];

for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    try {
      const content = JSON.parse(fs.readFileSync(p, "utf-8"));
      console.log(`FOUND Vercel auth at: ${p}`);
      console.log(`Has token: ${Boolean(content.token)}`);
      if (content.token) {
        console.log(`Token prefix: ${content.token.slice(0, 6)}...`);
      }
    } catch (e) {
      console.log(`Found ${p} but error parsing: ${e.message}`);
    }
  } else {
    console.log(`Not found: ${p}`);
  }
}
