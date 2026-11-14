import { sitePath } from '@/lib/site';
import IslandExperience from '@/components/IslandExperience';
export default function Page() {
  return <><IslandExperience /><noscript><p>此互動導覽需要 JavaScript。您也可以閱讀<a href={sitePath('/products/')}>產品文字版</a>。</p></noscript></>;
}
