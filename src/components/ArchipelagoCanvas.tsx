'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useMemo, useRef, useState, Component, type ReactNode, type RefObject } from 'react';
import { Vector3, OrthographicCamera, QuadraticBezierCurve3, Color, Group } from 'three';
import { Html } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import { ARCHIPELAGO_SCALE, LANDMARK_SCALE, ROTATION_SPEED, ISLAND_SPACING, roofHeights, overviewFrustum } from '@/lib/archipelago-layout';
import { products, productById } from '@/data/uvaco-products';
import type { Product } from '@/types/product';
import { pillars, pillarById } from '@/data/lecture-poster';

export function islandPosition(p: Product): [number, number, number] {
  const [q, r] = p.hexCoordinates;
  return [Math.sqrt(3) * 2 * (q + r / 2) * ISLAND_SPACING, 0, 2 * 1.5 * r * ISLAND_SPACING];
}
function Tree({ position = [0, 0, 0], size = 1, color = '#436C45' }: { position?: [number, number, number]; size?: number; color?: string }) {
  return <group position={position} scale={size}>
    <mesh position={[0, .5, 0]}><cylinderGeometry args={[.075, .13, 1, 5]} /><meshStandardMaterial color="#785C3F" /></mesh>
    {[0, 1, 2].map(i => <mesh key={i} position={[i === 1 ? -.26 : i === 2 ? .25 : 0, 1.05 + (i === 0 ? .3 : 0), i === 2 ? .18 : 0]}><icosahedronGeometry args={[.48, 0]} /><meshStandardMaterial color={color} roughness={.9} /></mesh>)}
  </group>;
}
function Mushroom({ x, z, scale = 1, color = '#E8D6B2' }: { x: number; z: number; scale?: number; color?: string }) {
  return <group position={[x, 0, z]} scale={scale}><mesh position={[0, .24, 0]}><cylinderGeometry args={[.12, .16, .48, 7]} /><meshStandardMaterial color="#E9DEBE" /></mesh><mesh position={[0, .52, 0]} scale={[1, .5, 1]}><sphereGeometry args={[.5, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={color} /></mesh></group>;
}
function Pavilion({ moon = false }: { moon?: boolean }) {
  return <group><mesh position={[0, .12, 0]}><cylinderGeometry args={[.65, .75, .22, 6]} /><meshStandardMaterial color="#E2D3B4" /></mesh>{[0, 1, 2, 3, 4, 5].map(i => <mesh key={i} position={[Math.cos(i * Math.PI / 3) * .48, .6, Math.sin(i * Math.PI / 3) * .48]}><cylinderGeometry args={[.045, .045, .9, 5]} /><meshStandardMaterial color="#C9B382" /></mesh>)}<mesh position={[0, 1.16, 0]}><coneGeometry args={[.85, .46, 6]} /><meshStandardMaterial color={moon ? '#58858C' : '#B9894D'} /></mesh>{moon && <mesh position={[0, 1.8, 0]}><torusGeometry args={[.26, .055, 6, 24, Math.PI * 1.5]} /><meshStandardMaterial color="#F5E8AF" emissive="#D9B574" emissiveIntensity={.4} /></mesh>}</group>;
}
function Landmark({ p }: { p: Product }) {
  if (p.id === '995') return <group><mesh position={[0, .18, 0]}><cylinderGeometry args={[.68, .8, .28, 8]} /><meshStandardMaterial color="#D1B66E" /></mesh><mesh position={[0, .4, 0]}><cylinderGeometry args={[.54, .54, .16, 16]} /><meshStandardMaterial color="#79ACA9" metalness={.3} roughness={.3} /></mesh>{[0, 1, 2, 3, 4].map(i => <mesh key={i} position={[Math.cos(i * 1.26) * .3, .85 + (i % 2) * .4, Math.sin(i * 1.26) * .3]}><octahedronGeometry args={[.15, 0]} /><meshStandardMaterial color="#E9BE54" metalness={.4} roughness={.35} /></mesh>)}</group>;
  if (p.id === 'antrodia') return <><Tree size={1.25} color="#647F4D" /><Mushroom x={.6} z={.3} scale={.55} color="#A8774E" /></>;
  if (p.id === 'antrodia-drops') return <><mesh position={[0, .85, 0]} scale={[.55, .9, .55]}><icosahedronGeometry args={[.8, 0]} /><meshStandardMaterial color="#AE5147" metalness={.25} roughness={.3} /></mesh><Tree position={[-.65, 0, .25]} size={.45} /></>;
  if (p.id === 'kanger' || p.id === 'ningkang') return <><mesh position={[0, .16, 0]}><cylinderGeometry args={[.8, .85, .14, 12]} /><meshStandardMaterial color="#D7D5AC" /></mesh><mesh position={[0, .2, 0]}><sphereGeometry args={[.82, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={p.id === 'kanger' ? '#B8DBC9' : '#D8BE97'} wireframe transparent opacity={.6} /></mesh><Mushroom x={-.22} z={0} scale={1.1} /><Mushroom x={.3} z={.25} scale={.7} color="#B5975C" /></>;
  if (p.id === 'kanger-n') return <><Tree position={[-.35, 0, 0]} size={.8} color="#88A853" /><mesh position={[.4, .45, .2]}><icosahedronGeometry args={[.35, 0]} /><meshStandardMaterial color="#D8AF45" /></mesh><mesh position={[.4, .9, .2]}><coneGeometry args={[.23, .55, 5]} /><meshStandardMaterial color="#447754" /></mesh></>;
  if (p.id === 'kangyue') return <><Tree size={.95} color="#92A95D" />{[0, 1, 2].map(i => <mesh key={i} position={[(i - 1) * .3, 1.1, .35]}><sphereGeometry args={[.14, 8, 6]} /><meshStandardMaterial color="#E2AC48" /></mesh>)}</>;
  if (p.id === 'huoyi') return <><Tree position={[-.34, 0, -.1]} size={.85} color="#739C8B" /><Tree position={[.4, 0, .15]} size={.65} color="#A5B785" /><Mushroom x={0} z={.45} scale={.65} /><mesh position={[0, .1, 0]}><sphereGeometry args={[1, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#D0E4D5" wireframe transparent opacity={.23} /></mesh></>;
  if (p.id === 'kangbei') return <Pavilion moon />;
  if (p.id === '360') return <><Pavilion />{[0, 1, 2].map(i => <Tree key={i} position={[Math.cos(i * 2.1) * .9, 0, Math.sin(i * 2.1) * .9]} size={.4} />)}</>;
  return <><mesh position={[0, .13, 0]}><torusGeometry args={[.64, .15, 4, 6]} /><meshStandardMaterial color={p.id === 'dikang' ? '#CCAA80' : '#8DAE92'} /></mesh><mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, .13, 0]}><circleGeometry args={[.55, 12]} /><meshStandardMaterial color="#5E969F" /></mesh><Tree position={[.5, 0, -.4]} size={.55} color={p.id === 'dikang' ? '#9C9D60' : '#719871'} /><Mushroom x={-.4} z={.3} scale={.6} /></>;
}
type InteractionProps = {portal:RefObject<HTMLDivElement|null>;onHover:(id:string|null)=>void;onFocus:(id:string|null)=>void};
function RoofBadge({id,name,color,active=false,onClick,onHover,onFocus,portal,hub=false}:{id:string;name:string;color:string;active?:boolean;onClick:()=>void;hub?:boolean}&InteractionProps) {
  return <Html portal={portal.current ? {current:portal.current} : undefined} center distanceFactor={1} zIndexRange={[20,1]} className="roof-anchor"><button type="button" data-product-id={id} className={`${hub?'hub-label':'island-label'} landmark-label ${active?'active':''}`} aria-label={hub?'林煒醫師講座，開啟健康金三角':productById.get(id)?.name} aria-pressed={hub?undefined:active} onClick={event=>{event.stopPropagation();onClick();}} onPointerEnter={()=>onHover(id)} onPointerLeave={()=>onHover(null)} onFocus={()=>onFocus(id)} onBlur={()=>onFocus(null)}><span className="landmark-badge"><i aria-hidden="true" style={{backgroundColor:color}}/>{name}</span></button></Html>;
}
function Island({ p, active, onSelect, onHover,onFocus,portal }: { p: Product; active: boolean; onSelect: (id: string) => void }&InteractionProps) {
  const [hover, setHover] = useState(false);
  return <group name={`island-${p.id}`} position={islandPosition(p)} scale={1.1} onClick={e => { e.stopPropagation(); onSelect(p.id); }} onPointerOver={e => { e.stopPropagation(); setHover(true);onHover(p.id); }} onPointerOut={() => {setHover(false);onHover(null);}}>
    <mesh position={[0, -.25, 0]}><cylinderGeometry args={[1.38, 1.12, .75, 6]} /><meshStandardMaterial color="#8C8065" flatShading /></mesh>
    <mesh position={[0, .16, 0]}><cylinderGeometry args={[1.4, 1.4, .16, 6]} /><meshStandardMaterial color={pillarById.get(p.lecturePillar!)!.color} roughness={.95} /></mesh>
    {(active || hover) && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, .27, 0]}><ringGeometry args={[1.27, 1.44, 6]} /><meshStandardMaterial color="#F0CA75" emissive="#D8A43F" emissiveIntensity={1.2} toneMapped={false} /></mesh>}
    <group name={`landmark-${p.id}`} position={[0, .24, 0]} scale={LANDMARK_SCALE}><Landmark p={p}/><group position={[0,roofHeights[p.id]+.35,0]}><RoofBadge id={p.id} name={p.id==='995'?'995':p.name.replaceAll(' ','')} color={pillarById.get(p.lecturePillar!)!.color} active={active} onClick={()=>onSelect(p.id)} onHover={onHover} onFocus={onFocus} portal={portal}/></group></group>
    {[0, 1, 2].map(i => <mesh key={i} position={[Math.cos(i * 2 + 1) * .98, .3, Math.sin(i * 2 + 1) * .98]} scale={[.16, .12, .21]}><dodecahedronGeometry /><meshStandardMaterial color="#DFD8BD" /></mesh>)}
  </group>;
}
function Water() {
  const uniforms = useMemo(() => ({ base: { value: new Color('#1E4E5F') } }), []);
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.68*ARCHIPELAGO_SCALE, 0]}><planeGeometry args={[200, 200]} /><shaderMaterial toneMapped={false} uniforms={uniforms} vertexShader={`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`} fragmentShader={`uniform vec3 base;varying vec2 vUv;void main(){float ripple=sin(vUv.x*550.+sin(vUv.y*350.)*2.);float foam=smoothstep(.985,1.,ripple)*.003;gl_FragColor=vec4(base+foam,1.);
#include <colorspace_fragment>
}`} /></mesh>;
}
function SynergyArc({ a, b, hub = false }: { a: [number, number, number]; b: [number, number, number]; hub?: boolean }) {
  const curve = useMemo(() => new QuadraticBezierCurve3(new Vector3(...a), new Vector3((a[0] + b[0]) / 2, hub ? 1.4 : 2.4, (a[2] + b[2]) / 2), new Vector3(...b)), [a, b, hub]);
  return <mesh><tubeGeometry args={[curve, 32, hub ? .018 : .045, 5, false]} /><meshStandardMaterial color={hub ? '#B8B79B' : '#F0CA75'} emissive="#D8A43F" emissiveIntensity={hub ? .15 : .8} roughness={.4} /></mesh>;
}
export function SynergyBezierLines({ ids, active }: { ids: string[]; active: string | null }) {
  const links = useMemo(() => {
    if (!active) return [];
    const p = productById.get(active)!;
    return [...new Set([...p.synergyLinks.map(l => l.targetProductId), ...ids.filter(id => id !== active)])].map(id => {
      const a = islandPosition(p), b = islandPosition(productById.get(id)!);
      return { id, a: [a[0], .55, a[2]] as [number, number, number], b: [b[0], .55, b[2]] as [number, number, number] };
    });
  }, [active, ids]);
  return <>{links.map(l => <SynergyArc key={l.id} {...l} />)}</>;
}
function FixedOverviewCamera() {
  const { camera, size, invalidate } = useThree();
  useLayoutEffect(() => {
    if (!(camera instanceof OrthographicCamera)) return;
    // Fit the complete rotation envelope, without changing framing during product reading.
    Object.assign(camera,overviewFrustum(size.width,size.height));
    camera.zoom = 1;
    camera.position.set(18, 26, 28); camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix(); camera.updateMatrixWorld(); invalidate();
  }, [camera, size.width, size.height, invalidate]);
  return null;
}
function Lighting() {
  return <><ambientLight color="#FAF7F2" intensity={1.8} /><directionalLight position={[-6, 16, 8]} intensity={2.3} color="#FFFDF9" /><directionalLight position={[8, 5, -8]} intensity={.6} color="#FAF7F2" /></>;
}
class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <div className="map-fallback">這台裝置無法開啟 3D 地圖，請使用產品選單或下方導覽按鈕。</div> : this.props.children; }
}
function LectureHub({ onClick,onHover,onFocus,portal }: { onClick: () => void }&InteractionProps) {
  return <group onClick={e => { e.stopPropagation(); onClick(); }} onPointerOver={event=>{event.stopPropagation();onHover('hub');}} onPointerOut={()=>onHover(null)}>
    <mesh position={[0, -.28, 0]}><cylinderGeometry args={[1.9, 1.65, .9, 6]} /><meshStandardMaterial color="#AA9A78" /></mesh>
    <mesh position={[0, .21, 0]}><cylinderGeometry args={[1.92, 1.92, .16, 6]} /><meshStandardMaterial color="#DFD8B5" /></mesh>
    <mesh position={[0, .33, 0]}><cylinderGeometry args={[1.4, 1.5, .14, 12]} /><meshStandardMaterial color="#B6C7B1" /></mesh>
    <group name="landmark-hub" position={[0, .4, 0]} scale={1.35*LANDMARK_SCALE}><Pavilion /><group position={[0,1.75,0]}><RoofBadge id="hub" name="林煒醫師講座" color="#D97706" hub onClick={onClick} onHover={onHover} onFocus={onFocus} portal={portal}/></group></group>
    <Tree position={[-1.05, .25, .5]} size={.75} color="#5D8966" /><Tree position={[1.05, .25, -.4]} size={.65} color="#86A479" />
  </group>;
}
function HubConnections() {
  const lines = useMemo(() => pillars.map(p => { const pos = islandPosition(productById.get(p.products[0])!); return { id: p.id, a: [0, .5, 0] as [number, number, number], b: [pos[0], .4, pos[2]] as [number, number, number] }; }), []);
  return <>{lines.map(l => <SynergyArc key={l.id} {...l} hub />)}</>;
}
function RoofVisibility({portal,active,hover,focus}:{portal:RefObject<HTMLDivElement|null>;active:string|null;hover:string|null;focus:string|null}) {
  const invalidate=useThree(state=>state.invalidate);
  useEffect(()=>{const frame=requestAnimationFrame(()=>invalidate());return()=>cancelAnimationFrame(frame);},[invalidate,active,hover,focus]);
  useFrame(()=>{
    const parent=portal.current;
    if(!parent)return;
    const bounds=parent.getBoundingClientRect();
    const badges=Array.from(parent.querySelectorAll<HTMLButtonElement>('.landmark-label')).map(button=>({button,box:button.querySelector('.landmark-badge')!.getBoundingClientRect()}));
    const priority=(button:HTMLButtonElement)=>[active,hover,focus].includes(button.dataset.productId!)?2:button.dataset.productId==='hub'?1:0;
    badges.sort((a,b)=>priority(b.button)-priority(a.button)||b.box.bottom-a.box.bottom);
    const placed:DOMRect[]=[];
    for(const {button,box} of badges){
      const fits=box.left>=bounds.left+4&&box.right<=bounds.right-4&&box.top>=bounds.top+4&&box.bottom<=bounds.bottom-4;
      const overlaps=placed.some(other=>box.left<other.right+1&&box.right>other.left-1&&box.top<other.bottom+1&&box.bottom>other.top-1);
      const visible=fits&&!overlaps;
      if(button.dataset.labelVisible!==String(visible))button.dataset.labelVisible=String(visible);
      if(visible)placed.push(box);
    }
  });
  return null;
}
function Turntable({rotating,children,onAngle}:{rotating:boolean;children:ReactNode;onAngle:(angle:number)=>void}){
  const group=useRef<Group>(null);
  useFrame((_,delta)=>{if(rotating&&group.current){group.current.rotation.y+=Math.min(delta,.05)*ROTATION_SPEED;onAngle(group.current.rotation.y);}});
  return <group name="archipelago-turntable" ref={group} scale={ARCHIPELAGO_SCALE}>{children}</group>;
}
export default function ArchipelagoCanvas({ active, route, onSelect, onHub,reading=false }: { active: string | null; route: string[]; onSelect: (id: string) => void; onHub: () => void;reading?:boolean }) {
  const reduced=useReducedMotion();
  const [choice,setChoice]=useState<boolean|null>(null);
  const [hover,setHover]=useState<string|null>(null),[focus,setFocus]=useState<string|null>(null);
  const [visible,setVisible]=useState(true);
  const shell=useRef<HTMLDivElement>(null);
  const portal=useRef<HTMLDivElement>(null);
  useEffect(()=>{const change=()=>setVisible(!document.hidden);change();document.addEventListener('visibilitychange',change);return()=>document.removeEventListener('visibilitychange',change);},[]);
  const enabled=choice??!reduced;
  const rotating=enabled&&!active&&!reading&&!hover&&!focus&&visible;
  const status=active||reading?'閱讀時暫停':hover||focus?'停留時暫停':!visible?'視窗休息中':rotating?'自動旋轉中':'暫停旋轉';
  return <CanvasBoundary><div className="canvas-shell" ref={shell} data-rotating={rotating} data-rotation="0" data-scene-scale={ARCHIPELAGO_SCALE} data-landmark-scale={LANDMARK_SCALE}>
    <div className="roof-badges" ref={portal}/>
    <Canvas role="img" frameloop={rotating?'always':'demand'} orthographic camera={{ position: [18, 26, 28], zoom: 1, near: .1, far: 160 }} dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: 'high-performance' }} aria-label="可暫停旋轉的十二座葡眾產品島嶼地圖">
      <Lighting /><Water /><FixedOverviewCamera />
      <Turntable rotating={rotating} onAngle={angle=>{if(shell.current)shell.current.dataset.rotation=angle.toFixed(5);}}>
        {products.map(p=><Island key={p.id} p={p} active={active===p.id} onSelect={onSelect} onHover={setHover} onFocus={setFocus} portal={portal}/>)}
        <LectureHub onClick={onHub} onHover={setHover} onFocus={setFocus} portal={portal}/><HubConnections/><SynergyBezierLines ids={route} active={active}/>
      </Turntable>
      <RoofVisibility portal={portal} active={active} hover={hover} focus={focus}/>
    </Canvas>
    <button className="rotation-toggle" aria-label={enabled?'暫停自動旋轉':'開啟自動旋轉'} aria-pressed={enabled} onClick={()=>setChoice(!enabled)}><span aria-hidden="true">{rotating?'🔄':'⏸'}</span>{status}</button>
  </div></CanvasBoundary>;
}
