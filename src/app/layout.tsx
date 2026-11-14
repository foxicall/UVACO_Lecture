import type { Metadata } from 'next';
import './globals.css';
import './visuals.css';
import './pathways.css';
import './thematic.css';
export const metadata: Metadata = {
  title: '找回身體的自癒力｜林煒醫師免費健康講座 × 葡眾',
  description: '11/15（日）10:00，延吉街235巷1號。以四大主題、十二座產品島，認識醫療照護與日常營養。大字閱讀、國語語音與講座資訊導覽。',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-TW"><body>{children}</body></html>;
}
