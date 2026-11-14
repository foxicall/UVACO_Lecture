import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative } from 'node:path';
import { execFileSync } from 'node:child_process';
const root=process.cwd();
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const ignored=new Set(['.git','node_modules','.next','.next-dev','.next-pages','out','.longevity-extracted','test-results','.taste-skill']);
function scan(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>ignored.has(e.name)||e.isSymbolicLink()?[]:e.isDirectory()?scan(join(dir,e.name)):/^[1-6]\..*\.(pdf|md)$/.test(e.name)?[join(dir,e.name)]:[]);}
const paths=scan(root),content=JSON.parse(readFileSync('src/data/longevity-content.json','utf8'));
if(process.argv.includes('--extract'))execFileSync('python',['scripts/extract-longevity-pdfs.py'],{stdio:'inherit'});
const previous=existsSync('src/data/longevity-private-index.json')?JSON.parse(readFileSync('src/data/longevity-private-index.json','utf8')):[];
const extracted=existsSync('.longevity-extracted/pdf-index.json')?JSON.parse(readFileSync('.longevity-extracted/pdf-index.json','utf8')):previous;
const index=content.map(deck=>{
 const matching=ext=>paths.filter(p=>p.split('/').at(-1).startsWith(`${deck.number}.`)&&p.endsWith(ext));
 const md=matching('.md'),pdf=matching('.pdf');
 if(md.length!==1||pdf.length>1)throw new Error(`Ambiguous/missing source for deck ${deck.number}`);
 const record=pdf.length?extracted.find(r=>r.number===deck.number):null;
 if(pdf.length&&(!record||record.sha256!==hash(readFileSync(pdf[0]))))throw new Error(`PDF ${deck.number} changed; run extraction and review slide page references`);
 return {number:deck.number,markdown:relative(root,md[0]),markdownSha256:hash(readFileSync(md[0])),...(record||{pdf:null,pageCount:0,sha256:null,rasterDpi:null,ocr:false})};
});
const escape=s=>s.replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]));
function lines(s,max=18){const out=[];let line='',width=0;for(const c of s){const n=c.charCodeAt(0)>255?1:.57;if(width+n>max){out.push(line);line='';width=0;}line+=c;width+=n;}if(line)out.push(line);return out;}
function text(s,x,y,size=32,color='#182220',max=18){return `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="${color}">${lines(s,max).map((line,i)=>`<tspan x="${x}" dy="${i?size*1.5:0}">${escape(line)}</tspan>`).join('')}</text>`;}
function svg(deck,slide){
 const {kind,nodes}=slide.diagram;const positions=[[400,330],[1200,330],[400,680],[1200,680]];
 const link=(d,arrow=false)=>`<path d="${d}" fill="none" stroke="#A7803D" stroke-width="4" ${arrow?'marker-end="url(#arrow)"':''}/>`;
 let connections='';
 if(kind==='cycle')connections=link('M720 330 H875',true)+link('M1200 445 V550',true)+link('M880 680 H725',true)+link('M400 560 V450',true);
 if(kind==='flow')connections=link('M720 330 H875',true)+link('M1200 445 V500 H400 V555',true)+link('M720 680 H875',true);
 if(kind==='network')connections=link('M700 400 L800 500 L900 400 M800 500 L700 610 M800 500 L900 610');
 const boxes=nodes.map((node,i)=>{const [x,y]=positions[i];return `<g><rect x="${x-300}" y="${y-110}" width="600" height="220" rx="30" fill="${i===0?'#1B4D3E':'#FFFFFF'}" stroke="${i===0?'#1B4D3E':'#C5D0C4'}" stroke-width="2"/>${text(node.label,x,y-30,38,i===0?'#FFFFFF':'#182220',14)}${text(node.detail,x,y+45,29,i===0?'#FFFFFF':'#34443B',18)}</g>`;}).join('');
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000" role="img" aria-labelledby="title desc"><title id="title">${escape(slide.title)}</title><desc id="desc">${escape(nodes.map(n=>`${n.label}：${n.detail}`).join('；'))}。依來源重製的健康教育圖解。</desc><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0 10 5 0 10" fill="#A7803D"/></marker></defs><rect width="1600" height="1000" rx="36" fill="#FAF7F2"/><g font-family="-apple-system,BlinkMacSystemFont,'Noto Sans CJK TC','PingFang TC',sans-serif">${text(deck.title,800,80,28,'#34443B',40)}${text(slide.title,800,150,48,'#182220',29)}${connections}${boxes}${kind==='network'?`<circle cx="800" cy="500" r="65" fill="#EEE7D9"/>${text('一起理解',800,510,25,'#34443B')}`:''}<path d="M100 870 H1500" stroke="#CDD5CB" stroke-width="2"/>${text(kind==='compare'?'把不同角色放在一起，慢慢看懂。':'跟著生活中的比喻，一步一步讀懂身體。',800,920,26,'#34443B',55)}${text('依講座資料重製的生活圖解',800,967,22,'#34443B',55)}</g></svg>`;
}
const manifest=content.map(deck=>{
 const source=index.find(r=>r.number===deck.number),folder=`public/longevity-pdf-assets/deck-${deck.number}`;mkdirSync(folder,{recursive:true});
 const slides=deck.slides.map((slide,i)=>{
  if(slide.sourcePages.some(p=>!Number.isInteger(p)||p<1||p>source.pageCount))throw new Error(`Invalid PDF page ${slide.id}`);
  const path=`${folder}/slide-${String(i+1).padStart(2,'0')}.svg`;const art=svg(deck,slide);writeFileSync(path,art);
  return {...slide,image:`/${path.replace(/^public\//,'')}`,imageWidth:1600,imageHeight:1000,visualKind:'redrawn-svg',assetSha256:hash(art)};
 });
 return {...deck,pdfAvailable:!!source.pdf,originalPageCount:source.pageCount,sourceStatus:source.pdf?(source.ocr?'PDF 掃描頁與文稿校對重製':'PDF 與文稿校對重製'):'依文稿重製・PDF 尚未提供',slides};
});
writeFileSync('src/data/longevity-private-index.json',JSON.stringify(index,null,2)+'\n');
writeFileSync('src/data/longevity-decks-manifest.json',JSON.stringify(manifest,null,2)+'\n');
let synthesis='# 六套長壽醫學講座：來源校對與公開圖解\n\n此文件為可追溯的整理版本，不宣稱已驗證所有來源療效。原始 PDF 與 Markdown 保留署名；依使用者選擇，公開介面僅使用無講者署名的重製圖解，活動講師顯示林煒醫師，不將其他作者原話改署名。\n\n本次收到五份 PDF、六份 Markdown；第 2 套 PDF 尚未提供。五份 PDF 共 233 頁，包含一份 10 頁掃描圖文資料。文字層與 OCR 不是逐字校勘，圖像以原始檔為準。舊三套播放器已退休，僅保留來源存檔。\n\n校對要點：AA 形成 Lipoxins，EPA／DHA 形成其他部分 SPM 家族；LPC-DHA 不等同一般卵磷脂；MitoCORE 不是葡眾成品；DunedinPACE 不是個人生理年齡；單一 5R 個案亦有未改善指標。\n';
for(const deck of manifest){const source=index.find(r=>r.number===deck.number);synthesis+=`\n## 第 ${deck.number} 套：${deck.title}\n\n文稿：${source.markdown}\n文稿 SHA-256：${source.markdownSha256}\nPDF：${source.pdf||'尚未提供'}\nPDF SHA-256：${source.sha256||'無'}\n公開圖解：${deck.slides.length} 頁；${deck.sourceStatus}\n`;
 for(const slide of deck.slides)synthesis+=`\n### ${slide.id} ${slide.title}\n\n來源：${slide.sourcePages.length?'PDF 第 '+slide.sourcePages.join('、')+' 頁＋對應文稿':'既有文稿，未取得 PDF 頁碼'}\n\n${slide.summary}\n\n${slide.blocks.map(b=>`**${b.heading}**：${b.text}`).join('\n\n')}\n\n圖解：${slide.diagram.nodes.map(n=>n.label+'（'+n.detail+'）').join('；')}\n\n科學資料：${slide.science.summary}\n\n${slide.science.blocks.map(b=>b.heading+'：'+b.text).join('\n\n')}\n\n研究條件：${slide.science.note}\n\n產品閱讀對照：${slide.productIds.join('、')}。${slide.productNote}\n`;
}
writeFileSync('葡眾/longevity-6-lectures-source.md',synthesis);
console.log(`Prepared ${manifest.length} decks, ${manifest.reduce((n,d)=>n+d.slides.length,0)} public redrawn SVGs; ${index.filter(r=>r.pdf).length} private PDFs (${index.reduce((n,d)=>n+d.pageCount,0)} pages).`);
