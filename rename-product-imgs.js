import fs from "fs";
import path from "path";

// ===== CONFIG =====
const DIRECTORY = process.cwd(); // current directory
const PREFIX = "product";
const EXTENSION = ".jpeg"; // final extension
const START_INDEX = 1;
// ==================

const files = fs
  .readdirSync(DIRECTORY)
  .filter((file) =>
    /\.(jpe?g)$/i.test(file)
  )
  .sort((a, b) => a.localeCompare(b));

if (files.length === 0) {
  console.log("❌ No JPEG files found.");
  process.exit(0);
}

files.forEach((file, index) => {
  const oldPath = path.join(DIRECTORY, file);
  const newName = `${PREFIX}-${START_INDEX + index}${EXTENSION}`;
  const newPath = path.join(DIRECTORY, newName);

  fs.renameSync(oldPath, newPath);
  console.log(`✔ ${file} → ${newName}`);
});

console.log(`\n✅ Renamed ${files.length} files successfully.`);
