/** Markdown is source data, never an executable instruction or HTML template. */
export function markdownSections(text: string) {
  const lines = text.split(/\r?\n/);
  const headings: { title: string; line: number; level: number }[] = [];
  let fence = '';
  lines.forEach((line, i) => {
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker) { if (!fence) fence = marker[1][0]; else if (fence === marker[1][0]) fence = ''; return; }
    if (fence) return;
    const match = line.match(/^(#{1,6})\s+(.+)/);
    if (match) headings.push({ title: match[2], line: i + 1, level: match[1].length });
  });
  if (!headings.length || headings[0].line !== 1) headings.unshift({ title: '文件導讀', line: 1, level: 0 });
  return headings.map((heading, i) => ({ ...heading, endLine: (headings[i + 1]?.line ?? lines.length + 1) - 1, text: lines.slice(heading.line - 1, (headings[i + 1]?.line ?? lines.length + 1) - 1).join('\n') }));
}

export function parseProductSource(markdown: string) {
  const ids = ['995', 'antrodia', 'antrodia-drops', 'kanger', 'kanger-n', 'kangyue', 'huoyi', 'ningkang', '360', 'dikang', 'lisheng', 'kangbei'];
  const sections = markdownSections(markdown).filter(s => s.level === 3 && /^\d+\. /.test(s.title));
  if (sections.length !== 12) throw new Error(`Expected 12 numbered product sections, got ${sections.length}`);
  return sections.map((section, i) => {
    if (Number(section.title.match(/^\d+/)?.[0]) !== i + 1) throw new Error('Product source order is incomplete');
    const fields = Object.fromEntries([...section.text.matchAll(/^\s*\* \*\*(.+?)\*\*[：:]([^\n]+)/gm)].map(m => [m[1], m[2].trim()]));
    if (!Object.keys(fields).some(key => /成分|組成/.test(key)) || !['對抗慢性發炎', '驅動自癒力', '調節自律神經'].every(key => fields[key])) throw new Error(`Incomplete source for ${ids[i]}`);
    return { id: ids[i], title: section.title.replace(/^\d+\. /, ''), text: section.text.replace(/^### .+\n/, '').trim(), fields, source: '葡眾/pro-partner-health-mechanisms.md' };
  });
}
