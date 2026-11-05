import type { UserPalatePreset } from '../types/flavor';
import { vectorToColor } from '../lib/color';

interface Props {
  presets: UserPalatePreset[];
  value: string;
  onChange: (id: string) => void;
}

/** 胃口预设：带 OKLab 风味色标的一行可横向滚动胶囊选择器 */
export function PresetSwitcher({ presets, value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <span className="font-mono text-[11px] uppercase tracking-widest text-slate-400 shrink-0">
        我的胃口
      </span>
      <div
        role="radiogroup"
        aria-label="我的胃口"
        className="flex gap-1.5 overflow-x-auto no-scrollbar -my-1 py-1"
      >
        {presets.map((p) => {
          const active = p.id === value;
          const dotColor = vectorToColor(p.idealVector);
          return (
            <button
              key={p.id}
              role="radio"
              aria-checked={active}
              title={p.description}
              onClick={() => onChange(p.id)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
                active
                  ? 'border-brass/90 text-slate-50 bg-brass/15 font-medium shadow-sm'
                  : 'border-slate-800/80 bg-[#0E131B]/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  background: dotColor,
                  boxShadow: active ? `0 0 6px ${dotColor}` : undefined,
                }}
              />
              <span>{p.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
