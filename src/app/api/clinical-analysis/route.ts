import { clinicalRequestSchema, clinicalPlan, localClinicalAnalysis } from '@/lib/clinical-analysis';
import { analyzeAndRecommendWithWebSearch } from '@/services/geminiClinicalEngine';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=60;
const traffic:number[]=[];
let active=0;
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function POST(req:Request) {
  const url=new URL(req.url), origin=req.headers.get('origin');
  const proxyProtocol=req.headers.get('x-forwarded-proto')?.split(',')[0].trim();
  const protocol=proxyProtocol==='https'||proxyProtocol==='http' ? `${proxyProtocol}:` : url.protocol;
  if (origin && origin!==`${protocol}//${req.headers.get('host')||url.host}`) return json({error:'請從本站開啟分析。'},403);
  if (!req.headers.get('content-type')?.includes('application/json')) return json({error:'請使用本站問題表單。'},415);
  let input;
  try {
    const reader=req.body?.getReader(); if (!reader) return json({error:'請選擇關注主題。'},400);
    const chunks:Uint8Array[]=[]; let bytes=0;
    while(true){const {value,done}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>4096){await reader.cancel();return json({error:'內容過長，請縮短問題。'},413);}chunks.push(value);}
    input=clinicalRequestSchema.parse(JSON.parse(Buffer.concat(chunks).toString('utf8')));
  }catch{return json({error:'請選擇有效主題，問題限300字以內。'},400);}
  const plan=clinicalPlan(input);
  if (plan.review!=='general') return json(localClinicalAnalysis(input,'文件整理・先確認醫療需求'));
  const now=Date.now();while(traffic.length&&traffic[0]<now-60000)traffic.shift();
  if(active>=2||traffic.length>=12)return json({error:'目前詢問較多，請稍後重試；文件導覽仍可使用。'},429);
  if(!process.env.GEMINI_API_KEY)return json(localClinicalAnalysis(input,'目前未連接AI・以下為文件整理'));
  traffic.push(now);active++;
  const controller=new AbortController();const cancel=()=>controller.abort();
  req.signal.addEventListener('abort',cancel,{once:true});
  if(req.signal.aborted)controller.abort();
  const timer=setTimeout(cancel,55000);
  try {
    return json(await analyzeAndRecommendWithWebSearch(input.question||'請依我選的生活困擾，對照機轉與產品原料。',{input,signal:controller.signal}));
  }catch {
    // No health question, provider response or credential is logged.
    return json(localClinicalAnalysis(input,'此次AI搜尋未完成・以下為文件整理，未切換模型'));
  }finally{clearTimeout(timer);req.signal.removeEventListener('abort',cancel);active--;}
}
