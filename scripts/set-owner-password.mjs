// TroyX iStore - Secure Local Owner Password Recovery Tool
// Automatically uses native Windows PowerShell masked input (AsSecureString) on Windows.
// Keystrokes are masked (*), no plain text is displayed, logged, or written to disk.

import { spawnSync } from "child_process";
import path from "path";
import fs from "fs";

console.log("==================================================================");
console.log("TROYX iSTORE -- SECURE LOCAL OWNER PASSWORD RECOVERY");
console.log("==================================================================");
console.log("Target Account: akakporichard135@gmail.com");
console.log("Verified UID:   07Rwzx6R7iaENCpBWSQZ2Ta0YLX2\n");

const psScriptPath = path.resolve(process.cwd(), "scripts", "Set-OwnerPassword.ps1");

if (process.platform === "win32" && fs.existsSync(psScriptPath)) {
  // Execute native Windows PowerShell secure masked input
  const res = spawnSync(
    "powershell.exe",
    ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", psScriptPath],
    {
      stdio: "inherit",
    }
  );
  process.exit(res.status ?? 0);
} else {
  console.log("For Windows PowerShell, please run directly:");
  console.log("  powershell -ExecutionPolicy Bypass -File scripts/Set-OwnerPassword.ps1\n");
  process.exit(1);
}
