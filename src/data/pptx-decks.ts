import { longevityDecks, type LongevitySlide } from './longevity-decks-manifest';
export const pptxDecks = longevityDecks;
export function slideNarration(slide: LongevitySlide) {
  return `${slide.title}。${slide.summary}。${slide.blocks.map(block=>`${block.heading}。${block.text}`).join('。')}。研究限制：${slide.note}。產品閱讀對照：${slide.productNote}`;
}
