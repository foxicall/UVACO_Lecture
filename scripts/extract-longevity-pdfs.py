"""Private PDF verification artifacts. Public slides are separately redrawn SVGs."""
from pathlib import Path
import concurrent.futures, hashlib, json, os, subprocess
import fitz

root=Path(__file__).resolve().parents[1]
cache=root/'.longevity-extracted'
cache.mkdir(exist_ok=True)
TESSDATA=Path(os.environ.get('UVACO_TESSDATA','/tmp/uvaco-tessdata'))
records=[]
for pdf in sorted((root/'葡眾/lectures-pdf').glob('*.pdf')):
    number=int(pdf.name.split('.')[0]); doc=fitz.open(pdf)
    target=cache/f'deck-{number}'; target.mkdir(exist_ok=True)
    pages=[]
    for index,page in enumerate(doc):
        path=target/f'page-{index+1:03}.png'
        if not path.exists(): page.get_pixmap(dpi=180).save(path)
        pages.append({'page':index+1,'text':page.get_text(),'method':'PDF text layer','image':str(path.relative_to(root))})
    if all(not page['text'].strip() for page in pages):
        if not (TESSDATA/'chi_tra.traineddata').exists(): raise RuntimeError('Scanned PDF requires Traditional Chinese OCR data via UVACO_TESSDATA')
        def ocr(page):
            text_path=target/f"page-{page['page']:03}.ocr.txt"
            if not text_path.exists():
                result=subprocess.run(['tesseract',str(root/page['image']),'stdout','--tessdata-dir',str(TESSDATA),'-l','chi_tra+eng','--psm','3'],env={**os.environ,'OMP_THREAD_LIMIT':'1'},capture_output=True,text=True,check=True)
                text_path.write_text(result.stdout)
            return {**page,'text':text_path.read_text(),'method':'Traditional Chinese OCR; verify against PDF'}
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool: pages=list(pool.map(ocr,pages))
    digest=hashlib.sha256(pdf.read_bytes()).hexdigest()
    text=f'# 第 {number} 套 PDF 文字擷取\n\n原始檔案：{pdf.name}\nSHA-256：{digest}\n頁數：{len(doc)}\n\n文字層與 OCR 擷取僅供檢索，不等同逐字校勘。圖像中的箭頭、數值與版面以原始 PDF 為準。來源的說法不是產品療效或居家處方。\n\n'
    text+='\n\n'.join(f"## PDF 第 {page['page']} 頁\n\n擷取方式：{page['method']}\n\n{page['text']}" for page in pages)
    (root/f'葡眾/pdf-extracted/deck-{number}.md').write_text(text)
    (cache/f'deck-{number}.json').write_text(json.dumps(pages,ensure_ascii=False,indent=2))
    records.append({'number':number,'pdf':str(pdf.relative_to(root)),'sha256':digest,'pageCount':len(pages),'rasterDpi':180,'ocr':any('OCR' in page['method'] for page in pages)})
    print(f'Deck {number}: {len(pages)} pages extracted privately',flush=True)
(cache/'pdf-index.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
