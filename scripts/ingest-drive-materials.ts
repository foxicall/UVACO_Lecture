import { readFile, writeFile } from 'node:fs/promises';
const ids = ['995', 'antrodia', 'antrodia-drops', 'kanger', 'kanger-n', 'kangyue', 'huoyi', 'ningkang', '360', 'dikang', 'lisheng', 'kangbei'];
async function main() {
  const mechanisms = await readFile('葡眾/pro-partner-health-mechanisms.md', 'utf8');
  const pdf = await readFile('葡眾/pdf-extracted-sources.md', 'utf8');
  const matches = [...mechanisms.matchAll(/^\d+\. (.+?)\s*\n([\s\S]*?)(?=^\d+\. |$(?![\s\S]))/gm)];
  if (matches.length !== 12) throw new Error(`Expected 12 product sections, received ${matches.length}`);
  const records = matches.map((match, index) => {
    const body = match[2].trim();
    const headings = [...body.matchAll(/^\s*- (.+?)[：:]([\s\S]*?)(?=^\s*- |$(?![\s\S]))/gm)];
    const fields = Object.fromEntries(headings.map(m => [m[1], m[2].trim()]));
    if (Object.keys(fields).length < 4) throw new Error(`Incomplete product source: ${match[1]}`);
    return { id: ids[index], title: match[1], text: body, fields, source: '葡眾/pro-partner-health-mechanisms.md' };
  });
  await writeFile('src/data/source-materials.json', JSON.stringify({ provenance: '使用者提供的 Google Drive 文件文字擷取', products: records, education: pdf }, null, 2) + '\n');
  console.log('Imported 12 complete product sections and PDF text excerpts.');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
