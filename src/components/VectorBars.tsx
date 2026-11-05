import { VECTOR_KEYS, VECTOR_LABELS_ZH } from '../lib/scoring';
import type { SensoryVector10D } from '../types/flavor';

interface Props {
  vector: SensoryVector10D;
  color: string;
}

/** 10 维点线图：细刻度线 + 端点圆点（节点抽屉共用） */
export function VectorBars({ vector, color }: Props) {
  return (
    <div className="space-y-1">
      {VECTOR_KEYS.map((k) => (
        <div key={k} className="grid grid-cols-[4.5rem_1fr_2rem] items-center gap-2 text-xs">
          <span className="text-slate-400">{VECTOR_LABELS_ZH[k]}</span>
          <div className="relative h-3">
            <div className="absolute inset-x-0 top-1/2 h-px bg-slate-800" />
            <div className="absolute left-0 top-1/2 h-px transition-[width] duration-300" style={{ width: `${vector[k] * 10}%`, background: color }} />
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-[left] duration-300"
              style={{ left: `${vector[k] * 10}%`, background: color }}
            />
          </div>
          <span className="text-right font-mono tabular-nums text-slate-300">{Number.isInteger(vector[k]) ? vector[k] : vector[k].toFixed(1)}</span>
        </div>
      ))}
    </div>
  );
}
