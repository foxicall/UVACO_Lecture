import { longevityDecks, type LongevitySlide } from './longevity-decks-manifest';
export const pptxDecks = longevityDecks;
export function slideNarration(slide: LongevitySlide) {
  return `${slide.title}。${slide.summary}。${slide.blocks.map(block=>`${block.heading}。${block.text}`).join('。')}。接著看看配方：${slide.productNote}`;
}
