'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef, useState, Component, type ReactNode } from 'react';
import { Vector3, OrthographicCamera, QuadraticBezierCurve3, Color } from 'three';
import { products, productById } from '@/data/uvaco-products';
import type { Product } from '@/types/product';
import { pillars, pillarById } from '@/data/lecture-poster';

export function islandPosition(p: Product): [number, number, number] {
  const [q, r] = p.hexCoordinates;
  return [Math.sqrt(3) * 2 * (q + r / 2), 0, 2 * 1.5 * r];
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
function Island({ p, active, onSelect }: { p: Product; active: boolean; onSelect: (id: string) => void }) {
  const [hover, setHover] = useState(false);
  return <group position={islandPosition(p)} scale={1.1} onClick={e => { e.stopPropagation(); onSelect(p.id); }} onPointerOver={e => { e.stopPropagation(); setHover(true); }} onPointerOut={() => setHover(false)}>
    <mesh position={[0, -.25, 0]}><cylinderGeometry args={[1.38, 1.12, .75, 6]} /><meshStandardMaterial color="#8C8065" flatShading /></mesh>
    <mesh position={[0, .16, 0]}><cylinderGeometry args={[1.4, 1.4, .16, 6]} /><meshStandardMaterial color={pillarById.get(p.lecturePillar!)!.color} roughness={.95} /></mesh>
    {(active || hover) && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, .27, 0]}><ringGeometry args={[1.27, 1.44, 6]} /><meshStandardMaterial color="#F0CA75" emissive="#D8A43F" emissiveIntensity={1.2} toneMapped={false} /></mesh>}
    <group position={[0, .24, 0]}><Landmark p={p} /></group>
    {[0, 1, 2].map(i => <mesh key={i} position={[Math.cos(i * 2 + 1) * .98, .3, Math.sin(i * 2 + 1) * .98]} scale={[.16, .12, .21]}><dodecahedronGeometry /><meshStandardMaterial color="#DFD8BD" /></mesh>)}
  </group>;
}
function Water() {
  const uniforms = useMemo(() => ({ base: { value: new Color('#1E4E5F') } }), []);
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.68, 0]}><planeGeometry args={[200, 200]} /><shaderMaterial toneMapped={false} uniforms={uniforms} vertexShader={`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`} fragmentShader={`uniform vec3 base;varying vec2 vUv;void main(){float ripple=sin(vUv.x*550.+sin(vUv.y*350.)*2.);float foam=smoothstep(.985,1.,ripple)*.003;gl_FragColor=vec4(base+foam,1.);
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
    // Only the viewport changes the framing. Product selection never moves the camera.
    const aspect = size.width / size.height;
    const halfHeight = Math.max(13.5, 16 / aspect);
    camera.left = -halfHeight * aspect; camera.right = halfHeight * aspect;
    camera.top = halfHeight; camera.bottom = -halfHeight;
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
function LectureHub({ onClick }: { onClick: () => void }) {
  return <group onClick={e => { e.stopPropagation(); onClick(); }}>
    <mesh position={[0, -.28, 0]}><cylinderGeometry args={[1.9, 1.65, .9, 6]} /><meshStandardMaterial color="#AA9A78" /></mesh>
    <mesh position={[0, .21, 0]}><cylinderGeometry args={[1.92, 1.92, .16, 6]} /><meshStandardMaterial color="#DFD8B5" /></mesh>
    <mesh position={[0, .33, 0]}><cylinderGeometry args={[1.4, 1.5, .14, 12]} /><meshStandardMaterial color="#B6C7B1" /></mesh>
    <group position={[0, .4, 0]} scale={1.35}><Pavilion /></group>
    <Tree position={[-1.05, .25, .5]} size={.75} color="#5D8966" /><Tree position={[1.05, .25, -.4]} size={.65} color="#86A479" />
    <mesh position={[0, 2.35, 0]}><octahedronGeometry args={[.22, 0]} /><meshStandardMaterial color="#E2B464" /></mesh>
  </group>;
}
function HubConnections() {
  const lines = useMemo(() => pillars.map(p => { const pos = islandPosition(productById.get(p.products[0])!); return { id: p.id, a: [0, .5, 0] as [number, number, number], b: [pos[0], .4, pos[2]] as [number, number, number] }; }), []);
  return <>{lines.map(l => <SynergyArc key={l.id} {...l} hub />)}</>;
}
export default function ArchipelagoCanvas({ active, route, onSelect, onHub }: { active: string | null; route: string[]; onSelect: (id: string) => void; onHub: () => void }) {
  const anchors = useRef<Record<string, HTMLButtonElement | null>>({});
  const hub = useRef<HTMLButtonElement | null>(null);
  return <CanvasBoundary><div className="canvas-shell"><Canvas role="img" frameloop="demand" orthographic camera={{ position: [18, 26, 28], zoom: 1, near: .1, far: 160 }} dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: 'high-performance' }} aria-label="固定視角的十二座葡眾產品島嶼地圖">
    <Lighting /><Water /><FixedOverviewCamera />
    {products.map(p => <Island key={p.id} p={p} active={active === p.id} onSelect={onSelect} />)}
    <LectureHub onClick={onHub} /><HubConnections /><SynergyBezierLines ids={route} active={active} />
    <ProjectLabels anchors={anchors} hub={hub} />
  </Canvas><div className="label-layer">{products.map(p => <button key={p.id} ref={el => { anchors.current[p.id] = el; }} className={`island-label ${active === p.id ? 'active' : ''}`} onClick={() => onSelect(p.id)} aria-label={p.name} aria-pressed={active === p.id}>{p.id === '995' ? '995' : p.name}</button>)}<button className="hub-label" ref={hub} onClick={onHub}><strong>健康金三角</strong><span>林煒醫師</span></button></div></div></CanvasBoundary>;
}
function ProjectLabels({ anchors, hub }: { anchors: React.RefObject<Record<string, HTMLButtonElement | null>>; hub: React.RefObject<HTMLButtonElement | null> }) {
  const point = useMemo(() => new Vector3(), []);
  const lastFrame = useRef('');
  useFrame(({ camera, size }) => {
    const key = `${size.width}:${size.height}`;
    if (lastFrame.current === key) return;
    lastFrame.current = key;
    const placed: { x: number; y: number; width: number; height: number }[] = [];
    if (hub.current) {
      point.set(0, .1, 1.6).project(camera);
      const x = (point.x * .5 + .5) * size.width, y = (-point.y * .5 + .5) * size.height;
      hub.current.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
      placed.push({ x, y, width: hub.current.offsetWidth || 92, height: hub.current.offsetHeight || 52 });
    }
    const items = products.map(product => {
      const p = islandPosition(product); point.set(p[0], .1, p[2] + 1.15).project(camera);
      return { product, x: (point.x * .5 + .5) * size.width, y: (-point.y * .5 + .5) * size.height };
    }).sort((a, b) => a.y - b.y);
    for (const item of items) {
      const el = anchors.current[item.product.id]; if (!el) continue;
      const width = el.offsetWidth || 90, height = el.offsetHeight || 44;
      const candidates = [{ x: item.x, y: item.y }];
      for (let radius = 1; radius <= 7; radius++) for (let i = 0; i < 16; i++) candidates.push({ x: item.x + Math.cos(i * Math.PI / 8) * radius * 20, y: item.y + Math.sin(i * Math.PI / 8) * radius * 20 });
      const chosen = candidates.find(c => c.x >= width / 2 + 6 && c.x <= size.width - width / 2 - 6 && c.y >= height / 2 + 6 && c.y <= size.height - height / 2 - 6 && !placed.some(p => Math.abs(c.x - p.x) < (width + p.width) / 2 + 5 && Math.abs(c.y - p.y) < (height + p.height) / 2 + 5)) || candidates[0];
      placed.push({ ...chosen, width, height });
      el.style.transform = `translate(${chosen.x.toFixed(1)}px, ${chosen.y.toFixed(1)}px) translate(-50%, -50%)`;
    }
  });
  return null;
}
