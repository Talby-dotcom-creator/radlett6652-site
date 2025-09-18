// fix-default-exports.cjs
const fs = require("fs");
const path = require("path");

const pagesDir = path.join(__dirname, "src", "pages");

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const fileName = path.basename(filePath);

  // Already has default export
  if (content.includes("export default")) {
    console.log(`✅ Already OK: ${fileName}`);
    return;
  }

  // Case 1: Named export function → convert to default
  if (/export function (\w+)/.test(content)) {
    content = content.replace(/export function (\w+)/, "export default function $1");
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`🛠 Fixed: ${fileName} (converted named export to default)`);
    return;
  }

  // Case 2: No export at all → add default at bottom
  if (!content.includes("export")) {
    const componentName = path.basename(filePath, path.extname(filePath));
    // If the file likely contains a React component named the same, we append export default
    content += `\n\nexport default ${componentName};\n`;
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`🛠 Fixed: ${fileName} (added default export)`);
    return;
  }

  // If it has exports but not default, warn
  console.log(`⚠️ Needs manual check: ${fileName}`);
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      fixFile(filePath);
    }
  });
}

console.log("🔍 Checking and fixing pages for default exports...\n");
walkDir(pagesDir);
