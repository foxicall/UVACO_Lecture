"""Render every unique source PDF, retaining original bytes and page/figure provenance.

Run: python scripts/extract-all-pdf-visuals.py
Dependencies: PyMuPDF, Pillow; optional tesseract chi_tra+eng for scanned pages.
Checked-in assets make production builds independent of Python/OCR availability.
"""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import hashlib, json, re, os, shutil, subprocess, io
import fitz
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SKIP = {'.git', 'node_modules', '.next', '.next-dev', '.next-pages', 'out', '.longevity-extracted', 'test-results', '.visual-cache'}
CACHE = ROOT / '.visual-cache'
CACHE.mkdir(exist_ok=True)
TESSDATA = Path(os.environ.get('UVACO_TESSDATA', '/tmp/uvaco-tessdata'))
META = {
 'Precision_Health_Blueprint.pdf': ('precision-health', '人體營養藍圖', 'repair'),
 'Cellular_Repair_Engine.pdf': ('cellular-repair', '細胞修復齒輪', 'repair'),
 'Precision_Pain_Blueprint.pdf': ('precision-pain', '疼痛與身體照顧', 'autonomic'),
 'Nurturing Your Brain Forest.pdf': ('brain-forest', '大腦森林', 'neural'),
}
LEGACY = {1:('體力與老化','repair'),2:('環境與健康','inflammation'),3:('荷爾蒙與壓力','autonomic'),4:('大腦與發炎','neural'),5:('代謝與長壽','repair'),6:('腸腦與免疫','inflammation')}
KEYWORDS = {'repair':r'粒線體|甲基|修復|營養|代謝|蛋白|能量|mitoch|methyl', 'neural':r'神經|大腦|認知|失智|腦|髓鞘|DHA|brain|neuro', 'inflammation':r'發炎|腸|免疫|屏障|毒素|菌|inflamm|gut|LPS', 'autonomic':r'壓力|睡眠|荷爾蒙|自律|疼痛|皮質醇|GABA|ALLO|cortisol|sleep'}
PRODUCTS = {'995':r'995|永生福朗', '360':r'360|餐包', 'huoyi':r'活逸康|猴頭', 'antrodia':r'樟芝益|牛樟芝', 'antrodia-drops':r'樟芝.*滴粒|滴粒', 'kanger':r'康爾喜(?![（(]?N)|益生菌|乳酸菌', 'kanger-n':r'康爾喜.*N|鳳梨酵素', 'kangyue':r'康悅兒|精神益生菌', 'kangbei':r'康貝寧|GABA|色胺酸', 'ningkang':r'寧康福', 'dikang':r'迪康|丹參', 'lisheng':r'力盛|黃耆'}
def sha(data): return hashlib.sha256(data).hexdigest()
def walk():
 for folder, dirs, files in os.walk(ROOT):
  dirs[:] = [d for d in dirs if d not in SKIP]
  for name in files:
   if name.lower().endswith('.pdf'): yield Path(folder)/name
def write_image(im, path, quality=88):
 path.parent.mkdir(parents=True,exist_ok=True)
 if im.mode not in ('RGB','RGBA'): im=im.convert('RGB')
 im.save(path,'WEBP',quality=quality,method=5)
 return {'image':'/'+str(path.relative_to(ROOT/'public')), 'width':im.width, 'height':im.height, 'sha256':sha(path.read_bytes())}
def process(item):
 source,digest=item
 number=int(source.name.split('.')[0]) if re.match(r'^[1-6]\.',source.name) else None
 if source.name in META: slug,title,default=META[source.name]
 elif number: title,default=LEGACY[number];slug=f'longevity-{number}'
 else: slug='source-'+digest[:12]; title=source.stem;default='repair'
 pdf_out=ROOT/'public/pdfs'/f'{slug}.pdf';pdf_out.parent.mkdir(parents=True,exist_ok=True)
 if not pdf_out.exists() or sha(pdf_out.read_bytes())!=digest:shutil.copyfile(source,pdf_out)
 marker=CACHE/f'{slug}.json'
 if marker.exists():
  cached=json.loads(marker.read_text())
  if cached['sha256']==digest and all((ROOT/'public'/p['image'].lstrip('/')).exists() and (ROOT/'public'/p['thumbnail'].lstrip('/')).exists() for p in cached['pages']) and all((ROOT/'public'/f['image'].lstrip('/')).exists() for f in cached['figures']):
   print(f'{slug}: cached {len(cached["pages"])} pages',flush=True);return cached
 doc=fitz.open(source);pages=[];figures=[];seen={}
 legacy={}
 if number and (ROOT/f'葡眾/pdf-extracted/deck-{number}.md').exists():
  raw=(ROOT/f'葡眾/pdf-extracted/deck-{number}.md').read_text()
  for p,t in re.findall(r'## PDF 第 (\d+) 頁\s*\n(.*?)(?=\n## PDF 第|\Z)',raw,re.S):legacy[int(p)]=re.sub(r'^擷取方式：[^\n]*\n','',t).strip()
 for i,page in enumerate(doc):
  n=i+1;page_id=f'{slug}-{n:03}';pix=page.get_pixmap(dpi=200,alpha=False)
  im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
  rendered=write_image(im,ROOT/f'public/extracted-slides/{slug}/page-{n:02}.webp')
  thumb=im.copy();thumb.thumbnail((360,240));thumb_path=ROOT/f'public/extracted-slides/{slug}/thumb-{n:02}.webp';write_image(thumb,thumb_path,76)
  text=page.get_text().strip() or legacy.get(n,'');method='text-layer' if page.get_text().strip() else 'existing-ocr'
  if not text and (TESSDATA/'chi_tra.traineddata').exists():
   temp=CACHE/f'{page_id}.png';im.resize((1920,round(im.height*1920/im.width))).save(temp)
   ocr=subprocess.run(['tesseract',str(temp),'stdout','--tessdata-dir',str(TESSDATA),'-l','chi_tra+eng','--psm','3'],capture_output=True,text=True,check=True,env={**os.environ,'OMP_THREAD_LIMIT':'1'})
   text=ocr.stdout.strip();temp.unlink();method='ocr'
  pillars=[p for p,regex in KEYWORDS.items() if re.search(regex,text,re.I)] or [default]
  product_ids=[p for p,regex in PRODUCTS.items() if re.search(regex,text,re.I)]
  stages=[2]
  if re.search(r'%|盛行|症狀|風險|餘命|老化|疼痛|失眠',text):stages.append(1)
  if product_ids:stages.append(3)
  figure_ids=[]
  for info in page.get_images(full=True):
   xref,mask,w,h=info[:4]
   if w<48 or h<48:continue
   if xref in seen:
    fig=figures[seen[xref]]
    if n not in fig['pages']:fig['pages'].append(n)
    fig['pillars']=sorted(set(fig['pillars']+pillars));fig['stages']=sorted(set(fig['stages']+stages));fig['productIds']=sorted(set(fig['productIds']+product_ids))
    figure_ids.append(fig['id']);continue
   pic=fitz.Pixmap(doc,xref)
   if mask and not pic.alpha:pic=fitz.Pixmap(pic,fitz.Pixmap(doc,mask))
   if pic.colorspace and pic.colorspace.n!=3:pic=fitz.Pixmap(fitz.csRGB,pic)
   figure_im=Image.open(io.BytesIO(pic.tobytes('png')))
   fid=f'{slug}-fig-{len(figures)+1:03}'
   rects=page.get_image_rects(xref);full=any(r.width*r.height>page.rect.width*page.rect.height*.85 for r in rects)
   f={'id':fid,'deckId':slug,'pages':[n], 'kind':'page-image' if full else 'embedded-image','xref':xref,'pillars':pillars[:],'stages':stages[:],'productIds':product_ids[:],**write_image(figure_im,ROOT/f'public/extracted-figures/{slug}/fig-{len(figures)+1:03}.webp',90)}
   seen[xref]=len(figures);figures.append(f);figure_ids.append(fid)
  pages.append({'id':page_id,'deckId':slug,'pageNumber':n,**rendered,'thumbnail':'/'+str(thumb_path.relative_to(ROOT/'public')),'text':text,'textMethod':method,'pillars':pillars,'stages':sorted(stages),'productIds':product_ids,'figureIds':figure_ids})
  if n%10==0:print(f'{slug}: {n}/{len(doc)}',flush=True)
 result={'id':slug,'title':title,'sourceName':source.name,'sourcePath':str(source.relative_to(ROOT)),'sha256':digest,'fileUrl':f'/pdfs/{slug}.pdf','pageCount':len(doc),'dpi':200,'pages':pages,'figures':figures}
 marker.write_text(json.dumps(result,ensure_ascii=False));print(f'{slug}: complete {len(pages)} pages / {len(figures)} unique images',flush=True);return result

if __name__=='__main__':
 unique={}
 for p in sorted(walk(),key=lambda p:('public' in p.parts,str(p))):unique.setdefault(sha(p.read_bytes()),p)
 with ThreadPoolExecutor(max_workers=3) as pool:decks=list(pool.map(process,[(p,d) for d,p in unique.items()]))
 decks.sort(key=lambda d:(not d['id'].startswith('longevity'),d['id']))
 (ROOT/'src/data/pdf-source-index.json').write_text(json.dumps({'decks':decks},ensure_ascii=False,indent=2)+'\n')
 print(f'Total: {len(decks)} unique PDFs / {sum(d["pageCount"] for d in decks)} pages / {sum(len(d["figures"]) for d in decks)} images',flush=True)
