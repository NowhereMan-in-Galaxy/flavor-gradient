import type { CulinaryNode, FlavorCorridor } from '../types/flavor';
import { lerpVector, segmentAt } from '../lib/interpolate';
import { mixHex, nodeColor } from '../lib/color';
import { VectorBars } from './VectorBars';
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
    <section className="rounded-xl bg-cardNight p-4">
      <h2 className="text-sm uppercase text-slate-500 mb-3">渐变走廊</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {corridors.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              onCorridorChange(c.id === corridorId ? null : c.id);
              onPosChange(0);
            }}
            aria-pressed={c.id === corridorId}
            className={`text-sm rounded-full px-3 py-1.5 border transition ${
              c.id === corridorId ? 'text-white' : 'border-slate-700 text-slate-300 hover:border-slate-500'
            }`}
            style={c.id === corridorId ? { borderColor: c.themeColor, background: `${c.themeColor}33` } : undefined}
          >
            {c.title.zh}
          </button>
        ))}
      </div>

      {corridor ? <CorridorBody corridor={corridor} nodeById={nodeById} pos={pos} onPosChange={onPosChange} /> : (
        <p className="text-sm text-slate-500">选一条走廊，拖动滑块看食物如何一站站变形。</p>
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
  const color = mixHex(nodeColor(a), nodeColor(b), t);
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
      <p className="text-slate-400 text-sm">{corridor.subtitle} · {corridor.morphingConceptName}</p>
      <p className="text-xs text-slate-500 mt-1">{corridor.scientificDriver}</p>

      <div className="mt-4">
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
          style={{ accentColor: color }}
        />
        <ol className="flex justify-between text-xs mt-1">
          {stops.map((s, idx) => (
            <li key={s.nodeId}>
              <button
                onClick={() => onPosChange(idx)}
                className={idx === nearest ? 'text-white font-medium' : 'text-slate-500 hover:text-slate-300'}
              >
                {nodeById.get(s.nodeId)?.name.zh}
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mt-4">
        <div key={nearest} className="animate-fade-in">
          <div className="font-semibold flex items-center gap-2">
            {stopNode && <NodeCrest node={stopNode} size={40} />}
            {stop.representativeDishMorph.dishName}{' '}
            <span className="text-slate-500 text-sm font-normal">@ {stopNode?.name.zh}</span>
          </div>
          <p className="text-sm text-slate-300 mt-1">{stop.transitionNote}</p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm mt-3">
            {MORPH_FIELDS.map(([k, label]) => (
              <div key={k} className="contents">
                <dt className="text-slate-500">{label}</dt>
                <dd>{stop.representativeDishMorph[k]}</dd>
              </div>
            ))}
          </dl>
        </div>
        <VectorBars vector={vector} color={color} />
      </div>
    </div>
  );
}
