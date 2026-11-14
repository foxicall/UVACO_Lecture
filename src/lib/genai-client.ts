import { GoogleGenAI } from '@google/genai';
import { EnvHttpProxyAgent, setGlobalDispatcher } from 'undici';

// The cloud secret binding is resolved by its HTTPS proxy, never in browser code.
if (process.env.HTTPS_PROXY || process.env.HTTP_PROXY || process.env.https_proxy) {
  setGlobalDispatcher(new EnvHttpProxyAgent());
}
export function genaiClient() {
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is required');
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}
