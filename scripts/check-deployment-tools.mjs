import { execSync } from "child_process";
import fs from "fs";

function run(cmd) {
  try {
    return execSync(cmd, { encoding: "utf-8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch (err) {
    return `ERROR: ${err.stderr || err.message}`;
  }
}

console.log("=== CHECKING DEPLOYMENT TOOLS ===");
console.log("Git version:", run("git --version"));
console.log("Git status:\n", run("git status --short"));
console.log("Git remote:\n", run("git remote -v"));
console.log("Git branch:\n", run("git branch"));

console.log("\nGitHub CLI (gh):", run("gh --version"));
console.log("GitHub Auth Status:", run("gh auth status"));

console.log("\nVercel CLI global:", run("vercel --version"));
console.log("Vercel CLI via npx:", run("npx vercel --version"));
console.log("Vercel Auth Status:", run("npx vercel whoami"));
