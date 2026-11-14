import {visualDecks,type VisualPage} from './visual-assets-manifest';
import type {PathwayId} from './biochemical-pathways';

export type ThematicDeck = {
 id:string;
 title:string;
 shortTitle:string;
 sourceDeckIds:string[];
 pathwayIds:PathwayId[];
 introduction:string;
 pages:VisualPage[];
 pageCount:number;
};

const topics:Omit<ThematicDeck,'pages'|'pageCount'>[]=[
 {id:'longevity-1',title:'專題一：《細胞能量與老化速率：粒線體代謝與氧化還原平衡》',shortTitle:'細胞能量與老化速率',sourceDeckIds:['longevity-1','cellular-repair','precision-health'],pathwayIds:['mitochondria','methylation'],introduction:'從細胞怎麼製造能量開始，再看營養如何參與甲基循環與氧化還原。'},
 {id:'longevity-2',title:'專題二：《排除環境促老毒素：黴菌毒素機制與 4D 引流排毒》',shortTitle:'環境促老毒素與引流',sourceDeckIds:['longevity-2'],pathwayIds:['detox','gut-barrier'],introduction:'先辨認環境暴露，再看肝臟的轉化、結合與排泄，以及腸道如何參與。此專題圖解依文稿重製。'},
 {id:'longevity-3',title:'專題三：《內分泌與神經類固醇網絡：壓力、代謝與大腦煞車機制》',shortTitle:'內分泌與大腦煞車',sourceDeckIds:['longevity-3','precision-pain'],pathwayIds:['neurosteroids','tryptophan'],introduction:'把壓力、神經類固醇與色胺酸放回各自的合成路徑，看懂大腦的油門與煞車。'},
 {id:'longevity-4',title:'專題四：《發炎消退生物學：SPM 主動消退路徑與大腦髓鞘修復》',shortTitle:'發炎消退與大腦髓鞘',sourceDeckIds:['longevity-4','brain-forest'],pathwayIds:['resolution'],introduction:'認識身體如何清理發炎現場，再看神經營養因子與髓鞘形成的研究路徑。'},
 {id:'longevity-5',title:'專題五：《心血管與血管內皮代謝：脂蛋白品質、甲基化與微循環》',shortTitle:'血管內皮與微循環',sourceDeckIds:['longevity-5'],pathwayIds:['vascular','methylation'],introduction:'從一氧化氮、脂蛋白氧化與同半胱胺酸，理解血管內皮每天面對的工作。'},
 {id:'longevity-6',title:'專題六：《腦腸軸與免疫老化：腸道屏障、內毒素與 5R 修復方案》',shortTitle:'腦腸軸與免疫老化',sourceDeckIds:['longevity-6'],pathwayIds:['gut-barrier','tryptophan'],introduction:'沿著腸道屏障、免疫訊號與色胺酸分流，了解腸與腦如何交換訊息。'},
];

export const thematicDecks:ThematicDeck[]=topics.map(topic=>{
 const pages=topic.sourceDeckIds.flatMap(id=>visualDecks.find(deck=>deck.id===id)?.pages??[]);
 return {...topic,pages,pageCount:pages.length};
});
export const thematicPageCount=thematicDecks.reduce((count,deck)=>count+deck.pageCount,0);
export const thematicDeckById=new Map(thematicDecks.map(deck=>[deck.id,deck]));
