const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 14173);
const host = process.env.HOST || "0.0.0.0";

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg"
};

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type });
  res.end(body);
}

http
  .createServer((req, res) => {
    const url = new URL(req.url || "/", `http://127.0.0.1:${port}`);
    const pathname = url.pathname === "/" ? "/outputs/troyx-istore-preview.html" : url.pathname;
    const filePath = path.resolve(root, `.${decodeURIComponent(pathname)}`);

    if (!filePath.startsWith(root)) {
      send(res, 403, "Forbidden");
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        send(res, 404, "Not found");
        return;
      }
      send(res, 200, data, types[path.extname(filePath)] || "application/octet-stream");
    });
  })
  .listen(port, host, () => {
    console.log(`TroyX iStore preview running at http://${host}:${port}/outputs/troyx-istore-preview.html`);
  });
