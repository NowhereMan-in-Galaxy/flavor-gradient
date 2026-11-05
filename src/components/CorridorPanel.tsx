import type { CulinaryNode, FlavorCorridor } from '../types/flavor';
import { lerpVector, segmentAt } from '../lib/interpolate';
import { muted } from '../lib/color';
import { VECTOR_KEYS, VECTOR_LABELS_ZH } from '../lib/scoring';
import { NodeCrest } from './FlavorCrest';

interface Props {
  corridors: FlavorCorridor[];
  nodeById: ReadonlyMap<string, CulinaryNode>;
  corridorId: string | null;
  pos: number;
  onCorridorChange: (id: string | null) => void;
  onPosChange: (pos: number) => void;
}

const MORPH_FIELDS = [
  ['wrapperOrBase', '皮 / 底'],
  ['fillingOrProtein', '馅 / 主料'],
  ['soulDipOrSauce', '灵魂蘸料'],
  ['cookingShift', '做法'],
] as const;

export function CorridorPanel({ corridors, nodeById, corridorId, pos, onCorridorChange, onPosChange }: Props) {
  const corridor = corridors.find((c) => c.id === corridorId) ?? null;

  return (
    <section>
      <div className="flex flex-wrap gap-1 mb-4">
        {corridors.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              onCorridorChange(c.id === corridorId ? null : c.id);
              onPosChange(0);
            }}
            aria-pressed={c.id === corridorId}
            className={`text-[13px] rounded-full px-3 py-1.5 border transition-colors ${
              c.id === corridorId ? 'border-brass text-slate-50 bg-brass/10' : 'border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {c.title.zh}
          </button>
        ))}
      </div>

      {corridor ? <CorridorBody corridor={corridor} nodeById={nodeById} pos={pos} onPosChange={onPosChange} /> : (
        <p className="text-sm text-slate-500">选一条走廊，看风味沿地理一站站渐变。</p>
      )}
    </section>
  );
}

function CorridorBody({
  corridor,
  nodeById,
  pos,
  onPosChange,
}: {
  corridor: FlavorCorridor;
  nodeById: ReadonlyMap<string, CulinaryNode>;
  pos: number;
  onPosChange: (pos: number) => void;
}) {
  const stops = corridor.stops;
  const last = stops.length - 1;
  const { i, t } = segmentAt(pos, stops.length);
  const a = nodeById.get(stops[i].nodeId);
  const b = nodeById.get(stops[i + 1].nodeId);
  if (!a || !b) return null;
  const vector = lerpVector(a.sensoryVector, b.sensoryVector, t);
  const color = muted(corridor.themeColor);
  const nearest = Math.round(Math.min(last, Math.max(0, pos)));
  const stop = stops[nearest];
  const stopNode = nodeById.get(stop.nodeId);

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
    <div>
      <p className="text-sm text-slate-300 font-serif">{corridor.morphingConceptName}</p>
      <p className="text-xs text-slate-500 mt-1 max-w-3xl">{corridor.scientificDriver}</p>

      <Transect corridor={corridor} nodeById={nodeById} pos={pos} color={color} onPosChange={onPosChange} vector={vector} />

      <div className="grid grid-cols-[5rem_minmax(0,1fr)_2rem] gap-x-2 mt-1">
      <span />
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
        className="w-full"
        style={{ accentColor: '#C8A96E' }}
      />
      </div>

      <div key={nearest} className="animate-fade-in mt-4 grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-8 gap-y-3 text-sm">
        <div className="flex items-start gap-3">
          {stopNode && <NodeCrest node={stopNode} size={40} />}
          <div className="min-w-0">
            <div className="font-serif text-slate-100">
              {stop.representativeDishMorph.dishName} <span className="text-slate-500 text-xs">· {stopNode?.name.zh}</span>
            </div>
            <p className="text-slate-400 text-[13px] mt-0.5">{stop.transitionNote}</p>
          </div>
        </div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 text-[13px]">
          {MORPH_FIELDS.map(([k, label]) => (
            <div key={k} className="contents">
              <dt className="text-slate-500">{label}</dt>
              <dd className="text-slate-300">{stop.representativeDishMorph[k]}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

const COLS = 64;

/** 风味剖面图：行 = 10 维，列 = 沿走廊的连续采样（站点之间线性插值），像地质剖面一样读渐变 */
function Transect({
  corridor,
  nodeById,
  pos,
  color,
  vector,
  onPosChange,
}: {
  corridor: FlavorCorridor;
  nodeById: ReadonlyMap<string, CulinaryNode>;
  pos: number;
  color: string;
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
    return lerpVector(a, b, t);
  });
  const W = 800;
  const rowH = 16;
  const H = VECTOR_KEYS.length * rowH;
  const cw = W / (COLS + 1);
  const cx = (pos / last) * (W - cw) + cw / 2;
  const onClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    onPosChange(Math.max(0, Math.min(last, ((e.clientX - r.left) / r.width) * last)));
  };
  return (
    <div className="mt-4 grid grid-cols-[5rem_minmax(0,1fr)_2rem] gap-x-2">
      <div className="text-[11px] text-slate-500 leading-4">
        {VECTOR_KEYS.map((k) => (
          <div key={k} className="truncate">{VECTOR_LABELS_ZH[k]}</div>
        ))}
      </div>
      <div className="min-w-0">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full cursor-crosshair block" style={{ height: H }} shapeRendering="crispEdges" onClick={onClick} role="img" aria-label="风味剖面图">
          {cols.map((v, c) =>
            VECTOR_KEYS.map((k, r) => (
              <rect key={`${c}-${k}`} x={c * cw} y={r * rowH + 1} width={cw + 0.5} height={rowH - 2} fill={color} opacity={0.03 + Math.pow(v[k] / 10, 1.7) * 0.97} />
            )),
          )}
          {stops.map((s, i) => {
            const x = (i / last) * (W - cw) + cw / 2;
            return <line key={s.nodeId} x1={x} x2={x} y1={0} y2={H} stroke="#0D0F12" strokeWidth={1.5} />;
          })}
          <line x1={cx} x2={cx} y1={0} y2={H} stroke="#F4F2EE" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
        </svg>
        <ol className="relative h-5 mt-1 text-[11px]">
          {stops.map((s, i) => (
            <li key={s.nodeId} className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${(i / last) * 100}%` }}>
              <button onClick={() => onPosChange(i)} className={Math.round(pos) === i ? 'text-slate-100' : 'text-slate-500 hover:text-slate-300'}>
                {nodeById.get(s.nodeId)?.name.zh.replace(/（.*）/, '')}
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div className="font-mono text-[11px] leading-4 text-slate-300 tabular-nums text-right">
        {VECTOR_KEYS.map((k) => (
          <div key={k}>{vector[k].toFixed(1)}</div>
        ))}
      </div>
    </div>
  );
}
