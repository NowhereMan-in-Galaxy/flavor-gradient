import { useEffect, useMemo, useRef, useState } from 'react';
import { geoGraticule10, geoNaturalEarth1, geoPath } from 'd3-geo';
import { select } from 'd3-selection';
import { zoom, zoomIdentity, type ZoomTransform } from 'd3-zoom';
import { feature, mesh } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import world from 'world-atlas/countries-110m.json';
import type { CulinaryNode } from '../types/flavor';
import { nodeColor } from '../lib/color';
import { NodeDot } from './NodeDot';

const W = 960;
const H = 500;

const topo = world as unknown as Topology<{ countries: GeometryCollection }>;
const projection = geoNaturalEarth1().fitExtent(
  [
    [4, 4],
    [W - 4, H - 4],
  ],
  { type: 'Sphere' },
);
const pathGen = geoPath(projection);
const SPHERE_D = pathGen({ type: 'Sphere' }) ?? '';
const GRATICULE_D = pathGen(geoGraticule10()) ?? '';
const LAND_D = pathGen(feature(topo, topo.objects.countries)) ?? '';
const BORDERS_D = pathGen(mesh(topo, topo.objects.countries, (a, b) => a !== b)) ?? '';

export const project = (lngLat: [number, number]): [number, number] => projection(lngLat) ?? [0, 0];

interface Props {
  nodes: CulinaryNode[];
  scores: ReadonlyMap<string, number>;
  selectedId: string | null;
  onSelect: (node: CulinaryNode) => void;
}

interface Hover {
  node: CulinaryNode;
  x: number;
  y: number;
}

export function WorldMap({ nodes, scores, selectedId, onSelect }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [t, setT] = useState<ZoomTransform>(zoomIdentity);
  const [hover, setHover] = useState<Hover | null>(null);
  // 窄屏竖向：地图铺满高度（裁掉两侧），初始聚焦亚洲
  const [narrow] = useState(() => window.innerWidth < 640);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const z = zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 12])
      .translateExtent([
        [0, 0],
        [W, H],
      ])
      .on('zoom', (e: { transform: ZoomTransform }) => setT(e.transform));
    const sel = select(svg).call(z);
    if (narrow) {
      const [x, y] = project([100, 25]);
      const k = 1.6;
      sel.call(z.transform, zoomIdentity.translate(W / 2 - k * x, H / 2 - k * y).scale(k));
    }
    return () => {
      sel.on('.zoom', null);
    };
  }, [narrow]);

  const points = useMemo(() => new Map(nodes.map((n) => [n.id, project(n.coordinates)])), [nodes]);
  const colors = useMemo(() => new Map(nodes.map((n) => [n.id, nodeColor(n)])), [nodes]);

  const edges = useMemo(() => {
    const seen = new Set<string>();
    const out: { id: string; a: CulinaryNode; b: CulinaryNode; d: string }[] = [];
    const byId = new Map(nodes.map((n) => [n.id, n]));
    for (const a of nodes) {
      for (const bid of a.neighborIds) {
        const b = byId.get(bid);
        const key = [a.id, bid].sort().join('__');
        if (!b || seen.has(key)) continue;
        seen.add(key);
        const d = pathGen({ type: 'LineString', coordinates: [a.coordinates, b.coordinates] }) ?? '';
        out.push({ id: key, a, b, d });
      }
    }
    return out;
  }, [nodes]);

  const onHover = (node: CulinaryNode | null, evt?: React.PointerEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!node || !evt || !rect) return setHover(null);
    setHover({ node, x: evt.clientX - rect.left, y: evt.clientY - rect.top });
  };

  // 低分节点先画，高分节点压在上面
  const drawOrder = useMemo(
    () => [...nodes].sort((a, b) => (scores.get(a.id) ?? 0) - (scores.get(b.id) ?? 0)),
    [nodes, scores],
  );

  return (
    <div ref={wrapRef} className="relative w-full rounded-2xl overflow-hidden bg-obsidian border border-slate-800">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-[56vh] md:h-[66vh] touch-none select-none"
        preserveAspectRatio={narrow ? 'xMidYMid slice' : 'xMidYMid meet'}
        role="img"
        aria-label="全球风味节点地图"
      >
        <defs>
          <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
          {nodes.map((n) => (
            <radialGradient key={n.id} id={`glow-${n.id}`}>
              <stop offset="0%" stopColor={colors.get(n.id)} stopOpacity={0.9} />
              <stop offset="100%" stopColor={colors.get(n.id)} stopOpacity={0} />
            </radialGradient>
          ))}
          {edges.map(({ id, a, b }) => {
            const [x1, y1] = points.get(a.id)!;
            const [x2, y2] = points.get(b.id)!;
            return (
              <linearGradient key={id} id={`edge-${id}`} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
                <stop offset="0%" stopColor={colors.get(a.id)} />
                <stop offset="100%" stopColor={colors.get(b.id)} />
              </linearGradient>
            );
          })}
        </defs>

        <g transform={t.toString()}>
          <path d={SPHERE_D} fill="#0B1120" />
          <path d={GRATICULE_D} fill="none" stroke="#1E293B" strokeWidth={0.5 / t.k} />
          <path d={LAND_D} fill="#1A2234" />
          <path d={BORDERS_D} fill="none" stroke="#2A3550" strokeWidth={0.5 / t.k} />
          <g fill="none" strokeLinecap="round">
            {edges.map(({ id, d }) => (
              <path key={id} d={d} stroke={`url(#edge-${id})`} strokeWidth={1.2 / t.k} strokeOpacity={0.55} />
            ))}
          </g>
          {drawOrder.map((n) => {
            const [x, y] = points.get(n.id)!;
            return (
              <NodeDot
                key={n.id}
                node={n}
                x={x}
                y={y}
                k={t.k}
                score={scores.get(n.id) ?? 0}
                color={colors.get(n.id)!}
                selected={n.id === selectedId}
                onHover={onHover}
                onSelect={onSelect}
              />
            );
          })}
        </g>
      </svg>

      {hover && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg bg-slateNight/95 border border-slate-700 px-3 py-2 text-xs shadow-xl max-w-[220px]"
          style={{ left: Math.min(hover.x + 12, (wrapRef.current?.clientWidth ?? 0) - 230), top: hover.y + 12 }}
        >
          <div className="font-semibold text-sm">
            {hover.node.name.zh} <span className="font-mono text-emerald-300">{scores.get(hover.node.id)}%</span>
          </div>
          <div className="text-slate-400">{hover.node.flavorPrinciple.summaryChord}</div>
        </div>
      )}

      <div className="absolute bottom-2 left-3 text-[10px] text-slate-500">滚轮/双指缩放 · 拖拽平移 · 点击节点看详情</div>
    </div>
  );
}
