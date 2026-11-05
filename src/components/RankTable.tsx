import type { CulinaryNode } from '../types/flavor';
import { VECTOR_KEYS, VECTOR_LABELS_ZH } from '../lib/scoring';
import { nodeTone } from '../lib/color';

interface Props {
  ranked: { node: CulinaryNode; score: number }[];
  selectedId: string | null;
  onSelect: (node: CulinaryNode) => void;
}

/** 匹配度排行：紧凑可滚动热力谱，绝不把页面无限拉长 */
export function RankTable({ ranked, selectedId, onSelect }: Props) {
  return (
    <div className="rounded-xl border border-slate-800/80 bg-[#0A0E15] overflow-hidden text-[13px]">
      <div className="sticky top-0 z-10 bg-[#0E131B] grid grid-cols-[1.6rem_minmax(0,1fr)_5.2rem_7.2rem] gap-2 items-end px-3 py-2 border-b border-slate-800 text-[10px] text-slate-400">
        <span className="font-mono">#</span>
        <span>地区 / 菜系</span>
        <span className="font-mono text-right pr-1">适口度</span>
        <span className="grid grid-cols-10 text-center font-mono">
          {VECTOR_KEYS.map((k) => (
            <span key={k} title={VECTOR_LABELS_ZH[k]}>
              {VECTOR_LABELS_ZH[k][0]}
            </span>
          ))}
        </span>
      </div>
      <ol className="max-h-[58vh] overflow-y-auto divide-y divide-slate-900/80">
        {ranked.map(({ node, score }, i) => {
          const tone = nodeTone(node);
          const sel = node.id === selectedId;
          return (
            <li key={node.id}>
              <button
                onClick={() => onSelect(node)}
                className={`w-full grid grid-cols-[1.6rem_minmax(0,1fr)_5.2rem_7.2rem] gap-2 items-center px-3 py-2 text-left transition-colors ${
                  sel ? 'bg-slate-800/80 text-white' : 'hover:bg-slate-900/70 text-slate-200'
                }`}
              >
                <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="truncate font-serif flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: tone }} />
                  <span className="truncate">{node.name.zh}</span>
                </span>
                <span className="relative h-3 flex items-center">
                  <span className="absolute inset-x-0 h-px bg-slate-800" />
                  <span className="absolute h-0.5 rounded" style={{ width: `${score * 0.68}%`, background: tone }} />
                  <span
                    className="absolute w-1.5 h-1.5 rounded-full -translate-x-1/2"
                    style={{ left: `${score * 0.68}%`, background: tone }}
                  />
                  <span className="absolute right-0 font-mono text-[11px] text-slate-200 tabular-nums">
                    {score}%
                  </span>
                </span>
                <span className="grid grid-cols-10 gap-px h-3 rounded-sm overflow-hidden">
                  {VECTOR_KEYS.map((k) => (
                    <span
                      key={k}
                      style={{ background: tone, opacity: 0.08 + (node.sensoryVector[k] / 10) * 0.88 }}
                    />
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
