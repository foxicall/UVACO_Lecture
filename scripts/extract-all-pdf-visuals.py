"""Publish scientific pages with speaker/organizer branding removed.

Private source PDFs remain byte-identical. Public PDFs, page images, thumbnails
and figure crops all come from the SAME redacted document, including PDF.js.
Run explicitly after a source/policy change; builds verify checked-in assets.
"""
from pathlib import Path
import hashlib, json, re, os, shutil
import fitz
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
POLICY_VERSION=3
NAMES=['歐瀚文','王偉全','歐忠儒','洪佳琪','劉士銘','王凱瑜','張詩帷','瀚仕']
PATTERN=re.compile('|'.join(r'[\s　]*'.join(name) for name in NAMES)+r'|REDOX\s*(?:MEDICAL\s*SUMMIT|HEALTH\s*GROUP)|Longevity Redefined',re.I)
META={
 'Precision_Health_Blueprint.pdf':('precision-health','人體營養藍圖','repair'),
 'Cellular_Repair_Engine.pdf':('cellular-repair','細胞修復齒輪','repair'),
 'Precision_Pain_Blueprint.pdf':('precision-pain','疼痛與身體照顧','autonomic'),
 'Nurturing Your Brain Forest.pdf':('brain-forest','大腦森林','neural'),
}
TITLES={1:'細胞能量與老化速率：粒線體代謝與氧化還原平衡',2:'排除環境促老毒素：黴菌毒素機制與 4D 引流排毒',3:'內分泌與神經類固醇網絡：壓力、代謝與大腦煞車機制',4:'發炎消退生物學：SPM 主動消退路徑與大腦髓鞘修復',5:'心血管與血管內皮代謝：脂蛋白品質、甲基化與微循環',6:'腦腸軸與免疫老化：腸道屏障、內毒素與 5R 修復方案'}
# Reviewed covers, speaker portraits, book/clinic promotions and event agendas.
OMIT={1:{1,2,7,8,9,10,11,12,13,14,15,16,84,86,87,88},3:set(),4:{1,2,36,37},5:{1,42,43},6:{1,2,3,4,55}}
# Only reviewed teaching diagrams are rasterized; never bulk-convert an upload.
KEY_PAGES={
 1:{29,32,37,44,45,46,47,50,51,53,55,57,59,60,61,64,75,76,79,80,83},
 3:set(range(1,11)),
 4:{5,6,9,11,14,17,21,23,26,29,31,33,35},
 5:{4,7,14,15,20,22,23,28,33,35,38,40},
 6:{5,6,9,10,12,13,14,15,17,19,20,22,23,26,28,30,31,33,36,39,40,46,49},
}
# Reviewed vector Form XObjects: the same central organizer watermark on each page.
WATERMARK_FORMS={4:{2836},5:{189},6:{4840}}
KEYWORDS={'repair':r'粒線體|甲基|修復|營養|代謝|能量|mitoch|methyl','neural':r'神經|大腦|認知|失智|腦|髓鞘|DHA|brain|neuro','inflammation':r'發炎|腸|免疫|屏障|毒素|菌|inflamm|gut|LPS','autonomic':r'壓力|睡眠|荷爾蒙|自律|疼痛|皮質醇|GABA|ALLO|cortisol|sleep'}
PRODUCTS={'995':r'995|永生福朗','360':r'360|餐包','huoyi':r'活逸康|猴頭','antrodia':r'樟芝益|牛樟芝','antrodia-drops':r'樟芝.*滴粒|滴粒','kanger':r'康爾喜(?![（(]?N)|益生菌|乳酸菌','kanger-n':r'康爾喜.*N|鳳梨酵素','kangyue':r'康悅兒|精神益生菌','kangbei':r'康貝寧|GABA|色胺酸','ningkang':r'寧康福','dikang':r'迪康|丹參','lisheng':r'力盛|黃耆'}
def sha(data):return hashlib.sha256(data).hexdigest()
def clean(text):return PATTERN.sub('',text)
def image_file(im,path,quality=88):
 path.parent.mkdir(parents=True,exist_ok=True)
 if im.mode not in ('RGB','RGBA'):im=im.convert('RGB')
 im.save(path,'WEBP',quality=quality,method=4)
 return {'image':'/'+str(path.relative_to(ROOT/'public')),'width':im.width,'height':im.height,'sha256':sha(path.read_bytes())}
def raster(page,path,clip=None,dpi=120):
 pix=page.get_pixmap(dpi=dpi,alpha=False,clip=clip)
 return image_file(Image.frombytes('RGB',[pix.width,pix.height],pix.samples),path)
def process(source):
 number=int(source.name[0]) if re.match(r'^[1-6]\.',source.name) else None
 slug,title,default=(f'longevity-{number}',TITLES[number],{1:'repair',3:'autonomic',4:'neural',5:'repair',6:'inflammation'}[number]) if number else META[source.name]
 source_hash=sha(source.read_bytes());doc=fitz.open(source)
 original_count=len(doc);omitted=OMIT.get(number,set());kept=[n for n in range(1,len(doc)+1) if n not in omitted and (not number or n in KEY_PAGES[number])]
 omitted=set(range(1,len(doc)+1))-set(kept)
 # Remove repeated logo images, preserving scientific figures and all background geometry.
 logos=set()
 if number:
  for p in doc:
   for info in p.get_images(full=True):
    for rect in p.get_image_rects(info[0]):
     if rect.y0<p.rect.height*.12 and rect.x0<p.rect.width*.18 and .04<rect.width/p.rect.width<.22 and rect.height/p.rect.height<.13:
      logos.add(info[0])
  for ref in logos:doc[0].delete_image(ref)
  for ref in WATERMARK_FORMS.get(number,set()):doc.update_stream(ref,b'')
  for p in doc:
   for block in p.get_text('dict')['blocks']:
    for line in block.get('lines',[]):
     if PATTERN.search(''.join(s['text'] for s in line['spans'])):
      r=fitz.Rect(line['bbox']);r.x0-=1;r.x1+=1
      p.add_redact_annot(r,fill=(.98,.97,.95))
   p.apply_redactions(images=2,graphics=0)
   for a in list(p.annots() or []):p.delete_annot(a)
   for link in p.get_links():p.delete_link(link)
 doc.select([n-1 for n in kept]);doc.set_metadata({'title':title,'subject':'科學圖解選編','author':'','creator':''});doc.set_toc([])
 out=ROOT/f'public/pdfs/{slug}.pdf';out.parent.mkdir(parents=True,exist_ok=True)
 doc.save(out,garbage=4,deflate=True);doc.close();doc=fitz.open(out)
 for folder in [ROOT/f'public/extracted-slides/{slug}',ROOT/f'public/extracted-figures/{slug}']:
  if folder.exists():shutil.rmtree(folder)
 pages=[];figures=[];seen={};legacy={}
 legacy_path=ROOT/f'葡眾/pdf-extracted/deck-{number}.md'
 if number and legacy_path.exists():
  for n,t in re.findall(r'## PDF 第 (\d+) 頁\s*\n(.*?)(?=\n## PDF 第|\Z)',legacy_path.read_text(),re.S):legacy[int(n)]=re.sub(r'^擷取方式：[^\n]*\n','',t).strip()
 for index,p in enumerate(doc):
  n=kept[index];pid=f'{slug}-{n:03}'
  rendered=raster(p,ROOT/f'public/extracted-slides/{slug}/page-{n:02}.webp')
  im=Image.open(ROOT/'public'/rendered['image'].lstrip('/'));im.thumbnail((360,240))
  thumb=ROOT/f'public/extracted-slides/{slug}/thumb-{n:02}.webp';image_file(im,thumb,76)
  text=clean(p.get_text().strip() or legacy.get(n,''))
  pillars=[key for key,pattern in KEYWORDS.items() if re.search(pattern,text,re.I)] or [default]
  products=[key for key,pattern in PRODUCTS.items() if re.search(pattern,text,re.I)]
  stages=[2]+([1] if re.search(r'%|盛行|症狀|風險|老化|疼痛|失眠',text) else [])+([3] if products else [])
  figure_ids=[]
  for info in p.get_images(full=True):
   ref,mask,w,h=info[:4]
   if w<48 or h<48:continue
   rects=[r & p.rect for r in p.get_image_rects(ref)]
   if not rects:continue
   rect=rects[0]
   if rect.is_empty or rect.width<20 or rect.height<20:continue
   full=rect.get_area()/p.rect.get_area()>.85
   # Decorative masters recur across many pages; whole-page scanned figures are retained.
   if full and len(p.get_text().strip())>40:continue
   key=(ref,tuple(round(v,1) for v in rect))
   if key in seen:
    f=figures[seen[key]];f['pages']=sorted(set(f['pages']+[n]));figure_ids.append(f['id']);continue
   fid=f'{slug}-fig-{len(figures)+1:03}'
   # Render the redacted page region, never an unredacted embedded XObject.
   f={'id':fid,'deckId':slug,'pages':[n],'kind':'page-image' if full else 'embedded-image','pillars':pillars,'stages':sorted(stages),'productIds':products,**raster(p,ROOT/f'public/extracted-figures/{slug}/fig-{len(figures)+1:03}.webp',clip=rect)}
   seen[key]=len(figures);figures.append(f);figure_ids.append(fid)
  pages.append({'id':pid,'deckId':slug,'pageNumber':n,'pdfPageNumber':index+1,**rendered,'thumbnail':'/'+str(thumb.relative_to(ROOT/'public')),'text':text,'textMethod':'reviewed-source','pillars':pillars,'stages':sorted(stages),'productIds':products,'figureIds':figure_ids})
  if (index+1)%15==0:print(f'{slug}: {index+1}/{len(doc)}',flush=True)
 result={'id':slug,'title':title,'sourceName':f'{slug}.pdf','sourceSha256':source_hash,'sha256':sha(out.read_bytes()),'fileUrl':f'/pdfs/{slug}.pdf','sourceKind':'edited-pdf','originalPageCount':original_count,'excludedPages':sorted(omitted),'pageCount':len(pages),'dpi':120,'pages':pages,'figures':figures}
 doc.close()
 print(f'{slug}: {len(pages)} reviewed key pages; {len(omitted)} pages excluded from public selection',flush=True)
 return result
def process_markdown():
 # Topic two has a manuscript, not an uploaded PDF. Publish explicitly redrawn
 # diagrams instead of labelling another person's PDF as the missing source.
 content=json.loads((ROOT/'src/data/longevity-content.json').read_text())[1]
 source=next((ROOT/'葡眾/lectures').glob('2.*.md'))
 slug='longevity-2';doc=fitz.open()
 for i in range(1,5):
  svg=ROOT/f'public/longevity-pdf-assets/deck-2/slide-{i:02}.svg'
  page=fitz.open(stream=svg.read_bytes(),filetype='svg')
  converted=fitz.open(stream=page.convert_to_pdf(),filetype='pdf')
  doc.insert_pdf(converted);converted.close();page.close()
 out=ROOT/f'public/pdfs/{slug}.pdf'
 doc.set_metadata({'title':TITLES[2],'subject':'依文稿重製的科學圖解','author':''})
 doc.save(out,garbage=4,deflate=True);doc.close();doc=fitz.open(out)
 pages=[]
 for i,p in enumerate(doc):
  n=i+1;slide=content['slides'][i]
  rendered=raster(p,ROOT/f'public/extracted-slides/{slug}/page-{n:02}.webp')
  im=Image.open(ROOT/'public'/rendered['image'].lstrip('/'));im.thumbnail((360,240))
  thumb=ROOT/f'public/extracted-slides/{slug}/thumb-{n:02}.webp';image_file(im,thumb,76)
  pages.append({'id':f'{slug}-{n:03}','deckId':slug,'pageNumber':n,'pdfPageNumber':n,**rendered,'thumbnail':'/'+str(thumb.relative_to(ROOT/'public')),'text':clean(slide['summary']+' '+slide['science']['summary']),'textMethod':'redrawn-markdown','pillars':['inflammation'],'stages':[i+1 if i<2 else 3],'productIds':slide['productIds'],'figureIds':[]})
 doc.close()
 return {'id':slug,'title':TITLES[2],'sourceName':'主題二文稿重製圖解','sourceSha256':sha(source.read_bytes()),'sha256':sha(out.read_bytes()),'fileUrl':f'/pdfs/{slug}.pdf','sourceKind':'redrawn-markdown','originalPageCount':0,'excludedPages':[],'pageCount':4,'dpi':120,'pages':pages,'figures':[]}

if __name__=='__main__':
 sources=list((ROOT/'葡眾/lectures-pdf').glob('*.pdf'))+list((ROOT/'葡眾/visual-pdf').glob('*.pdf'))
 # One page and one document at a time bounds peak raster memory.
 decks=[process(source) for source in sources]
 decks.append(process_markdown())
 decks.sort(key=lambda d:(not d['id'].startswith('longevity'),d['id']))
 (ROOT/'src/data/pdf-source-index.json').write_text(json.dumps({'publication':'anonymized-science','policyVersion':POLICY_VERSION,'decks':decks},ensure_ascii=False,indent=2)+'\n')
 print(f'Published {sum(d["pageCount"] for d in decks)} scientific pages from {len(decks)} private originals.')
