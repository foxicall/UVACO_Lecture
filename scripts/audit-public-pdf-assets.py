"""Audit edited PDFs and optionally OCR their published rasters, one at a time.
Use --ocr with UVACO_TESSDATA set to a folder containing chi_tra and eng models.
This is an explicit review tool; production builds never run OCR or conversions.
"""
from pathlib import Path
import fitz,json,re,subprocess,sys,os
root=Path(__file__).resolve().parents[1]
policy=json.loads((root/'scripts/source-redaction-policy.json').read_text())
pattern=re.compile('|'.join([r'\s*'.join(x) for x in policy['names']]+[re.escape(p).replace(r'\ ',r'\s*') for p in policy['phrases']]),re.I)
manifest=json.loads((root/'src/data/visual-assets-manifest.json').read_text())
hits=[];checked=0
for deck in manifest['decks']:
 with fitz.open(root/'public'/deck['fileUrl'].lstrip('/')) as doc:
  assert len(doc)==deck['pageCount'],deck['id']
  for page in doc:
   if pattern.search(page.get_text()):hits.append({'deck':deck['id'],'pdfPage':page.number+1,'kind':'text'})
 if '--ocr' not in sys.argv:continue
 for page in deck['pages']:
  result=subprocess.run(['tesseract',str(root/'public'/page['image'].lstrip('/')),'stdout','--tessdata-dir',os.environ.get('UVACO_TESSDATA','/tmp/uvaco-tessdata'),'-l','chi_tra+eng','--psm','3'],capture_output=True,text=True,check=True,env={**os.environ,'OMP_THREAD_LIMIT':'1'})
  found=pattern.findall(result.stdout)
  if found:hits.append({'pageId':page['id'],'kind':'raster','matches':found})
  checked+=1
  if checked%20==0:print(f'OCR audited {checked} pages',flush=True)
(root/'test-results').mkdir(exist_ok=True)
(root/'test-results/pdf-anonymity-audit.json').write_text(json.dumps({'pdfs':len(manifest['decks']),'ocrPages':checked,'hits':hits},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'pdfs':len(manifest['decks']),'ocrPages':checked,'hits':hits},ensure_ascii=False),flush=True)
if hits:sys.exit(1)
