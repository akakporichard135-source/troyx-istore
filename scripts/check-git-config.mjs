import { execSync } from "child_process";

try {
  const out = execSync("git config --list --show-origin", { encoding: "utf-8" });
  console.log(out.split("\n").filter(l => l.includes("user.") || l.includes("credential")).join("\n"));
} catch (e) {
  console.log("Error:", e.message);
}
