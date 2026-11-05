import { VECTOR_KEYS, VECTOR_LABELS_ZH } from '../lib/scoring';
import type { SensoryVector10D } from '../types/flavor';

interface Props {
  vector: SensoryVector10D;
  color: string;
}

/** 10 维条形图（节点抽屉与走廊面板共用） */
export function VectorBars({ vector, color }: Props) {
  return (
    <div className="space-y-1.5">
      {VECTOR_KEYS.map((k) => (
        <div key={k} className="flex items-center gap-2 text-xs">
          <span className="w-16 shrink-0 text-slate-400">{VECTOR_LABELS_ZH[k]}</span>
          <div className="flex-1 h-1.5 bg-slate-800 rounded">
            <div
              className="h-1.5 rounded transition-[width] duration-300"
              style={{ width: `${vector[k] * 10}%`, background: color }}
            />
          </div>
          <span className="w-6 text-right font-mono">{Number.isInteger(vector[k]) ? vector[k] : vector[k].toFixed(1)}</span>
        </div>
      ))}
    </div>
  );
}
