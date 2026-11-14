export async function readEvents(body: ReadableStream<Uint8Array>, receive: (event: string, data: unknown) => void) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      let end: number;
      while ((end = buffer.indexOf('\n\n')) !== -1) {
        const frame = buffer.slice(0, end); buffer = buffer.slice(end + 2);
        const event = frame.split('\n').find(l => l.startsWith('event: '))?.slice(7);
        const data = frame.split('\n').filter(l => l.startsWith('data: ')).map(l => l.slice(6)).join('\n');
        if (event && data) receive(event, JSON.parse(data));
      }
      if (done) break;
      if (buffer.length > 30_000) throw new Error('回應格式不正確，請重試。');
    }
  } finally { reader.releaseLock(); }
}
