import { products, sourceNote } from '@/data/uvaco-products';
export default function ProductTextPage() {
  return <main className="text-catalog"><a href="/">← 返回健康群島</a><h1>產品文字版</h1><p>{sourceNote}</p>{products.map(p => <article key={p.id} id={p.id}><h2>{p.name}</h2><p>{p.introduction}</p><h3>原料</h3>{p.ingredients.map((s, i) => <p key={i}>{s}</p>)}<p>{p.caution}</p></article>)}</main>;
}
