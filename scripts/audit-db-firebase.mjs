import fs from "fs";

const content = fs.readFileSync("src/lib/storage/db.ts", "utf8");
const fnRegex = /export async function ([a-zA-Z0-9_]+)\([^)]*\)[^{]*\{([\s\S]*?)(?=\nexport async function|\nexport function|\Z)/g;

let match;
const missingFirebase = [];
const hasFirebase = [];

while ((match = fnRegex.exec(content)) !== null) {
  const name = match[1];
  const body = match[2];
  if (body.includes("isFirebaseMode()")) {
    hasFirebase.push(name);
  } else {
    missingFirebase.push(name);
  }
}

console.log("Functions with isFirebaseMode():", hasFirebase);
console.log("\nFunctions MISSING isFirebaseMode():", missingFirebase);
