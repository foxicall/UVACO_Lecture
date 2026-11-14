import manifest from './longevity-decks-manifest.json';
export type LongevityDeckId = 'longevity-1'|'longevity-2'|'longevity-3'|'longevity-4'|'longevity-5'|'longevity-6';
export type LongevitySlide = (typeof manifest)[number]['slides'][number];
export const longevityDecks = manifest;
export const longevitySlideCount = longevityDecks.reduce((count,deck)=>count+deck.slides.length,0);
