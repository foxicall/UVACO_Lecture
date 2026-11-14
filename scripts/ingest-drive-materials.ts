import { readFile, writeFile } from 'node:fs/promises';
import { parseProductSource } from '../src/lib/markdown-source';
async function main() {
  const mechanisms = await readFile('葡眾/pro-partner-health-mechanisms.md', 'utf8');
  const pdf = await readFile('葡眾/pdf-extracted-sources.md', 'utf8');
  const records = parseProductSource(mechanisms);
  await writeFile('src/data/source-materials.json', JSON.stringify({ provenance: '使用者提供的 Google Drive 文件文字擷取', products: records, education: pdf }, null, 2) + '\n');
  console.log('Imported 12 complete product sections and PDF text excerpts.');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
