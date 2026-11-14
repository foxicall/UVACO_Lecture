import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: '葡眾健康群島｜慢慢看懂，好好照顧自己',
  description: '用島嶼導覽認識十二項葡眾產品、原料與日常健康知識。大字閱讀、語音導覽與健康小幫手。',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-TW"><body>{children}</body></html>;
}
