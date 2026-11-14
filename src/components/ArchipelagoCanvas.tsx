'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState, Component, type ReactNode } from 'react';
import { Color, Vector3, ShaderMaterial, Group, DirectionalLight, Fog, QuadraticBezierCurve3, MeshStandardMaterial } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import gsap from 'gsap';
import { products, clusters, phases, productById } from '@/data/uvaco-products';
import type { Phase, Product } from '@/types/product';
import artwork from '@/data/generated-visuals.json';

export function islandPosition(p: Product): [number, number, number] {
  const [q, r] = p.hexCoordinates;
  return [Math.sqrt(3) * 1.66 * (q + r / 2), 0, 1.66 * 1.5 * r];
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
function Island({ p, active, lit, onSelect, reduced }: { p: Product; active: boolean; lit: boolean; onSelect: (id: string) => void; reduced: boolean }) {
  const group = useRef<Group>(null);
  const [hover, setHover] = useState(false);
  const pos = islandPosition(p);
  useFrame(({ clock }) => { if (group.current) group.current.position.y = reduced ? 0 : Math.sin(clock.elapsedTime * .6 + pos[0]) * .045; });
  return <group position={pos}><group ref={group}>
    <group onClick={e => { e.stopPropagation(); onSelect(p.id); }} onPointerOver={e => { e.stopPropagation(); setHover(true); }} onPointerOut={() => setHover(false)}>
      <mesh position={[0, -.25, 0]}><cylinderGeometry args={[1.38, 1.12, .75, 6]} /><meshStandardMaterial color="#8C8065" flatShading /></mesh>
      <mesh position={[0, .16, 0]}><cylinderGeometry args={[1.4, 1.4, .16, 6]} /><meshStandardMaterial color={clusters[p.islandCluster].color} roughness={.95} /></mesh>
      {(active || hover || lit) && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, .26, 0]}><ringGeometry args={[1.28, 1.4, 6]} /><meshBasicMaterial color={active || hover ? '#F4CE72' : '#D8E8CA'} /></mesh>}
      <group position={[0, .24, 0]}><Landmark p={p} /></group>
      {[0, 1, 2].map(i => <mesh key={i} position={[Math.cos(i * 2 + 1) * .98, .3, Math.sin(i * 2 + 1) * .98]} scale={[.16, .12, .21]}><dodecahedronGeometry /><meshStandardMaterial color="#DFD8BD" /></mesh>)}
    </group>
  </group></group>;
}
function Water({ reduced, phase }: { reduced: boolean; phase: Phase }) {
  const shader = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ time: { value: 0 }, base: { value: new Color('#1E4E5F') }, amplitude: { value: artwork.visuals[0].waterAmplitude }, speed: { value: artwork.visuals[0].waterSpeed } }), []);
  useFrame(({ clock }, delta) => {
    if (!shader.current) return;
    shader.current.uniforms.time.value = reduced ? 0 : clock.elapsedTime;
    shader.current.uniforms.base.value.lerp(new Color(phase === 'night' ? '#153843' : '#1E4E5F'), Math.min(delta * 2, 1));
  });
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.68, 0]}><planeGeometry args={[200, 200, 70, 70]} /><shaderMaterial ref={shader} uniforms={uniforms} vertexShader={`uniform float time; uniform float amplitude; uniform float speed; varying vec2 vUv; varying float vHeight; void main(){vUv=uv;vec3 p=position;p.z=sin(p.x*1.2+time*speed)*cos(p.y*.9+time*speed)*amplitude;vHeight=p.z;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`} fragmentShader={`uniform vec3 base;uniform float time;varying vec2 vUv;varying float vHeight;void main(){float ripple=sin(vUv.x*550.+sin(vUv.y*350.+time*.2)*2.);float foam=smoothstep(.98,1.,ripple)*.04;gl_FragColor=vec4(base+vHeight*.18+foam,1.);}`} /></mesh>;
}
function SynergyArc({ a, b, mid, reduced }: { a: [number, number, number]; b: [number, number, number]; mid: [number, number, number]; reduced: boolean }) {
  const curve = useMemo(() => new QuadraticBezierCurve3(new Vector3(...a), new Vector3(...mid), new Vector3(...b)), [a, b, mid]);
  const material = useRef<MeshStandardMaterial>(null);
  useFrame(({ clock }) => { if (material.current) material.current.emissiveIntensity = reduced ? .7 : .7 + Math.sin(clock.elapsedTime * 1.5) * .25; });
  return <mesh><tubeGeometry args={[curve, 32, .027, 5, false]} /><meshStandardMaterial ref={material} color="#F4C079" emissive="#D97706" emissiveIntensity={.7} roughness={.4} /></mesh>;
}
export function SynergyBezierLines({ ids, active, reduced }: { ids: string[]; active: string | null; reduced: boolean }) {
  const links = useMemo(() => {
    if (!active) return [];
    const p = productById.get(active)!;
    const others = [...new Set([...p.synergyLinks.map(l => l.targetProductId), ...ids.filter(id => id !== active)])];
    return others.map(id => { const a = islandPosition(p); const b = islandPosition(productById.get(id)!); return { id, a: [a[0], .55, a[2]] as [number, number, number], b: [b[0], .55, b[2]] as [number, number, number], mid: [(a[0] + b[0]) / 2, 2.4, (a[2] + b[2]) / 2] as [number, number, number] }; });
  }, [active, ids]);
  return <>{links.map(l => <SynergyArc key={l.id} a={l.a} b={l.b} mid={l.mid} reduced={reduced} />)}</>;
}
function Camera({ active, reduced }: { active: string | null; reduced: boolean }) {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera, size } = useThree();
  useEffect(() => {
    if (!controls.current) return;
    const pos = active ? islandPosition(productById.get(active)!) : [0, 0, 0];
    const distance = active ? 8 : size.width < 600 ? 25 : 18;
    const target = controls.current.target;
    const tween = gsap.timeline({ defaults: { duration: reduced ? 0 : 1.6, ease: 'power3.inOut' } });
    tween.to(target, { x: pos[0], y: 0, z: pos[2] }, 0);
    tween.to(camera.position, { x: pos[0] + distance * .45, y: distance * .92, z: pos[2] + distance * .92 }, 0);
    return () => { tween.kill(); };
  }, [active, camera, reduced, size.width]);
  return <OrbitControls ref={controls} enablePan={false} enableRotate={false} enableZoom={false} minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI / 2.8} target={[0, 0, 0]} />;
}
function Lighting({ phase }: { phase: Phase }) {
  const light = useRef<DirectionalLight>(null);
  const { scene } = useThree();
  const target = useMemo(() => phases.find(p => p.id === phase)!, [phase]);
  useFrame((_, delta) => {
    if (light.current) light.current.color.lerp(new Color(target.light), Math.min(delta * 2, 1));
    if (scene.fog instanceof Fog) scene.fog.color.lerp(new Color(target.sky), Math.min(delta * 2, 1));
  });
  return <><ambientLight intensity={phase === 'night' ? 1.1 : 1.8} /><directionalLight ref={light} position={[-6, 16, 8]} intensity={2.7} /><directionalLight position={[8, 5, -8]} intensity={.8} color="#B1DBD2" /><fog attach="fog" args={['#B7D3D6', 28, 95]} /></>;
}
class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <div className="map-fallback">這台裝置無法開啟 3D 地圖，請使用產品選單或下方導覽按鈕。</div> : this.props.children; }
}
export default function ArchipelagoCanvas({ active, route, phase, onSelect, reduced }: { active: string | null; route: string[]; phase: Phase; onSelect: (id: string) => void; reduced: boolean }) {
  const anchors = useRef<Record<string, HTMLButtonElement | null>>({});
  return <CanvasBoundary><div className="canvas-shell"><Canvas camera={{ position: [8, 17, 18], fov: 40, near: .1, far: 160 }} dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: 'high-performance' }} aria-label="十二座葡眾產品島嶼地圖">
    <Lighting phase={phase} /><Water reduced={reduced} phase={phase} />
    {products.map(p => <Island key={p.id} p={p} active={active === p.id} lit={p.recommendedTimeOfDay === phase || route.includes(p.id)} onSelect={onSelect} reduced={reduced} />)}
    <SynergyBezierLines ids={route} active={active} reduced={reduced} /><Camera active={active} reduced={reduced} />
    <ProjectLabels anchors={anchors} active={active} />
  </Canvas><div className={`label-layer ${!active ? 'overview-labels' : ''}`}>{products.map(p => <button key={p.id} ref={el => { anchors.current[p.id] = el; }} className={`island-label ${active === p.id ? 'active' : ''}`} onClick={() => onSelect(p.id)} aria-label={p.name} aria-pressed={active === p.id}>{p.id === '995' ? '995' : p.name}</button>)}</div></div></CanvasBoundary>;
}
function ProjectLabels({ anchors, active }: { anchors: React.RefObject<Record<string, HTMLButtonElement | null>>; active: string | null }) {
  const point = useMemo(() => new Vector3(), []);
  useFrame(({ camera, size }) => {
    const ordered = [...products].sort((a, b) => islandPosition(a)[2] - islandPosition(b)[2]);
    for (const [i, product] of ordered.entries()) {
      const element = anchors.current[product.id]; if (!element) continue;
      const p = islandPosition(product); point.set(p[0], .1, p[2] + 1.2).project(camera);
      const narrow = size.width < 520;
      const x = narrow && !active ? (i % 2 === 0 ? 70 : size.width - 70) : (point.x * .5 + .5) * size.width;
      const y = narrow && !active ? 260 + Math.floor(i / 2) * 64 : (-point.y * .5 + .5) * size.height;
      element.style.visibility = active && narrow && product.id !== active ? 'hidden' : 'visible';
      element.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
    }
  });
  return null;
}
