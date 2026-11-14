import { genaiClient } from '../src/lib/genai-client';
import { mkdir, rename, writeFile, readFile } from 'node:fs/promises';
import { z } from 'zod';
import { products } from '../src/data/uvaco-products';
import { MODELS } from '../src/lib/concierge';
import { validateSvg, visualSchema } from '../src/lib/visuals';

async function main() {
  try {
    const saved = JSON.parse(await readFile('src/data/generated-visuals.json', 'utf8'));
    if (saved.provenance.model === MODELS.visuals && saved.visuals.length === 12 && !process.argv.includes('--refresh')) {
      saved.visuals.forEach((v: unknown) => validateSvg(visualSchema.parse(v).svg));
      console.log('Using validated Gemini 3.8 Pro artwork cache.'); return;
    }
  } catch { /* Recreate missing or invalid cache. */ }
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is required. No alternate model is permitted.');
  const ai = genaiClient();
  await ai.models.get({ model: MODELS.visuals });
  const visuals = [];
  for (const product of products) {
    const result = await ai.models.generateContent({
      model: MODELS.visuals,
      contents: `Create an intricate editorial botanical SVG illustration for ${product.name}: ${product.motif}. 600x600 viewBox, transparent background, rice paper #FAF7F2, pine #1B4D3E, gold #D97706 and teal #1E4E5F. Bespoke multilayer shapes, fine engraved branches, generous negative space; no text, no logos, no external resources, scripts, filters, CSS, images or animation. Only svg,g,path,circle,ellipse,rect,line,polyline,polygon,defs,clipPath,linearGradient,radialGradient,stop,title,desc tags. SVG must use xmlns http://www.w3.org/2000/svg. id must equal ${product.id}. metaphor: one warm zh-TW visual metaphor, no medical efficacy claims. Return safe numerical GLSL water amplitude, speed and glow intensity parameters with the SVG.`,
      config: { responseMimeType: 'application/json', responseJsonSchema: z.toJSONSchema(visualSchema), maxOutputTokens: 16000, abortSignal: AbortSignal.timeout(120_000) },
    });
    const item = visualSchema.parse(JSON.parse(result.text ?? ''));
    if (item.id !== product.id) throw new Error('Unexpected product id');
    item.svg = validateSvg(item.svg);
    visuals.push(item);
    console.log(`Validated artwork: ${product.name}`);
  }
  // Atomic manifest replacement: a failed generation never destroys the working art set.
  await mkdir('src/data', { recursive: true });
  const manifest = { provenance: { provider: 'Gemini', model: MODELS.visuals, createdAt: new Date().toISOString() }, visuals };
  await writeFile('src/data/generated-visuals.json.tmp', JSON.stringify(manifest, null, 2));
  await rename('src/data/generated-visuals.json.tmp', 'src/data/generated-visuals.json');
}
main().catch(async error => {
  const status = error && typeof error === 'object' && 'status' in error ? error.status : 'unavailable';
  console.warn(`Gemini artwork unavailable (${status}); required model: ${MODELS.visuals}. No alternate model used.`);
  try {
    const saved = JSON.parse(await readFile('src/data/generated-visuals.json', 'utf8'));
    if (saved.visuals.length !== products.length) throw new Error('Incomplete cache');
    for (const p of products) validateSvg(visualSchema.parse(saved.visuals.find((v: { id: string }) => v.id === p.id)).svg);
    console.log(`Preserving complete local artwork (${saved.provenance.provider}).`);
  } catch {
    await import('./create-authored-art');
  }
  if (process.argv.includes('--require-ai')) process.exitCode = 1;
});
