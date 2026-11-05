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
import { CrestGallery } from './components/CrestGallery';
import { MenuCompass } from './components/MenuCompass';
import { Figure } from './components/Figure';
import { FlavorSpace } from './components/FlavorSpace';
import { RankTable } from './components/RankTable';
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
  const [corridorId, setCorridorId] = useState<string | null>(CORRIDORS[0].id);
  const [pos, setPos] = useState(0);
  // 走廊默认展开剖面图，但只有用户操作过走廊才联动地图（避免首屏被缩放到局部）
  const [linked, setLinked] = useState(false);
  const highlight = useMemo<CorridorHighlight | null>(() => {
    const c = CORRIDORS.find((x) => x.id === corridorId);
    if (!c || !linked) return null;
    return { stopIds: c.stops.map((s) => s.nodeId), color: c.themeColor, segment: segmentAt(pos, c.stops.length) };
  }, [corridorId, pos, linked]);

  return (
    <div className="min-h-full px-4 py-6 md:px-10 md:py-8 max-w-[1240px] mx-auto">
      <header className="flex flex-col gap-4 mb-6">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="font-serif text-2xl md:text-[28px] tracking-wide">FlavorGradient</h1>
          <span className="font-mono text-[11px] tracking-widest text-slate-500">全球饮食渐变星图 · {NODES.length} 地区</span>
        </div>
        <PresetSwitcher presets={PRESETS} value={presetId} onChange={setPresetId} />
      </header>

      <Figure no={1} title="风味星图" note="颜色 = 风味谱系　大小 = 与你胃口的匹配度">
        <WorldMap nodes={NODES} scores={scores} selectedId={selected?.id ?? null} onSelect={setSelected} highlight={highlight} />
      </Figure>

      <div className="mt-8">
        <MenuCompass nodes={NODES} scores={scores} onShowOnMap={setSelected} />
      </div>

      <div className="mt-10 grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-x-10 gap-y-10">
        <Figure no={2} title="风味空间" note="10 维向量的主成分投影，箭头为维度载荷">
          <FlavorSpace nodes={NODES} scores={scores} selectedId={selected?.id ?? null} onSelect={setSelected} />
        </Figure>
        <Figure no={3} title="匹配度排行" note="右侧色块深浅 = 各维度强度">
          <RankTable ranked={ranked} selectedId={selected?.id ?? null} onSelect={setSelected} />
        </Figure>
      </div>

      <Figure no={4} title="渐变走廊 · 风味剖面" note="行 = 风味维度，列 = 沿地理的连续过渡" className="mt-10">
        <CorridorPanel
          corridors={CORRIDORS}
          nodeById={NODE_BY_ID}
          corridorId={corridorId}
          pos={pos}
          onCorridorChange={(id) => {
            setLinked(true);
            setCorridorId(id);
          }}
          onPosChange={(p) => {
            setLinked(true);
            setPos(p);
          }}
        />
      </Figure>

      <footer className="mt-14 pt-4 border-t border-slate-800 text-[11px] text-slate-600 font-mono">
        数据为编辑估算与公开文献整理，见 docs/SOURCES.md · <a href="#crests" className="hover:text-slate-400">风味纹章图鉴</a>
      </footer>

      <NodeDrawer node={selected} score={selected ? scores.get(selected.id) ?? null : null} onClose={close} />
    </div>
  );
}
