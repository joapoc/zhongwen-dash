import axios from "axios";
import fs from "fs";
import path from "path";

import { fetchTrending, iconFilenameFromUrl, refreshLocalIconIndex } from "../modules/trending/trending.service";

const OUTPUT_DIR = path.join(process.cwd(), "public", "assets", "trending-icons");
const USER_AGENT =
  "Mozilla/5.0 (compatible; ZhongwenDash/1.0; language-learning client)";

async function downloadIcon(remoteUrl: string, filename: string): Promise<"ok" | "skip" | "fail"> {
  const target = path.join(OUTPUT_DIR, filename);
  if (fs.existsSync(target) && fs.statSync(target).size > 0) return "skip";
  try {
    const response = await axios.get<ArrayBuffer>(remoteUrl, {
      timeout: 15000,
      responseType: "arraybuffer",
      headers: {
        "User-Agent": USER_AGENT,
        Referer: "https://tophub.today/",
        Accept: "image/png,image/jpeg,image/webp,image/*;q=0.8,*/*;q=0.5",
      },
      validateStatus: (status) => status >= 200 && status < 400,
    });
    fs.writeFileSync(target, Buffer.from(response.data));
    return "ok";
  } catch {
    return "fail";
  }
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // The service rewrites icon URLs when the file already exists locally, so
  // clear the in-memory index before scraping to ensure we see raw remote URLs
  // if some icons are already cached.
  refreshLocalIconIndex();
  const snapshot = await fetchTrending(true);

  // Collect unique (filename, remote URL) pairs. Sources with already-rewritten
  // local paths get skipped automatically.
  const pending = new Map<string, string>();
  for (const source of snapshot.sources) {
    if (!source.icon) continue;
    if (source.icon.startsWith("/")) continue; // already local
    const filename = iconFilenameFromUrl(source.icon);
    if (!filename) continue;
    if (!pending.has(filename)) pending.set(filename, source.icon);
  }

  console.log(`Found ${snapshot.sources.length} sources; ${pending.size} icons to consider.`);

  let ok = 0;
  let skip = 0;
  let fail = 0;
  let i = 0;
  for (const [filename, remoteUrl] of pending) {
    i += 1;
    const result = await downloadIcon(remoteUrl, filename);
    if (result === "ok") {
      ok += 1;
      console.log(`[${i}/${pending.size}] ✓ ${filename}`);
    } else if (result === "skip") {
      skip += 1;
    } else {
      fail += 1;
      console.warn(`[${i}/${pending.size}] ✗ ${filename} (${remoteUrl})`);
    }
  }

  refreshLocalIconIndex();
  console.log(`\nDone. downloaded=${ok} skipped=${skip} failed=${fail}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
