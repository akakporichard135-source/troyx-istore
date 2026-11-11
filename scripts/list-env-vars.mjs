import fs from "fs";
import path from "path";

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) results = results.concat(walk(full));
    else if (file.endsWith(".ts") || file.endsWith(".tsx") || file.endsWith(".mjs")) results.push(full);
  }
  return results;
}

const files = walk(path.resolve(process.cwd(), "src"));
const envVars = new Set();
for (const f of files) {
  const content = fs.readFileSync(f, "utf8");
  const matches = content.match(/process\.env\.([A-Z0-9_]+)/g);
  if (matches) {
    for (const m of matches) {
      envVars.add(m.replace("process.env.", ""));
    }
  }
}

console.log("All process.env keys used in src:");
console.log(Array.from(envVars).sort().join("\n"));
