import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const api = "https://commons.wikimedia.org/w/api.php";
const outputDir = path.join(process.cwd(), "public", "images", "iphone");
const responsiveDir = path.join(outputDir, "responsive");
const sourceDir = path.join(outputDir, "sources");

const targets = [
  ["iphone-11", "iPhone 11", "Category:IPhone_11"],
  ["iphone-11-pro", "iPhone 11 Pro", "Category:IPhone_11_Pro"],
  ["iphone-11-pro-max", "iPhone 11 Pro Max", "Category:IPhone_11_Pro_Max"],
  ["iphone-12", "iPhone 12", "Category:IPhone_12"],
  ["iphone-12-mini", "iPhone 12 mini", "Category:IPhone_12_Mini"],
  ["iphone-12-pro", "iPhone 12 Pro", "Category:IPhone_12_Pro"],
  ["iphone-12-pro-max", "iPhone 12 Pro Max", "Category:IPhone_12_Pro_Max"],
  ["iphone-13", "iPhone 13", "Category:IPhone_13"],
  ["iphone-13-mini", "iPhone 13 mini", "Category:IPhone_13_Mini"],
  ["iphone-13-pro", "iPhone 13 Pro", "Category:IPhone_13_Pro"],
  ["iphone-13-pro-max", "iPhone 13 Pro Max", "Category:IPhone_13_Pro_Max"],
  ["iphone-14", "iPhone 14", "Category:IPhone_14"],
  ["iphone-14-plus", "iPhone 14 Plus", "Category:IPhone_14_Plus"],
  ["iphone-14-pro", "iPhone 14 Pro", "Category:IPhone_14_Pro"],
  ["iphone-14-pro-max", "iPhone 14 Pro Max", "Category:IPhone_14_Pro_Max"],
  ["iphone-15", "iPhone 15", "Category:IPhone_15"],
  ["iphone-15-plus", "iPhone 15 Plus", "Category:IPhone_15_Plus"],
  ["iphone-15-pro", "iPhone 15 Pro", "Category:IPhone_15_Pro"],
  ["iphone-15-pro-max", "iPhone 15 Pro Max", "Category:IPhone_15_Pro_Max"],
  ["iphone-16", "iPhone 16", "Category:IPhone_16"],
  ["iphone-16-plus", "iPhone 16 Plus", "Category:IPhone_16_Plus"],
  ["iphone-16-pro", "iPhone 16 Pro", "Category:IPhone_16_Pro"],
  ["iphone-16-pro-max", "iPhone 16 Pro Max", "Category:IPhone_16_Pro_Max"],
  ["iphone-17", "iPhone 17", "Category:IPhone_17"],
  ["iphone-17-air", "iPhone Air", "Category:IPhone_Air"],
  ["iphone-17-pro", "iPhone 17 Pro", "Category:IPhone_17_Pro"],
  ["iphone-17-pro-max", "iPhone 17 Pro Max", "Category:IPhone_17_Pro_Max"]
].map(([slug, name, category]) => ({ slug, name, category }));

const manualSelections = {
  "iphone-11": "File:IPhone 11 Product Red 128g.jpg",
  "iphone-12-pro-max": "File:IPhone 12 Pro Max Pacific Blue 128g.jpg",
  "iphone-14-plus": "File:IPhone 14 Plus yellow.jpg",
  "iphone-14-pro": "File:IPhone 14 Pro Deep Purple 256g.jpg"
};

const excludedTerms = [
  "logo",
  "vector",
  "wordmark",
  "screenshot",
  "screen.",
  "scan",
  "case",
  "box",
  "carbon",
  "footprint",
  "motherboard",
  "logic board",
  "close-up",
  "close up",
  "camera of",
  "cameras",
  "lense",
  "lens",
  "button",
  "launch",
  "event",
  "store",
  "display for sale",
  "with apple watch",
  "macbook",
  "selfie",
  "repair",
  "teardown"
];

function buildParams(params) {
  const search = new URLSearchParams({ format: "json", origin: "*", ...params });
  return `${api}?${search.toString()}`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function commons(params) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    await sleep(3500 + attempt * 1000);
    const response = await fetch(buildParams(params), {
      headers: {
        "User-Agent": "TroyX-iStore-image-catalog/1.0 (Commons license metadata import; contact: local-build)"
      }
    });
    if (response.ok) {
      return response.json();
    }
    if (response.status !== 429 || attempt === 4) {
      throw new Error(`Commons API failed: ${response.status} ${response.statusText}`);
    }
    await sleep(2500 * (attempt + 1));
  }
}

async function categoryFiles(category) {
  let cmcontinue;
  const files = [];
  do {
    const data = await commons({
      action: "query",
      list: "categorymembers",
      cmtitle: category,
      cmnamespace: "6",
      cmlimit: "500",
      ...(cmcontinue ? { cmcontinue } : {})
    });
    files.push(...(data.query?.categorymembers ?? []));
    cmcontinue = data.continue?.cmcontinue;
  } while (cmcontinue);
  return files;
}

async function imageInfo(titles) {
  const pages = [];
  for (let i = 0; i < titles.length; i += 50) {
    const chunk = titles.slice(i, i + 50);
    const data = await commons({
      action: "query",
      prop: "imageinfo",
      titles: chunk.join("|"),
      iiprop: "url|size|mime|extmetadata",
      iiurlwidth: "1000"
    });
    pages.push(...Object.values(data.query?.pages ?? {}));
  }
  return pages
    .map((page) => ({ title: page.title, ...(page.imageinfo?.[0] ?? {}) }))
    .filter((page) => page.url);
}

function normalizedTitle(title) {
  return title
    .replace(/^File:/i, "")
    .replace(/\.[a-z0-9]+$/i, "")
    .toLowerCase();
}

function isReusable(info) {
  const licenseUrl = info.extmetadata?.LicenseUrl?.value ?? "";
  const license = info.extmetadata?.LicenseShortName?.value ?? "";
  return /creativecommons\.org|publicdomain|cc0|cc-by|cc by|public domain/i.test(`${licenseUrl} ${license}`);
}

function scoreCandidate(target, info) {
  const title = normalizedTitle(info.title);
  if (!/\.(jpe?g|png|webp)$/i.test(info.title)) return -Infinity;
  if (excludedTerms.some((term) => title.includes(term))) return -Infinity;
  if (!isReusable(info)) return -Infinity;

  const targetWords = target.name.toLowerCase().replace("iphone air", "iphone 17 air").split(/\s+/);
  let score = 0;
  for (const word of targetWords) {
    if (title.includes(word)) score += 25;
  }

  if (title.includes(target.name.toLowerCase())) score += 80;
  if (target.slug === "iphone-17-air" && title.includes("iphone air")) score += 120;
  if (/(&|and)\s+iphone|\biphone\b.*\biphone\b/.test(title)) score -= 70;
  for (const other of ["11", "12", "13", "14", "15", "16", "17"]) {
    if (!target.slug.includes(other) && new RegExp(`\\biphone\\s+${other}\\b`).test(title)) {
      score -= 95;
    }
  }
  if (/\bfront\b|frontal|face\b/.test(title)) score += 55;
  if (/\bangle|angled|side|right view|left view|table|tischkante\b/.test(title)) score += 35;
  if (/\bback|rear|backside\b/.test(title)) score += 20;
  if (/\ball color|all colours|all colors|available colors\b/.test(title)) score += 15;
  if (info.width && info.height) score += Math.min(40, Math.round((info.width * info.height) / 350000));
  if (info.mime === "image/png") score += 3;
  return score;
}

async function selectImage(target) {
  const manualTitle = manualSelections[target.slug];
  if (manualTitle) {
    const [info] = await imageInfo([manualTitle]);
    if (info && isReusable(info)) {
      return { target, info, alternates: [] };
    }
    return { target, reason: `Manual selection is missing or not reusable: ${manualTitle}` };
  }

  const files = await categoryFiles(target.category);
  if (!files.length) return { target, reason: `No Commons media files found in ${target.category}` };

  const infos = await imageInfo(files.map((file) => file.title));
  const ranked = infos
    .map((info) => ({ info, score: scoreCandidate(target, info) }))
    .filter((entry) => Number.isFinite(entry.score))
    .sort((a, b) => b.score - a.score);

  if (!ranked.length) {
    return { target, reason: `No reusable JPG/PNG/WebP product photo found in ${target.category}` };
  }

  return { target, info: ranked[0].info, alternates: ranked.slice(1, 4).map((entry) => entry.info.title) };
}

function stripHtml(value = "") {
  return value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

async function download(url, destination) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    await sleep(8000 + attempt * 3000);
    const response = await fetch(url, {
      headers: {
        "User-Agent": "TroyX-iStore-image-catalog/1.0 (Commons license metadata import; contact: local-build)"
      }
    });
    if (response.ok) {
      await fs.writeFile(destination, Buffer.from(await response.arrayBuffer()));
      return;
    }
    if (response.status !== 429 || attempt === 4) {
      throw new Error(`Image download failed: ${response.status} ${response.statusText}`);
    }
    await sleep(5000 * (attempt + 1));
  }
}

async function optimize(sourcePath, targetPath, width) {
  const image = sharp(sourcePath).rotate();
  const pipeline = width ? image.resize({ width, withoutEnlargement: true }) : image.resize({ width: 1000, withoutEnlargement: true });
  await pipeline.webp({ quality: 82, effort: 5 }).toFile(targetPath);
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  let previousManifest = new Map();
  try {
    const manifestJson = await fs.readFile(path.join(outputDir, "sources.json"), "utf8");
    previousManifest = new Map(JSON.parse(manifestJson).map((entry) => [entry.slug, entry]));
  } catch {
    previousManifest = new Map();
  }

  if (!dryRun) {
    await fs.mkdir(outputDir, { recursive: true });
    await fs.mkdir(responsiveDir, { recursive: true });
    await fs.mkdir(sourceDir, { recursive: true });
  }

  const manifest = [];
  const missing = [];

  for (const target of targets) {
    const selected = await selectImage(target);
    if (!selected.info) {
      missing.push(selected);
      console.log(`MISSING ${target.slug}: ${selected.reason}`);
      continue;
    }

    const { info } = selected;
    const downloadUrl = info.thumburl || info.url;
    const extension = path.extname(new URL(downloadUrl).pathname) || path.extname(info.title);
    const sourcePath = path.join(sourceDir, `${target.slug}${extension}`);
    const webpPath = path.join(outputDir, `${target.slug}.webp`);
    const smallPath = path.join(responsiveDir, `${target.slug}-480.webp`);
    const mediumPath = path.join(responsiveDir, `${target.slug}-800.webp`);

    console.log(`SELECT ${target.slug}: ${info.title}`);
    if (!dryRun) {
      const previous = previousManifest.get(target.slug);
      if (previous?.sourceTitle !== info.title) {
        await download(downloadUrl, sourcePath);
      } else {
        try {
          await fs.access(sourcePath);
        } catch {
          await download(downloadUrl, sourcePath);
        }
      }
      await optimize(sourcePath, webpPath);
      await optimize(sourcePath, smallPath, 480);
      await optimize(sourcePath, mediumPath, 800);
    }

    manifest.push({
      slug: target.slug,
      productName: target.name,
      image: `/images/iphone/${target.slug}.webp`,
      responsive: [
        `/images/iphone/responsive/${target.slug}-480.webp`,
        `/images/iphone/responsive/${target.slug}-800.webp`
      ],
      sourceTitle: info.title,
      sourcePage: info.descriptionurl,
      originalUrl: info.url,
      importedUrl: downloadUrl,
      license: stripHtml(info.extmetadata?.LicenseShortName?.value),
      licenseUrl: info.extmetadata?.LicenseUrl?.value ?? "",
      attribution: stripHtml(info.extmetadata?.Artist?.value || info.extmetadata?.Credit?.value),
      width: info.width,
      height: info.height,
      alternates: selected.alternates
    });
  }

  if (!dryRun) {
    await fs.writeFile(path.join(outputDir, "sources.json"), `${JSON.stringify(manifest, null, 2)}\n`);
    await fs.writeFile(path.join(outputDir, "missing-images.json"), `${JSON.stringify(missing, null, 2)}\n`);
  }

  console.log(`\nImported: ${manifest.length}`);
  console.log(`Missing: ${missing.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
