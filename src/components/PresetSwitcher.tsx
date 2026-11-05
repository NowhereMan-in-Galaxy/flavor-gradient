import type { UserPalatePreset } from '../types/flavor';

interface Props {
  presets: UserPalatePreset[];
  value: string;
  onChange: (id: string) => void;
}

/** 胃口预设：一行可横向滚动的标签，悬停显示说明 */
export function PresetSwitcher({ presets, value, onChange }: Props) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <span className="font-mono text-[11px] tracking-widest text-slate-500 shrink-0">胃口</span>
      <div role="radiogroup" aria-label="我的胃口" className="flex gap-1 overflow-x-auto no-scrollbar -my-1 py-1">
        {presets.map((p) => (
          <button
            key={p.id}
            role="radio"
            aria-checked={p.id === value}
            title={p.description}
            onClick={() => onChange(p.id)}
            className={`shrink-0 text-[13px] px-3 py-1.5 rounded-full border transition-colors ${
              p.id === value
                ? 'border-brass text-slate-50 bg-brass/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}
