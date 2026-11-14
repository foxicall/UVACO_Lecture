export type Cluster = 'cellular_energy' | 'liver_defense' | 'gut_microbiome' | 'brain_forest' | 'circulation_detox';
export interface Product {
  id: string;
  name: string;
  fullName: string;
  islandCluster: Cluster;
  hexCoordinates: [number, number];
  elderlyHook: string;
  introduction: string;
  symptomsMatched: string[];
  ingredients: string[];
  patentsAndHonors: string[];
  mechanisms: { antiInflammation: string; selfHealing: string; autonomicNerve: string };
  synergyLinks: { targetProductId: string; reason: string }[];
  caution: string;
  motif: string;
  source: 'user-brief' | 'drive-extracted-text';
  sourceMechanisms?: Record<string, string>;
  lecturePillar?: import('@/data/lecture-poster').PillarId;
}
