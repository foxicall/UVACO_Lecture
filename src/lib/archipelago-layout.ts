export const ARCHIPELAGO_SCALE = 1.48;
export const LANDMARK_SCALE = 1.35;
export const ROTATION_SPEED = .08;
export const ISLAND_SPACING = .92;
export const roofHeights: Record<string,number> = {
 '995':1.42, antrodia:2.3, 'antrodia-drops':1.58, kanger:1.08, 'kanger-n':1.48,
 kangyue:1.76, huoyi:1.58, ningkang:1.08, '360':1.4, dikang:1.08, lisheng:1.08, kangbei:2.12,
};
export function overviewFrustum(width:number,height:number){
 const aspect=width/Math.max(1,height);
 const halfHeight=Math.max(16.5,19.5/aspect);
 return {left:-halfHeight*aspect,right:halfHeight*aspect,top:halfHeight,bottom:-halfHeight};
}
