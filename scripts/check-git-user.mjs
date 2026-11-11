import { execSync } from "child_process";

try {
  const name = execSync("git config --global user.name", { encoding: "utf-8" }).trim();
  const email = execSync("git config --global user.email", { encoding: "utf-8" }).trim();
  console.log("Global git user.name:", name);
  console.log("Global git user.email:", email);
} catch (e) {
  console.log("Git user config error:", e.message);
}
