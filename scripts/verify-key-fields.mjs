import fs from "fs";

const keyPath = "C:\\Users\\akakp\\Downloads\\troyx-istore-firebase-adminsdk-fbsvc-f51aa4b5ba.json";
if (fs.existsSync(keyPath)) {
  const content = JSON.parse(fs.readFileSync(keyPath, "utf-8"));
  console.log("Key found!");
  console.log("Project ID:", content.project_id);
  console.log("Client Email:", content.client_email);
  console.log("Private Key length:", content.private_key ? content.private_key.length : 0);
  console.log("Has private key start:", content.private_key?.startsWith("-----BEGIN PRIVATE KEY-----"));
} else {
  console.log("Key file not found at path:", keyPath);
}
