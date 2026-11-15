import type { Metadata } from 'next';
import './globals.css';
import './visuals.css';
import './pathways.css';
import './thematic.css';
import './homocysteine.css';
import './gut-barrier.css';
import './gut-brain.css';
import './science-modules.css';
import './toxin-drainage.css';
import './endocrine-brain-brake.css';
import './resolution-myelin.css';
import './early-nutrition.css';
import './speaker-profile.css';
export const metadata: Metadata = {
  title: '找回身體的自癒力｜林煒醫師・精準營養與神經修復領航',
  description: '以林煒醫師「醫療改善症狀，營養打造健康」的理念，透過四大健康主題、十二座葡眾產品島與互動科學圖解，認識精準營養與日常健康。支援大字閱讀及國語語音導覽。',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-TW"><body>{children}</body></html>;
}
