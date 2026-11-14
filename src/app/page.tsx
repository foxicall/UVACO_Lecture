import { products } from '@/data/uvaco-products';
export default function Page() {
  return <main><h1>葡眾健康群島</h1>{products.map(p => <article key={p.id}><h2>{p.name}</h2><p>{p.introduction}</p><details><summary>原料與來源文件</summary>{p.ingredients.map(s => <p key={s}>{s}</p>)}</details></article>)}</main>;
}
