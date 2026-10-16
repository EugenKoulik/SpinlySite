#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SHOTS_DIR = path.join(__dirname, "..", "assets", "shots");
const WIDTHS = [420, 840];
const QUALITY = 78;

async function main() {
  const files = fs
    .readdirSync(SHOTS_DIR)
    .filter((name) => name.toLowerCase().endsWith(".png"))
    .sort();

  if (!files.length) {
    console.log("No PNG files found in assets/shots");
    return;
  }

  let written = 0;
  for (const file of files) {
    const input = path.join(SHOTS_DIR, file);
    const base = file.replace(/\.png$/i, "");
    const meta = await sharp(input).metadata();
    const origW = meta.width || 0;

    for (const width of WIDTHS) {
      const outName = `${base}-${width}.webp`;
      const outPath = path.join(SHOTS_DIR, outName);
      const info = await sharp(input)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(outPath);
      written += 1;
      console.log(
        `${outName.padEnd(42)} ${String(origW).padStart(4)}→${String(info.width).padStart(4)}px  ${(info.size / 1024).toFixed(1)} KB`
      );
    }
  }

  console.log(`\nDone: ${files.length} PNG → ${written} WebP`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
