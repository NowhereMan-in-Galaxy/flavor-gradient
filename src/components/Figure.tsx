import type { ReactNode } from 'react';

interface Props {
  no: number;
  title: string;
  note?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** 学术图版式外框：编号 + 标题 + 一行注释 */
export function Figure({ no, title, note, children, className = '' }: Props) {
  return (
    <figure className={`min-w-0 ${className}`}>
      <figcaption className="flex items-baseline gap-3 border-t border-slate-800 pt-3 mb-3">
        <span className="font-mono text-[11px] tracking-widest text-brass">图 {no}</span>
        <span className="font-serif text-[15px] text-slate-100">{title}</span>
        {note && <span className="ml-auto text-xs text-slate-500 text-right hidden sm:block">{note}</span>}
      </figcaption>
      {children}
    </figure>
  );
}
