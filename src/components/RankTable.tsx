import type { CulinaryNode } from '../types/flavor';
import { VECTOR_KEYS, VECTOR_LABELS_ZH } from '../lib/scoring';
import { nodeTone } from '../lib/color';

interface Props {
  ranked: { node: CulinaryNode; score: number }[];
  selectedId: string | null;
  onSelect: (node: CulinaryNode) => void;
}

/** 匹配度排行：点线图 + 10 维热力条（小倍数） */
export function RankTable({ ranked, selectedId, onSelect }: Props) {
  return (
    <div className="text-[13px]">
      <div className="grid grid-cols-[1.5rem_minmax(0,1fr)_5.5rem_7.5rem] gap-2 items-end pb-1.5 border-b border-slate-800 text-[10px] text-slate-500">
        <span />
        <span />
        <span className="font-mono">匹配度</span>
        <span className="grid grid-cols-10 text-center">
          {VECTOR_KEYS.map((k) => (
            <span key={k} title={VECTOR_LABELS_ZH[k]}>{VECTOR_LABELS_ZH[k][0]}</span>
          ))}
        </span>
      </div>
      <ol>
        {ranked.map(({ node, score }, i) => {
          const tone = nodeTone(node);
          const sel = node.id === selectedId;
          return (
            <li key={node.id}>
              <button
                onClick={() => onSelect(node)}
                className={`w-full grid grid-cols-[1.5rem_minmax(0,1fr)_5.5rem_7.5rem] gap-2 items-center py-1.5 text-left border-b border-slate-900 hover:bg-slate-900/60 ${
                  sel ? 'bg-slate-900' : ''
                }`}
              >
                <span className="font-mono text-[11px] text-slate-600 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <span className={`truncate font-serif ${sel ? 'text-slate-50' : 'text-slate-200'}`}>{node.name.zh}</span>
                <span className="relative h-3 flex items-center">
                  <span className="absolute inset-x-0 h-px bg-slate-800" />
                  <span className="absolute h-px" style={{ width: `${score * 0.7}%`, background: tone }} />
                  <span className="absolute w-1.5 h-1.5 rounded-full -translate-x-1/2" style={{ left: `${score * 0.7}%`, background: tone }} />
                  <span className="absolute right-0 font-mono text-[11px] text-slate-300 tabular-nums">{score}</span>
                </span>
                <span className="grid grid-cols-10 gap-px h-3">
                  {VECTOR_KEYS.map((k) => (
                    <span key={k} style={{ background: tone, opacity: 0.06 + node.sensoryVector[k] / 11 }} />
                  ))}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
