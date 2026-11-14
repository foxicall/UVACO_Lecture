import raw from './visual-assets-manifest.json';
import type {PillarId} from './lecture-poster';
export type VisualPage = typeof raw.decks[number]['pages'][number];
export type VisualDeck = typeof raw.decks[number];
export type VisualSelection = {pageId:string;label?:string;caption?:string};
export const visualDecks=raw.decks;
export const visualPageCount=raw.pageCount;
export const visualFigureCount=raw.figureCount;
export const visualPages=visualDecks.flatMap(d=>d.pages);
export const visualPageById=new Map(visualPages.map(p=>[p.id,p]));
export const visualDeckById=new Map(visualDecks.map(d=>[d.id,d]));
export const visualFigures=visualDecks.flatMap(d=>d.figures);
export const getVisualPage=(id:string)=>{const page=visualPageById.get(id);if(!page)throw new Error(`Unknown PDF page: ${id}`);return page;};
const refs=(...ids:string[]):VisualSelection[]=>ids.map(pageId=>({pageId}));
export const pillarVisuals:Record<PillarId,[VisualSelection[],VisualSelection[],VisualSelection[]]>={
 repair:[refs('longevity-6-005','precision-health-010'),refs('longevity-1-050','cellular-repair-007','precision-pain-005'),refs('brain-forest-012','brain-forest-017','precision-health-011')],
 neural:[refs('brain-forest-002','precision-pain-010'),refs('brain-forest-004','longevity-4-026','brain-forest-007'),refs('brain-forest-009','brain-forest-015','precision-pain-014')],
 inflammation:[refs('longevity-4-006','longevity-6-009'),refs('longevity-6-010','longevity-6-012','longevity-6-014','longevity-4-005'),refs('brain-forest-010','brain-forest-011','brain-forest-015')],
 autonomic:[refs('precision-health-008','precision-pain-003'),refs('longevity-3-001','longevity-3-008','precision-health-009','longevity-6-036'),refs('precision-health-009','longevity-6-020','brain-forest-014')],
};
// References are original PDF pages. A related mechanism is never labelled as
// a missing packaging photo, patent certificate or product-specific trial.
export const productVisuals:Record<string,VisualSelection[]>={
 '995':refs('brain-forest-012','cellular-repair-009','cellular-repair-007'),
 '360':refs('brain-forest-017','cellular-repair-010','longevity-5-033'),
 huoyi:refs('brain-forest-009','brain-forest-006','longevity-4-026'),
 antrodia:refs('brain-forest-015','longevity-4-031','longevity-6-009'),
 'antrodia-drops':[{pageId:'brain-forest-015',label:'樟芝原料圖解・樟芝益原頁'},...refs('longevity-4-031','precision-health-011')],
 kanger:refs('brain-forest-010','longevity-6-010','longevity-6-033'),
 'kanger-n':refs('brain-forest-011','longevity-6-012','longevity-6-033'),
 kangyue:refs('longevity-6-020','precision-pain-012','longevity-6-036'),
 kangbei:refs('precision-health-009','longevity-3-008','longevity-6-036'),
 ningkang:refs('brain-forest-014','longevity-4-031','longevity-1-051'),
 dikang:refs('precision-pain-014','longevity-5-033','longevity-4-031'),
 lisheng:refs('precision-health-011','longevity-5-004','longevity-6-028'),
};
