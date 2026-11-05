import { ChevronLeft, ChevronRight, Compass, MapPin, Mountain, Sparkles, X } from 'lucide-react';
import type { CulinaryNode, FlavorCorridor } from '../types/flavor';
import { lerpVector, segmentAt } from '../lib/interpolate';
import { nodeTone, vectorToColor } from '../lib/color';
import { VECTOR_KEYS, VECTOR_LABELS_ZH } from '../lib/scoring';
import { NodeCrest } from './FlavorCrest';

interface Props {
  corridors: FlavorCorridor[];
  nodeById: ReadonlyMap<string, CulinaryNode>;
  corridorId: string | null;
  pos: number;
  linked?: boolean;
  onCorridorChange: (id: string | null) => void;
  onPosChange: (pos: number) => void;
  onSelectNode?: (node: CulinaryNode) => void;
}

const MORPH_FIELDS = [
  ['wrapperOrBase', '皮 / 基底'],
  ['fillingOrProtein', '馅 / 主料'],
  ['soulDipOrSauce', '灵魂蘸料'],
  ['cookingShift', '火候与技法演进'],
] as const;

export function CorridorPanel({
  corridors,
  nodeById,
  corridorId,
  pos,
  linked,
  onCorridorChange,
  onPosChange,
  onSelectNode,
}: Props) {
  const corridor = corridors.find((c) => c.id === corridorId) ?? null;

  return (
    <section className="rounded-xl border border-slate-800/90 bg-[#0E131B]/95 backdrop-blur-md p-4 md:p-5 shadow-xl">
      {/* 顶部标题与走廊切换胶囊栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Compass size={16} className="text-brass shrink-0" />
          <h2 className="font-serif text-[15px] text-slate-100">跨国饮食渐变走廊</h2>
          <span className="text-xs text-slate-500 hidden md:inline">
            · 拖动站点滑块，上方地图探针与 10 维风味剖面实时联动
          </span>
        </div>
        {linked && corridor && (
          <button
            onClick={() => onCorridorChange(null)}
            className="self-start sm:self-auto inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-100 px-2.5 py-1 rounded-md bg-slate-800/70 border border-slate-700/60"
          >
            <X size={12} />
            退出走廊聚焦（恢复全球视野）
          </button>
        )}
      </div>

      {/* 5 条走廊选择器 */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {corridors.map((c) => {
          const active = c.id === corridorId;
          return (
            <button
              key={c.id}
              onClick={() => {
                onCorridorChange(active && linked ? null : c.id);
                onPosChange(0);
              }}
              aria-pressed={active}
              className={`group text-xs md:text-[13px] rounded-lg px-3 py-1.5 border transition-all flex items-center gap-2 ${
                active
                  ? 'border-brass/80 text-slate-50 bg-brass/15 shadow-sm'
                  : 'border-slate-800 bg-[#0A0E15]/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: c.themeColor }}
              />
              <span>{c.title.zh}</span>
              <span className="font-mono text-[10px] text-slate-500 group-hover:text-slate-400">
                {c.stops.length}站
              </span>
            </button>
          );
        })}
      </div>

      {corridor ? (
        <CorridorBody
          corridor={corridor}
          nodeById={nodeById}
          pos={pos}
          onPosChange={onPosChange}
          onSelectNode={onSelectNode}
        />
      ) : (
        <div className="py-6 text-center text-sm text-slate-400">
          点选上方任意一条跨国走廊，即可在地图上开启轨迹巡航与同源食物变形记。
        </div>
      )}
    </section>
  );
}

function CorridorBody({
  corridor,
  nodeById,
  pos,
  onPosChange,
  onSelectNode,
}: {
  corridor: FlavorCorridor;
  nodeById: ReadonlyMap<string, CulinaryNode>;
  pos: number;
  onPosChange: (pos: number) => void;
  onSelectNode?: (node: CulinaryNode) => void;
}) {
  const stops = corridor.stops;
  const last = stops.length - 1;
  const { i, t } = segmentAt(pos, stops.length);
  const a = nodeById.get(stops[i].nodeId);
  const b = nodeById.get(stops[i + 1].nodeId);
  if (!a || !b) return null;

  const vector = lerpVector(a.sensoryVector, b.sensoryVector, t);
  const currentColor = vectorToColor(vector);
  const nearest = Math.round(Math.min(last, Math.max(0, pos)));
  const stop = stops[nearest];
  const stopNode = nodeById.get(stop.nodeId);
  const nextStop = i < last && t > 0.15 ? stops[i + 1] : null;
  const nextNode = nextStop ? nodeById.get(nextStop.nodeId) : null;

  // 插值海拔与年均温，直观展示地理/气候驱动力
  const interpElev = Math.round(
    a.climate.elevationMeters + (b.climate.elevationMeters - a.climate.elevationMeters) * t,
  );
  const interpTemp = (
    a.climate.avgTempCelsius +
    (b.climate.avgTempCelsius - a.climate.avgTempCelsius) * t
  ).toFixed(1);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      onPosChange(Math.min(last, Math.floor(pos + 1e-6) + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      onPosChange(Math.max(0, Math.ceil(pos - 1e-6) - 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      onPosChange(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      onPosChange(last);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      {/* 走廊主题与地理气候驱动力 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 bg-[#0A0E15]/80 rounded-lg px-3.5 py-2.5 border border-slate-800/70">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-serif text-sm text-slate-100">{corridor.morphingConceptName}</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-brass">
              第 {nearest + 1} / {stops.length} 站
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{corridor.scientificDriver}</p>
        </div>

        {/* 实时海拔与气候遥测仪 */}
        <div className="flex items-center gap-3 shrink-0 font-mono text-xs bg-[#0E131B] px-3 py-1.5 rounded-md border border-slate-800">
          <span className="flex items-center gap-1 text-slate-300" title="当前插值位置海拔">
            <Mountain size={13} className="text-slate-400" />
            {interpElev}m
          </span>
          <span className="w-px h-3 bg-slate-800" />
          <span className="text-amber-300/90" title="当前插值位置年均温">
            {interpTemp}°C
          </span>
        </div>
      </div>

      {/* 交互式站点轨道（Station Stepper + 连续滑块） */}
      <div className="bg-[#0A0E15]/60 rounded-lg p-3 border border-slate-800/60">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPosChange(Math.max(0, nearest - 1))}
            disabled={pos <= 0}
            className="p-1.5 rounded-md border border-slate-800 bg-slate-900 text-slate-300 hover:text-white disabled:opacity-30"
            title="上一站"
            aria-label="上一站"
          >
            <ChevronLeft size={15} />
          </button>

          <div className="flex-1 min-w-0">
            {/* 站点里程碑按钮 */}
            <ol className="flex items-center justify-between mb-2">
              {stops.map((s, idx) => {
                const n = nodeById.get(s.nodeId);
                const isCurrent = nearest === idx;
                const dotColor = n ? nodeTone(n) : corridor.themeColor;
                return (
                  <li key={s.nodeId} className="flex flex-col items-center">
                    <button
                      onClick={() => onPosChange(idx)}
                      className={`group flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition ${
                        isCurrent
                          ? 'bg-slate-800/90 text-white font-medium ring-1 ring-brass/60'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform group-hover:scale-125"
                        style={{
                          background: dotColor,
                          boxShadow: isCurrent ? `0 0 8px ${dotColor}` : undefined,
                        }}
                      />
                      <span className="font-mono text-[10px] text-slate-500">0{idx + 1}</span>
                      <span className="hidden sm:inline">{n?.name.zh.replace(/（.*）/, '')}</span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <input
              type="range"
              min={0}
              max={last}
              step={0.01}
              value={pos}
              onChange={(e) => onPosChange(Number(e.target.value))}
              onKeyDown={onKeyDown}
              aria-label={`${corridor.title.zh}：拖动在各站之间过渡，←/→ 切换站点`}
              aria-valuetext={`${stopNode?.name.zh ?? ''}（第 ${nearest + 1}/${stops.length} 站）`}
              className="w-full h-1.5 rounded-lg cursor-pointer"
              style={{ accentColor: currentColor }}
            />
          </div>

          <button
            onClick={() => onPosChange(Math.min(last, nearest + 1))}
            disabled={pos >= last}
            className="p-1.5 rounded-md border border-slate-800 bg-slate-900 text-slate-300 hover:text-white disabled:opacity-30"
            title="下一站"
            aria-label="下一站"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* 下半部：左侧「同源食物变形记」卡片 + 右侧「OKLab 全彩 10 维连续剖面图」 */}
      <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.15fr)] gap-4 items-stretch">
        {/* 左侧：同源食物变形舞台 */}
        <div
          key={nearest}
          className="animate-fade-in rounded-lg border border-slate-800/80 bg-[#0A0E15]/90 p-4 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                {stopNode && <NodeCrest node={stopNode} size={44} />}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif text-base text-slate-50">
                      {stop.representativeDishMorph.dishName}
                    </span>
                    {stopNode && (
                      <button
                        onClick={() => onSelectNode?.(stopNode)}
                        className="inline-flex items-center gap-0.5 text-xs text-brass hover:underline"
                      >
                        <MapPin size={11} />
                        {stopNode.name.zh}
                      </button>
                    )}
                  </div>
                  <p className="text-slate-300 text-xs mt-1 leading-relaxed">{stop.transitionNote}</p>
                </div>
              </div>

              {nextStop && nextNode && (
                <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 bg-slate-900/90 border border-slate-800 px-2 py-1 rounded shrink-0">
                  <Sparkles size={11} className="text-brass" />
                  <span>正过渡往 {nextNode.name.zh.replace(/（.*）/, '')}</span>
                </div>
              )}
            </div>

            {/* 4 宫格变形要素拆解 */}
            <dl className="grid grid-cols-2 gap-2.5 mt-3.5 text-xs">
              {MORPH_FIELDS.map(([k, label]) => (
                <div key={k} className="rounded-md bg-[#111622] border border-slate-800/70 px-3 py-2">
                  <dt className="text-[10.5px] font-mono text-slate-400 uppercase">{label}</dt>
                  <dd className="text-slate-100 mt-0.5 font-medium">
                    {stop.representativeDishMorph[k]}
                  </dd>
                  {nextStop && nextStop.representativeDishMorph[k] !== stop.representativeDishMorph[k] && (
                    <dd className="text-[11px] text-slate-400 mt-0.5 truncate">
                      → {nextStop.representativeDishMorph[k]}
                    </dd>
                  )}
                </div>
              ))}
            </dl>
          </div>

          {stopNode && (
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>当地风味和弦：{stopNode.flavorPrinciple.summaryChord}</span>
              <span className="font-mono text-slate-500">
                海拔 {stopNode.climate.elevationMeters}m
              </span>
            </div>
          )}
        </div>

        {/* 右侧：OKLab 全彩 10 维连续剖面图 */}
        <div className="rounded-lg border border-slate-800/80 bg-[#0A0E15]/90 p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-serif text-slate-200">10 维风味连续光谱剖面（点击任意列直接跳转）</span>
            <span className="font-mono text-[11px] text-slate-500">OKLab 感知色彩插值</span>
          </div>
          <Transect
            corridor={corridor}
            nodeById={nodeById}
            pos={pos}
            onPosChange={onPosChange}
            vector={vector}
          />
        </div>
      </div>
    </div>
  );
}

const COLS = 60;

/** 风味剖面图：每一列使用其插值向量在风味空间对应的真实 OKLab 色彩，呈现彩虹光谱式风味过渡 */
function Transect({
  corridor,
  nodeById,
  pos,
  vector,
  onPosChange,
}: {
  corridor: FlavorCorridor;
  nodeById: ReadonlyMap<string, CulinaryNode>;
  pos: number;
  vector: ReturnType<typeof lerpVector>;
  onPosChange: (pos: number) => void;
}) {
  const stops = corridor.stops;
  const last = stops.length - 1;
  const cols = Array.from({ length: COLS + 1 }, (_, c) => {
    const p = (c / COLS) * last;
    const { i, t } = segmentAt(p, stops.length);
    const a = nodeById.get(stops[i].nodeId)!.sensoryVector;
    const b = nodeById.get(stops[i + 1].nodeId)!.sensoryVector;
    const v = lerpVector(a, b, t);
    return { v, colHex: vectorToColor(v, 0.74) };
  });

  const W = 720;
  const rowH = 15;
  const H = VECTOR_KEYS.length * rowH;
  const cw = W / (COLS + 1);
  const cx = (pos / last) * (W - cw) + cw / 2;

  const onClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    onPosChange(Math.max(0, Math.min(last, ((e.clientX - r.left) / r.width) * last)));
  };

  return (
    <div className="grid grid-cols-[4.6rem_minmax(0,1fr)_2rem] gap-x-2 items-start">
      <div className="text-[11px] text-slate-400 leading-[15px]">
        {VECTOR_KEYS.map((k) => (
          <div key={k} className="truncate">
            {VECTOR_LABELS_ZH[k]}
          </div>
        ))}
      </div>
      <div className="min-w-0">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="w-full cursor-crosshair block rounded overflow-hidden"
          style={{ height: H }}
          shapeRendering="crispEdges"
          onClick={onClick}
          role="img"
          aria-label="风味剖面图"
        >
          {cols.map(({ v, colHex }, c) =>
            VECTOR_KEYS.map((k, r) => (
              <rect
                key={`${c}-${k}`}
                x={c * cw}
                y={r * rowH + 1}
                width={cw + 0.6}
                height={rowH - 2}
                fill={colHex}
                opacity={0.05 + Math.pow(v[k] / 10, 1.55) * 0.92}
              />
            )),
          )}
          {stops.map((s, i) => {
            const x = (i / last) * (W - cw) + cw / 2;
            return <line key={s.nodeId} x1={x} x2={x} y1={0} y2={H} stroke="#080B10" strokeWidth={1.6} />;
          })}
          <line
            x1={cx}
            x2={cx}
            y1={0}
            y2={H}
            stroke="#FFFFFF"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <ol className="relative h-5 mt-1 text-[10.5px]">
          {stops.map((s, i) => (
            <li
              key={s.nodeId}
              className="absolute -translate-x-1/2 whitespace-nowrap"
              style={{ left: `${(i / last) * 100}%` }}
            >
              <button
                onClick={() => onPosChange(i)}
                className={
                  Math.round(pos) === i
                    ? 'text-slate-100 font-medium'
                    : 'text-slate-500 hover:text-slate-300'
                }
              >
                {nodeById.get(s.nodeId)?.name.zh.replace(/（.*）/, '')}
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div className="font-mono text-[11px] leading-[15px] text-slate-200 tabular-nums text-right">
        {VECTOR_KEYS.map((k) => (
          <div key={k}>{vector[k].toFixed(1)}</div>
        ))}
      </div>
    </div>
  );
}
