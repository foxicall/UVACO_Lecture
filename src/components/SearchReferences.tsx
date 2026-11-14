'use client';
import type { ClinicalResult } from '@/lib/clinical-analysis';

export default function SearchReferences({ grounding }: { grounding:ClinicalResult['grounding'] }) {
  if (!grounding.citations.length) return <p className="small-copy">此次沒有即時網路引用，請依文件來源與證據限制閱讀。</p>;
  const document=`<!doctype html><html lang="zh-Hant"><head><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src https://www.gstatic.com data:;"><meta name="referrer" content="no-referrer"><style>body{margin:8px;font-family:system-ui;color:#182220;background:#faf7f2}a{color:#163e32}</style></head><body>${grounding.searchEntryHtml}</body></html>`;
  return <section className="search-references" aria-label="本次搜尋參考">
    <h4>本次搜尋參考</h4><p className="small-copy">來源可能研究不同原料、配方或族群；引用本身不等於證明產品療效。</p>
    <ol>{grounding.citations.map(citation=><li key={citation.url}><a href={citation.url} target="_blank" rel="noopener noreferrer">{citation.title} ↗</a></li>)}</ol>
    {grounding.searchEntryHtml && <iframe className="google-search-suggestions" title="Google 搜尋建議" sandbox="allow-popups allow-popups-to-escape-sandbox" referrerPolicy="no-referrer" srcDoc={document} />}
    {!grounding.searchEntryHtml && grounding.queries.length>0 && <details><summary>查看搜尋關鍵詞</summary>{grounding.queries.map(query=><p key={query}><a href={`https://www.google.com/search?q=${encodeURIComponent(query)}`} target="_blank" rel="noopener noreferrer">{query}</a></p>)}</details>}
  </section>;
}
