import ScienceDetails from '@/components/ScienceDetails';
import { everydayProducts } from '@/data/everyday-language';
import { sitePath } from '@/lib/site';
import { products, sourceNote } from '@/data/uvaco-products';
export default function ProductTextPage() {
  return <main className="text-catalog"><a href={sitePath('/')}>← 返回健康群島</a><h1>產品文字版</h1><p>{sourceNote}</p>{products.map(p => <article key={p.id} id={p.id}><h2>{p.name}</h2><p>{p.introduction}</p><h3>配方裡的食材</h3><ul>{everydayProducts[p.id].ingredients.map(item=><li key={item}>{item}</li>)}</ul><ScienceDetails>{p.ingredients.map((s,i)=><p key={i}>{s}</p>)}<h3>食用前看清楚</h3><p>{p.caution}</p></ScienceDetails></article>)}</main>;
}
