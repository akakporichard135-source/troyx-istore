const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const out = fs.openSync(path.join(root, "work", "static-preview.log"), "a");
const err = fs.openSync(path.join(root, "work", "static-preview.err.log"), "a");

const child = spawn(process.execPath, [path.join(root, "work", "static-preview-server.js")], {
  cwd: root,
  detached: true,
  stdio: ["ignore", out, err],
  env: { ...process.env, HOST: "0.0.0.0", PORT: "14173" }
});

child.unref();
console.log(child.pid);
