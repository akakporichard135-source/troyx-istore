import { createServer } from "http";
import { parse } from "url";
import next from "next";

const dev = true;
const hostname = "127.0.0.1";
let port = 3000;

const app = next({ dev, hostname, port, dir: process.cwd() });
const handle = app.getRequestHandler();

console.log("Preparing Next.js dev server on http://localhost:" + port + "...");

app
  .prepare()
  .then(() => {
    const server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error("Error handling request", req.url, err);
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    });

    server.once("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.warn(`Port ${port} is in use. Trying port ${port + 1}...`);
        port += 1;
        server.listen(port, hostname, () => {
          console.log(`> Ready on http://localhost:${port} and http://${hostname}:${port}`);
        });
      } else {
        console.error("Server error:", err);
        process.exit(1);
      }
    });

    server.listen(port, hostname, () => {
      console.log(`> Ready on http://localhost:${port} and http://${hostname}:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to prepare Next.js app:", err);
    process.exit(1);
  });
