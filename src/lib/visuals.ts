import { DOMParser, XMLSerializer } from '@xmldom/xmldom';
import { z } from 'zod';
export const visualSchema = z.object({
  id: z.string(), svg: z.string().min(100).max(100_000), metaphor: z.string().min(4).max(60),
  waterAmplitude: z.number().min(0.01).max(0.16), waterSpeed: z.number().min(0.05).max(0.6), glowIntensity: z.number().min(0).max(1.5),
});
const tags = new Set(['svg', 'g', 'path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon', 'defs', 'clipPath', 'linearGradient', 'radialGradient', 'stop', 'title', 'desc']);
const attrs = new Set(['xmlns', 'viewBox', 'width', 'height', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'd', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'x1', 'x2', 'y1', 'y2', 'points', 'opacity', 'fill-opacity', 'stroke-opacity', 'transform', 'id', 'clip-path', 'offset', 'stop-color', 'stop-opacity', 'gradientTransform', 'gradientUnits']);
export function validateSvg(svg: string) {
  if (/<!DOCTYPE|<!ENTITY|<\?/i.test(svg)) throw new Error('SVG declarations are forbidden');
  const doc = new DOMParser({ onError: () => { throw new Error('Invalid SVG XML'); } }).parseFromString(svg, 'image/svg+xml');
  const root = doc.documentElement;
  if (!root || root.tagName !== 'svg' || root.getAttribute('xmlns') !== 'http://www.w3.org/2000/svg' || !root.hasAttribute('viewBox')) throw new Error('SVG root required');
  const nodes = Array.from(doc.getElementsByTagName('*'));
  if (nodes.length > 1200) throw new Error('SVG complexity exceeded');
  for (const node of nodes) {
    if (!tags.has(node.tagName)) throw new Error('Disallowed SVG element');
    for (const attr of Array.from(node.attributes)) {
      if (!attrs.has(attr.name) || /javascript:|data:|https?:|expression\(|@import/i.test(attr.value) && attr.name !== 'xmlns') throw new Error('Disallowed SVG attribute');
      if (/url\(/i.test(attr.value) && !/^url\(#[\w-]+\)$/.test(attr.value)) throw new Error('External SVG URL');
    }
  }
  return new XMLSerializer().serializeToString(doc);
}
