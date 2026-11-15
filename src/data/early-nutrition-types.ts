export type NutritionStrategy='early'|'routine';
export interface JamaEndpoint {
 id:'weight'|'mucositis';
 title:string;
 description:string;
 events:Record<NutritionStrategy,number>;
 relativeRisk:number;
 confidenceInterval:[number,number];
 pValue?:number;
 interpretation:string;
}
export interface EarlyNutritionStudy {
 title:string;
 eyebrow:string;
 hook:string;
 citation:string;
 doi:string;
 url:string;
 published:string;
 population:string[];
 scope:string;
 treatmentWindow:string;
 strategies:Record<NutritionStrategy,{label:string;title:string;n:number;protocol:string;steps:string[]}>;
 endpoints:JamaEndpoint[];
 analysis:{randomized:number;modifiedITT:number;ittRelativeRisk:number;ittConfidenceInterval:[number,number];summary:string};
 economics:{earlyCost:number;routineCost:number;earlyQaly:number;routineQaly:number;context:string};
 insights:{id:string;title:string;value?:string;body:string;context:string}[];
 bridge:string;
 actions:{id:string;title:string;habit:string;connection:string;productIds:string[]}[];
 sources:{label:string;url:string}[];
}
