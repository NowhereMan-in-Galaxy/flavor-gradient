import { useEffect, useMemo, useState } from 'react';
import { Compass, Globe2, ListOrdered, MapPin, Orbit } from 'lucide-react';
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
import { FlavorSpace } from './components/FlavorSpace';
import { RankTable } from './components/RankTable';
import { segmentAt } from './lib/interpolate';

type RightTab = 'inspector' | 'space' | 'compass' | 'rank';

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
  return useHash() === '#crests' ? <CrestGallery /> : <AtlasWorkbench />;
}

function AtlasWorkbench() {
  const [presetId, setPresetId] = useState(PRESETS[0].id);
  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];
  const ranked = useMemo(() => rankNodes(NODES, preset), [preset]);
  const scores = useMemo(() => new Map(ranked.map((r) => [r.node.id, r.score])), [ranked]);

  const [selected, setSelected] = useState<CulinaryNode | null>(null);
  const [rightTab, setRightTab] = useState<RightTab>('space');

  // 默认展示當前胃口排第一的本命菜系作为详情锚点
  const inspectedNode = selected ?? ranked[0]?.node ?? NODES[0];

  const [corridorId, setCorridorId] = useState<string | null>(CORRIDORS[0].id);
  const [pos, setPos] = useState(0);
  const [linked, setLinked] = useState(false);

  const activeCorridor = useMemo(
    () => CORRIDORS.find((x) => x.id === corridorId) ?? null,
    [corridorId],
  );

  const highlight = useMemo<CorridorHighlight | null>(() => {
    if (!activeCorridor || !linked) return null;
    return {
      stopIds: activeCorridor.stops.map((s) => s.nodeId),
      color: activeCorridor.themeColor,
      segment: segmentAt(pos, activeCorridor.stops.length),
    };
  }, [activeCorridor, pos, linked]);

  const handleSelectNode = (node: CulinaryNode) => {
    setSelected(node);
    setRightTab('inspector');
  };

  return (
    <div className="min-h-screen bg-[#080B10] text-slate-100 flex flex-col">
      {/* 顶部紧凑导航与胃口调音台 */}
      <header className="border-b border-slate-800/80 bg-[#0A0E15]/90 backdrop-blur-md sticky top-0 z-20 px-4 py-3 md:px-6">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-baseline gap-3">
              <h1 className="font-serif text-xl md:text-2xl tracking-wide text-slate-50 flex items-center gap-2">
                <Globe2 size={20} className="text-brass shrink-0" />
                <span>FlavorGradient</span>
              </h1>
              <span className="font-mono text-[11px] tracking-wider text-slate-400">
                全球饮食渐变地形图 · {NODES.length} 菜系节点 · {CORRIDORS.length} 跨国走廊
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span className="hidden sm:inline text-slate-500">
                色相 = 风味空间位置 (OKLab) · 等高线 = 适口度
              </span>
              <a
                href="#crests"
                className="px-2.5 py-1 rounded-md border border-slate-800 bg-slate-900/70 text-slate-300 hover:text-brass hover:border-slate-700 transition"
              >
                纹章图鉴 →
              </a>
            </div>
          </div>

          <PresetSwitcher presets={PRESETS} value={presetId} onChange={setPresetId} />
        </div>
      </header>

      {/* 核心双栏星图工作台（告别超长纵向瀑布流） */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 py-4 md:px-6 md:py-5 grid lg:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.95fr)] gap-5 items-start">
        {/* 左栏：地形风味星图 + 紧邻其下的跨国走廊实时巡航舱 */}
        <div className="space-y-4 min-w-0">
          <WorldMap
            nodes={NODES}
            scores={scores}
            selectedId={inspectedNode?.id ?? null}
            onSelect={handleSelectNode}
            highlight={highlight}
          />

          <CorridorPanel
            corridors={CORRIDORS}
            nodeById={NODE_BY_ID}
            corridorId={corridorId}
            pos={pos}
            linked={linked}
            onCorridorChange={(id) => {
              setLinked(!!id);
              setCorridorId(id);
            }}
            onPosChange={(p) => {
              setLinked(true);
              setPos(p);
            }}
            onSelectNode={handleSelectNode}
          />
        </div>

        {/* 右栏：多棱镜同步检视台（风味空间 / 地区深潜 / 点菜罗盘 / 适口排行） */}
        <div className="lg:sticky lg:top-[104px] space-y-3 min-w-0">
          {/* 4 合 1 分段切换器 */}
          <div
            role="tablist"
            aria-label="风味检视器切换"
            className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-[#0E131B] border border-slate-800/90 text-xs"
          >
            <button
              role="tab"
              aria-selected={rightTab === 'space'}
              onClick={() => setRightTab('space')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition font-medium ${
                rightTab === 'space'
                  ? 'bg-slate-800/90 text-slate-50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Orbit size={13} className="text-brass shrink-0" />
              <span className="truncate">风味空间</span>
            </button>

            <button
              role="tab"
              aria-selected={rightTab === 'inspector'}
              onClick={() => setRightTab('inspector')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition font-medium ${
                rightTab === 'inspector'
                  ? 'bg-slate-800/90 text-slate-50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MapPin size={13} className="text-emerald-400 shrink-0" />
              <span className="truncate">{inspectedNode.name.zh.replace(/（.*）/, '')}</span>
            </button>

            <button
              role="tab"
              aria-selected={rightTab === 'compass'}
              onClick={() => setRightTab('compass')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition font-medium ${
                rightTab === 'compass'
                  ? 'bg-slate-800/90 text-slate-50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass size={13} className="text-sky-400 shrink-0" />
              <span className="truncate">点菜罗盘</span>
            </button>

            <button
              role="tab"
              aria-selected={rightTab === 'rank'}
              onClick={() => setRightTab('rank')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition font-medium ${
                rightTab === 'rank'
                  ? 'bg-slate-800/90 text-slate-50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListOrdered size={13} className="text-amber-400 shrink-0" />
              <span className="truncate">排行({NODES.length})</span>
            </button>
          </div>

          {/* Tab 1: 风味空间 (PCA 双标图 + 当前选中节点速览卡) */}
          {rightTab === 'space' && (
            <div className="space-y-3 animate-fade-in">
              <div className="rounded-xl border border-slate-800/90 bg-[#0E131B] p-3.5">
                <div className="flex items-baseline justify-between mb-2">
                  <h2 className="font-serif text-sm text-slate-100">
                    10 维风味空间投影 (PCA Biplot)
                  </h2>
                  <span className="text-[11px] font-mono text-slate-400">
                    位置相近 = 色相相同
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  每个菜系在此图中的二维坐标直接决定它在地图上的{' '}
                  <strong className="text-slate-200 font-normal">OKLab 颜色</strong>。点击任意圆点可下钻查看当地烹饪技法与点菜指南。
                </p>
                <FlavorSpace
                  nodes={NODES}
                  scores={scores}
                  selectedId={inspectedNode?.id ?? null}
                  corridorStopIds={activeCorridor?.stops.map((s) => s.nodeId)}
                  onSelect={handleSelectNode}
                />
              </div>

              {/* 底部迷你当前节点速览条，一点即进详情 */}
              {inspectedNode && (
                <div className="rounded-xl border border-slate-800/90 bg-[#0E131B] p-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono text-slate-400">
                      当前聚焦 · 适口度 {scores.get(inspectedNode.id)}%
                    </div>
                    <div className="font-serif text-base text-slate-100 truncate">
                      {inspectedNode.name.zh} ·{' '}
                      <span className="text-xs font-sans text-slate-400">
                        {inspectedNode.flavorPrinciple.summaryChord}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setRightTab('inspector')}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-brass/15 border border-brass/60 text-xs text-slate-100 hover:bg-brass/25 transition"
                  >
                    查看点菜与技法 →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: 节点深潜 (内嵌式完整详情面板) */}
          {rightTab === 'inspector' && (
            <div className="animate-fade-in">
              <NodeDrawer
                node={inspectedNode}
                allNodes={NODES}
                score={scores.get(inspectedNode.id) ?? null}
                inline
                onClose={() => setRightTab('space')}
                onSelectNode={handleSelectNode}
              />
            </div>
          )}

          {/* Tab 3: 餐厅点菜罗盘 */}
          {rightTab === 'compass' && (
            <div className="rounded-xl border border-slate-800/90 bg-[#0E131B] p-4 animate-fade-in">
              <MenuCompass
                nodes={NODES}
                scores={scores}
                onShowOnMap={handleSelectNode}
              />
            </div>
          )}

          {/* Tab 4: 43 地区适口排行榜 */}
          {rightTab === 'rank' && (
            <div className="animate-fade-in">
              <RankTable
                ranked={ranked}
                selectedId={inspectedNode?.id ?? null}
                onSelect={handleSelectNode}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
