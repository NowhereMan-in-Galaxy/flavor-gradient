import type { UserPalatePreset } from '../types/flavor';

interface Props {
  presets: UserPalatePreset[];
  value: string;
  onChange: (id: string) => void;
}

export function PresetSwitcher({ presets, value, onChange }: Props) {
  const current = presets.find((p) => p.id === value);
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-slate-400">我的胃口</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-cardNight border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-400"
      >
        {presets.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      {current && <span className="text-xs text-slate-500 max-w-xs">{current.description}</span>}
    </label>
  );
}
