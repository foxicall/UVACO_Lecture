'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUp, Mic, Square } from 'lucide-react';
import Dialog from './Dialog';
import { answerSchema, localReadingRoute, presets, type ConciergeAnswer } from '@/lib/concierge';
import { readEvents } from '@/lib/sse';
import { productById } from '@/data/uvaco-products';
import { sitePath, staticSite } from '@/lib/site';

interface Recognition {
  lang: string; interimResults: boolean; continuous: boolean;
  onresult: ((event: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null;
  onerror: (() => void) | null; onend: (() => void) | null;
  start(): void; stop(): void;
}
type SpeechWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
export default function Concierge({ onClose, onNavigate }: { onClose: () => void; onNavigate: (answer: ConciergeAnswer) => void }) {
  const [question, setQuestion] = useState('');
  const [sentences, setSentences] = useState<string[]>([]);
  const [answer, setAnswer] = useState<ConciergeAnswer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [listening, setListening] = useState(false);
  const [voice, setVoice] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const recognition = useRef<Recognition | null>(null);
  const busy = useRef(false);
  useEffect(() => {
    const w = window as SpeechWindow;
    setVoice(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition));
    return () => { abort.current?.abort(); recognition.current?.stop(); };
  }, []);
  async function ask(text: string) {
    if (busy.current || text.trim().length < 2) return;
    if (staticSite) {
      recognition.current?.stop(); setQuestion(text); setError('');
      const local = localReadingRoute(text);
      setSentences(local.sentences); setAnswer(local); onNavigate(local);
      return;
    }
    busy.current = true; recognition.current?.stop();
    setQuestion(text); setLoading(true); setError(''); setSentences([]); setAnswer(null);
    const request = new AbortController(); abort.current = request;
    const timer = setTimeout(() => request.abort(), 55_000);
    let completed = false;
    try {
      const res = await fetch(sitePath('/api/concierge'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: text }), signal: request.signal });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error ?? '服務暫時無法連線。'); }
      if (!res.body) throw new Error('未收到回答，請重試。');
      await readEvents(res.body, (event, payload) => {
        if (event === 'sentence' && typeof payload === 'object' && payload && 'text' in payload && typeof payload.text === 'string') setSentences(s => [...s, payload.text as string]);
        if (event === 'error') throw new Error((payload as { message: string }).message);
        if (event === 'done') {
          const result = answerSchema.parse(payload);
          completed = true; setSentences(result.sentences); setAnswer(result); onNavigate(result);
        }
      });
      if (!completed) throw new Error('回答中斷了，請再試一次。');
    } catch (e) {
      if (!completed) { setSentences([]); setError(request.signal.aborted ? '已停止這次詢問，您可以重新提問。' : e instanceof Error ? e.message : '服務暫時無法連線。'); }
    } finally { clearTimeout(timer); setLoading(false); busy.current = false; }
  }
  function speak() {
    if (listening) { recognition.current?.stop(); return; }
    const w = window as SpeechWindow;
    const Constructor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Constructor) return;
    const r = new Constructor(); recognition.current = r;
    r.lang = 'zh-TW'; r.interimResults = false; r.continuous = false;
    r.onresult = event => { setQuestion(event.results[0][0].transcript.slice(0, 300)); setListening(false); };
    r.onerror = () => { setListening(false); setError('無法使用麥克風，您可以直接點選問題或打字。'); };
    r.onend = () => setListening(false);
    try { r.start(); setListening(true); } catch { setError('語音辨識無法啟動，請使用文字輸入。'); }
  }
  return <Dialog title="健康小幫手" className="concierge-dialog" onClose={onClose}>
    <p className="concierge-intro">一起認識，身體需要的照顧。</p>
    <p className="small-copy">從吃飯、休息到身體的感受，我陪您一站一站看懂。</p>
    {staticSite && <p className="small-copy">此公開版本提供本機文件導覽，這不是 AI 回答。點選問題，就能閱讀相關資料。</p>}
    <div className="preset-list">{presets.map(p => <button disabled={loading} onClick={() => ask(p)} key={p}>{p}<span aria-hidden>↗</span></button>)}</div>
    <form onSubmit={e => { e.preventDefault(); ask(question); }}>
      <label htmlFor="health-question">您的問題</label>
      <textarea id="health-question" maxLength={300} rows={3} value={question} onChange={e => setQuestion(e.target.value)} placeholder="例如：想了解腸道與日常飲食" disabled={loading} aria-describedby="privacy-note" />
      <div className="question-actions">{voice && <button type="button" onClick={speak} disabled={loading} aria-pressed={listening}><Mic size={20} />{listening ? '停止錄音' : '用說的'}</button>}{loading ? <button type="button" onClick={() => abort.current?.abort()}><Square size={18} />停止詢問</button> : <button className="primary" type="submit" disabled={question.trim().length < 2}><ArrowUp size={22} />{staticSite ? '查看導覽' : '送出問題'}</button>}</div>
    </form>
    <p id="privacy-note" className="small-copy">{staticSite ? '文字由本機文件導覽處理，不會傳送至 AI。若使用語音輸入，語音由瀏覽器的辨識服務處理；請勿輸入姓名、電話或病歷。' : '送出後，問題會傳至 Google Gemini。請勿輸入姓名、電話或病歷；語音由瀏覽器辨識，文字可先修改再送出。'}</p>
    <div aria-live="polite" aria-busy={loading} className="ai-answer">
      {loading && <p className="loading-text">正在為您整理資訊…</p>}
      {error && <><p role="alert">{error}</p><button onClick={() => { const local = localReadingRoute(question); setSentences(local.sentences); setAnswer(local); setError(''); onNavigate(local); }}>改看本機文件導覽</button></>}
      {sentences.map((s, i) => <p key={i}>{s}</p>)}
      {answer && answer.targetProductIds.length > 0 && <div className="answer-islands"><p className="small-copy">已找到相關產品，點一站看看配方。</p>{answer.targetProductIds.map(id => <button key={id} onClick={() => { onNavigate({ ...answer, targetProductIds: [id, ...answer.targetProductIds.filter(i => i !== id)] }); onClose(); }}>{productById.get(id)?.name} →</button>)}</div>}
    </div>
  </Dialog>;
}
