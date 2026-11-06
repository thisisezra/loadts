import { build } from "esbuild";
import { copyFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const files = ["ts.js", "ts-sw.js", "ts-strip.js"];

await mkdir(here("../dist"), { recursive: true });

await build({
  entryPoints: [here("./strip-entry.js")],
  bundle: true,
  format: "iife",
  platform: "browser",
  minify: true,
  legalComments: "none",
  outfile: here("../dist/ts-strip.js"),
  alias: { util: here("./shim-util.js"), "node:buffer": here("./shim-buffer.js") },
  logLevel: "info"
});

await copyFile(here("../src/ts.js"), here("../dist/ts.js"));
await copyFile(here("../src/ts-sw.js"), here("../dist/ts-sw.js"));

for (const file of files) {
  await copyFile(here(`../dist/${file}`), here(`../docs/${file}`));
}
