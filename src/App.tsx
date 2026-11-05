import { useCallback, useEffect, useMemo, useState } from 'react';
import { NODES, NODE_BY_ID } from './data/nodes';
import { CORRIDORS } from './data/corridors';
import { PRESETS } from './data/presets';
import { rankNodes } from './lib/scoring';
import type { CulinaryNode } from './types/flavor';
import { WorldMap, type CorridorHighlight } from './components/WorldMap';
import { NodeDrawer } from './components/NodeDrawer';
import { PresetSwitcher } from './components/PresetSwitcher';
import { CorridorPanel } from './components/CorridorPanel';
import { NodeCrest } from './components/FlavorCrest';
import { CrestGallery } from './components/CrestGallery';
import { segmentAt } from './lib/interpolate';

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return hash;
}

export default function App() {
  return useHash() === '#crests' ? <CrestGallery /> : <AtlasPage />;
}

function AtlasPage() {
  const [presetId, setPresetId] = useState(PRESETS[0].id);
  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];
  const ranked = useMemo(() => rankNodes(NODES, preset), [preset]);
  const scores = useMemo(() => new Map(ranked.map((r) => [r.node.id, r.score])), [ranked]);
  const [selected, setSelected] = useState<CulinaryNode | null>(null);
  const close = useCallback(() => setSelected(null), []);
  const [corridorId, setCorridorId] = useState<string | null>(null);
  const [pos, setPos] = useState(0);
  const highlight = useMemo<CorridorHighlight | null>(() => {
    const c = CORRIDORS.find((x) => x.id === corridorId);
    if (!c) return null;
    return { stopIds: c.stops.map((s) => s.nodeId), color: c.themeColor, segment: segmentAt(pos, c.stops.length) };
  }, [corridorId, pos]);

  return (
    <div className="min-h-full px-4 py-5 md:p-8 max-w-6xl mx-auto">
      <header className="mb-5 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">FlavorGradient</h1>
          <p className="text-slate-400 mt-1 text-sm">全球饮食渐变星图 · 本味罗盘 —— 圆点越大越亮，越合你的胃口</p>
        </div>
        <PresetSwitcher presets={PRESETS} value={presetId} onChange={setPresetId} />
      </header>

      <WorldMap
        nodes={NODES}
        scores={scores}
        selectedId={selected?.id ?? null}
        onSelect={setSelected}
        highlight={highlight}
      />

      <div className="mt-6">
        <CorridorPanel
          corridors={CORRIDORS}
          nodeById={NODE_BY_ID}
          corridorId={corridorId}
          pos={pos}
          onCorridorChange={setCorridorId}
          onPosChange={setPos}
        />
      </div>

      <div className="mt-8 max-w-xl">
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
                      <span className="inline-block align-middle mr-2">
                        <NodeCrest node={node} size={28} />
                      </span>
                      {node.name.zh} <span className="text-slate-500 text-sm">{node.name.en}</span>
                    </span>
                    <span className="font-mono">{score}%</span>
                  </div>
                </button>
              </li>
            ))}
          </ol>
        </section>

      </div>

      <NodeDrawer node={selected} score={selected ? scores.get(selected.id) ?? null : null} onClose={close} />
    </div>
  );
}
