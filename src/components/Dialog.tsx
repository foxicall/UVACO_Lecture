'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
export default function Dialog({ title, children, onClose, className = '', hideHeading = false }: { title: string; children: ReactNode; onClose: () => void; className?: string; hideHeading?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const prior = document.activeElement as HTMLElement;
    const dialog = ref.current!;
    dialog.showModal();
    return () => { dialog.close(); prior?.focus(); };
  }, []);
  return <dialog ref={ref} className={`dialog ${className}`} aria-label={title} onCancel={e => { e.preventDefault(); e.stopPropagation(); onClose(); }} onClick={e => { if (e.target === ref.current) onClose(); }}>
    {!hideHeading && <div className="dialog-heading"><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label="關閉視窗"><X /></button></div>}
    {children}
  </dialog>;
}
