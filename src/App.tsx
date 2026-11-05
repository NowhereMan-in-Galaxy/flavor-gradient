import { useCallback, useMemo, useState } from 'react';
import { NODES } from './data/nodes';
import { CORRIDORS } from './data/corridors';
import { PRESETS } from './data/presets';
import { rankNodes } from './lib/scoring';
import { nodeColor } from './lib/color';
import type { CulinaryNode } from './types/flavor';
import { WorldMap } from './components/WorldMap';
import { NodeDrawer } from './components/NodeDrawer';
import { PresetSwitcher } from './components/PresetSwitcher';

export default function App() {
  const [presetId, setPresetId] = useState(PRESETS[0].id);
  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];
  const ranked = useMemo(() => rankNodes(NODES, preset), [preset]);
  const scores = useMemo(() => new Map(ranked.map((r) => [r.node.id, r.score])), [ranked]);
  const [selected, setSelected] = useState<CulinaryNode | null>(null);
  const close = useCallback(() => setSelected(null), []);

  return (
    <div className="min-h-full px-4 py-5 md:p-8 max-w-6xl mx-auto">
      <header className="mb-5 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">FlavorGradient</h1>
          <p className="text-slate-400 mt-1 text-sm">全球饮食渐变星图 · 本味罗盘 —— 圆点越大越亮，越合你的胃口</p>
        </div>
        <PresetSwitcher presets={PRESETS} value={presetId} onChange={setPresetId} />
      </header>

      <WorldMap nodes={NODES} scores={scores} selectedId={selected?.id ?? null} onSelect={setSelected} />

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <section className="min-w-0">
          <h2 className="text-sm uppercase text-slate-500 mb-3">匹配度排行</h2>
          <ol className="space-y-1.5">
            {ranked.map(({ node, score }, i) => (
              <li key={node.id}>
                <button
                  onClick={() => setSelected(node)}
                  className={`w-full text-left rounded-lg px-4 py-2.5 bg-cardNight border transition ${
                    selected?.id === node.id ? 'border-emerald-400' : 'border-transparent hover:border-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-center gap-2">
                    <span className="truncate">
                      <span className="text-slate-600 font-mono text-xs w-5 inline-block">{i + 1}</span>
                      <span className="inline-block w-2.5 h-2.5 rounded-full mr-2" style={{ background: nodeColor(node) }} />
                      {node.name.zh} <span className="text-slate-500 text-sm">{node.name.en}</span>
                    </span>
                    <span className="font-mono">{score}%</span>
                  </div>
                </button>
              </li>
            ))}
          </ol>
        </section>

        <section className="min-w-0">
          <h2 className="text-sm uppercase text-slate-500 mb-3">渐变走廊</h2>
          <div className="space-y-4">
            {CORRIDORS.map((c) => (
              <div key={c.id} className="rounded-xl bg-cardNight p-4">
                <h3 className="font-semibold">{c.title.zh}</h3>
                <p className="text-slate-400 text-sm">{c.subtitle}</p>
                <div
                  className="h-1 rounded my-3"
                  style={{ background: `linear-gradient(90deg, ${c.gradientColors.join(',')})` }}
                />
                <p className="text-xs text-slate-500">{c.stops.map((s) => s.representativeDishMorph.dishName).join(' → ')}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <NodeDrawer node={selected} score={selected ? scores.get(selected.id) ?? null : null} onClose={close} />
    </div>
  );
}
