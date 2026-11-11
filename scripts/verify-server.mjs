import http from "http";

function check(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => resolve({ ok: true, statusCode: res.statusCode, length: data.length }));
    });
    req.on("error", (err) => resolve({ ok: false, error: err.message }));
    req.setTimeout(3000, () => {
      req.destroy();
      resolve({ ok: false, error: "timeout" });
    });
  });
}

async function main() {
  console.log("Checking localhost:3000 and 127.0.0.1:3000...");
  for (let i = 0; i < 45; i++) {
    const r1 = await check("http://127.0.0.1:3000");
    if (r1.ok) {
      console.log(`✔ Homepage online! Status: ${r1.statusCode}, size: ${r1.length} bytes`);
      const r2 = await check("http://127.0.0.1:3000/admin");
      console.log(`✔ Admin route online! Status: ${r2.statusCode}`);
      process.exit(0);
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  process.exit(1);
}

main();
