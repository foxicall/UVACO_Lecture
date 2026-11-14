import type { GenerateContentResponse } from '@google/genai';

export function safeCitationUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password || !url.hostname.includes('.') || /^(localhost|127\.|10\.|192\.168\.|169\.254\.)/.test(url.hostname)) return null;
    return url.href;
  } catch { return null; }
}
export function extractGrounding(response: GenerateContentResponse) {
  const metadata = response.candidates?.[0]?.groundingMetadata;
  const citations: { title: string; url: string }[] = [];
  for (const chunk of metadata?.groundingChunks ?? []) {
    const url = chunk.web?.uri && safeCitationUrl(chunk.web.uri);
    if (url && !citations.some(c => c.url === url)) citations.push({ title: (chunk.web?.title || new URL(url).hostname).slice(0,180), url });
  }
  return {
    citations: citations.slice(0,12), queries: (metadata?.webSearchQueries ?? []).filter(q => typeof q === 'string').slice(0,6),
    supportCount: metadata?.groundingSupports?.length ?? 0,
    // Provider HTML is isolated in a script-free, opaque-origin sandbox in the UI.
    searchEntryHtml: metadata?.searchEntryPoint?.renderedContent?.slice(0,100000) ?? '',
    searched: !!metadata?.webSearchQueries?.length && citations.length > 0,
  };
}
