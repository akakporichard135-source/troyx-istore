import http from "http";

function fetchUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        console.log(`[${url}] Status: ${res.statusCode}, Body Length: ${data.length} bytes`);
        if (data.includes("TroyX")) {
          console.log(`✔ Verified: Found "TroyX" brand typography in HTML payload!`);
        }
        resolve({ status: res.statusCode, body: data });
      });
    }).on("error", (err) => {
      console.error(`[${url}] Error: ${err.message}`);
      resolve(null);
    });
  });
}

async function run() {
  console.log("Probing http://localhost:3000...");
  await fetchUrl("http://localhost:3000");

  console.log("\nProbing http://localhost:3000/admin...");
  await fetchUrl("http://localhost:3000/admin");

  console.log("\nProbing http://localhost:3000/admin/login...");
  await fetchUrl("http://localhost:3000/admin/login");

  console.log("\nProbing http://localhost:3000/store...");
  await fetchUrl("http://localhost:3000/store");
}

run();
