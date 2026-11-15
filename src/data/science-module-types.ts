export type ScienceMode = 'stress' | 'support';
export type ScienceNode = { id:string; label:string; detail:string; cofactor?:string };
export type ScienceTrack = { id:string; title:string; nodes:ScienceNode[] };
export type ScienceStage = {
  id:string;
  title:string;
  metaphor:string;
  explanation:string;
  tracks:ScienceTrack[];
  productIds:string[];
  productContext:string;
  preferredTracks?:Partial<Record<ScienceMode,string>>;
};
export type ScienceEvidence = { id:string; title:string; text:string; source:string; url?:string };
export type ScienceModuleDefinition = {
  id:'toxin'|'endocrine'|'resolution';
  eyebrow:string;
  title:string;
  introduction:string;
  modes:Record<ScienceMode,{label:string;summary:string}>;
  stages:ScienceStage[];
  evidence:ScienceEvidence[];
  sources:{label:string;url?:string}[];
};
