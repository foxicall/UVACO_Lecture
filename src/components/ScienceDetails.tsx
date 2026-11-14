import type { ReactNode } from 'react';
import { scienceLabel } from '@/data/everyday-language';

export default function ScienceDetails({children}:{children:ReactNode}) {
  return <details className="science-details"><summary>{scienceLabel}</summary><div className="science-content">{children}</div></details>;
}
