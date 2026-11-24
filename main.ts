import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

const scriptDir = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(scriptDir, "entry.txt");

let raw;
try {
  raw = readFileSync(sourcePath, "utf8");
} catch {
  fail(`cannot read ${sourcePath}`);
}

let line = raw;
if (line.endsWith("\n")) {
  line = line.slice(0, -1);
}
if (line.endsWith("\r")) {
  line = line.slice(0, -1);
}

if (line.includes("\n") || line.includes("\r") || line.includes("\u2028") || line.includes("\u2029")) {
  fail("entry.txt must contain exactly one line");
}

if (line.includes("\t")) {
  fail("entry must not contain tab characters");
}

const length = [...line].length;
if (length < 1 || length > 140) {
  fail(`entry must be 1 to 140 characters long, got ${length}`);
}

if (line !== line.trim()) {
  fail("entry must not start or end with whitespace");
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outputDir) {
  fail("MAKEFUN_OUTPUT_DIR is not set");
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), line, "utf8");
