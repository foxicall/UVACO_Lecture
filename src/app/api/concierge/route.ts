import { genaiClient } from '@/lib/genai-client';
import { z } from 'zod';
import { answerSchema, completedSentences, isUrgent, MODELS, requestSchema, systemInstruction, urgentAnswer } from '@/lib/concierge';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Bounded per-instance abuse protection. Deployments can add a shared gateway limiter.
const traffic: number[] = [];
let active = 0;
const response = (message: string, status: number) => Response.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } });
export async function POST(req: Request) {
  const origin = req.headers.get('origin');
  if (origin && origin !== new URL(req.url).origin) return response('請從本站開啟健康小幫手。', 403);
  if (!req.headers.get('content-type')?.includes('application/json')) return response('請使用文字問題。', 415);
  let question: string;
  try {
    const reader = req.body?.getReader();
    if (!reader) return response('請輸入問題。', 400);
    let size = 0;
    const parts: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > 2048) { await reader.cancel(); return response('問題請控制在 300 字以內。', 413); }
      parts.push(value);
    }
    question = requestSchema.parse(JSON.parse(Buffer.concat(parts).toString('utf8'))).question;
  } catch { return response('請輸入 2 到 300 字的問題。', 400); }
  const now = Date.now();
  while (traffic.length && traffic[0] < now - 60_000) traffic.shift();
  if (traffic.length >= 20 || active >= 4) return response('目前詢問較多，請稍候一分鐘再試。', 429);
  if (!isUrgent(question) && !process.env.GEMINI_API_KEY) return response('健康小幫手尚未連接服務，您仍可使用產品導覽。', 503);
  traffic.push(now); active++;
  const abort = new AbortController();
  const cancel = () => abort.abort();
  req.signal.addEventListener('abort', cancel, { once: true });
  const timeout = setTimeout(cancel, 45_000);
  const encoder = new TextEncoder();
  const body = new ReadableStream({
    async start(controller) {
      const emit = (type: string, data: unknown) => {
        if (!abort.signal.aborted) controller.enqueue(encoder.encode(`event: ${type}\ndata: ${JSON.stringify(data)}\n\n`));
      };
      try {
        if (isUrgent(question)) {
          urgentAnswer.sentences.forEach(text => emit('sentence', { text }));
          emit('done', urgentAnswer); return;
        }
        const ai = genaiClient();
        const stream = await ai.models.generateContentStream({
          model: MODELS.concierge, contents: question,
          config: { systemInstruction, temperature: 0.25, maxOutputTokens: 2048, responseMimeType: 'application/json', responseJsonSchema: z.toJSONSchema(answerSchema), abortSignal: abort.signal },
        });
        let buffer = ''; let sent = 0;
        for await (const chunk of stream) {
          if (abort.signal.aborted) break;
          buffer += chunk.text ?? '';
          if (buffer.length > 20_000) throw new Error('Invalid response');
          const completed = completedSentences(buffer);
          while (sent < completed.length) emit('sentence', { text: completed[sent++] });
        }
        if (abort.signal.aborted) throw new Error('Timeout');
        const answer = answerSchema.parse(JSON.parse(buffer));
        emit('done', { ...answer, targetProductIds: [...new Set(answer.targetProductIds)] });
      } catch (error) {
        const status = typeof error === 'object' && error !== null && 'status' in error ? error.status : null;
        const message = status === 404 ? '指定的 Gemini 3.8 Flash 目前無法使用；未改用其他模型。' : status === 429 ? 'AI 服務目前忙碌，請稍候再試。' : '這次未能完成回答，請稍後重試；您仍可繼續島嶼導覽。';
        // No prompt, key, provider body or personal health question enters logs.
        if (!req.signal.aborted) controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ message })}\n\n`));
      } finally {
        clearTimeout(timeout); req.signal.removeEventListener('abort', cancel); active--;
        try { controller.close(); } catch { /* Client may have closed the stream. */ }
      }
    },
    cancel() { abort.abort(); },
  });
  return new Response(body, { headers: { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache, no-store, no-transform', 'X-Accel-Buffering': 'no' } });
}
