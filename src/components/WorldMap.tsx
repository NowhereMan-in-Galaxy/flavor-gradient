import { useEffect, useMemo, useRef, useState } from 'react';
import { geoGraticule10, geoInterpolate, geoNaturalEarth1, geoPath } from 'd3-geo';
import { select } from 'd3-selection';
import { zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from 'd3-zoom';
import { feature, mesh } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import world from 'world-atlas/countries-110m.json';
import type { CulinaryNode } from '../types/flavor';
import { nodeTone } from '../lib/color';
import { NodeDot, dotRadius } from './NodeDot';

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

/** 走廊高亮：路径上的站点按顺序给出，cursor 为当前位置（区段 i + 区段内进度 t） */
export interface CorridorHighlight {
  stopIds: string[];
  color: string;
  segment: { i: number; t: number };
}

interface Props {
  highlight?: CorridorHighlight | null;
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

export function WorldMap({ nodes, scores, selectedId, onSelect, highlight }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [t, setT] = useState<ZoomTransform>(zoomIdentity);
  const [hover, setHover] = useState<Hover | null>(null);
  // 窄屏竖向：地图铺满高度（裁掉两侧），初始聚焦亚洲
  const [narrow] = useState(() => window.innerWidth < 640);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);

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
    zoomRef.current = z;
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
  const colors = useMemo(() => new Map(nodes.map((n) => [n.id, nodeTone(n)])), [nodes]);

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
        // 跨越日界线的连线会被切成两段贴在地图边缘，不画
        if ((d.match(/M/g) ?? []).length > 1) continue;
        out.push({ id: key, a, b, d });
      }
    }
    return out;
  }, [nodes]);

  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const route = useMemo(() => {
    if (!highlight) return null;
    const coords = highlight.stopIds.map((id) => byId.get(id)?.coordinates).filter((c): c is [number, number] => !!c);
    return {
      ids: new Set(highlight.stopIds),
      coords,
      d: pathGen({ type: 'LineString', coordinates: coords }) ?? '',
    };
  }, [highlight, byId]);
  // 选中走廊时缩放到路径范围（只在走廊切换时触发，拖滑块不会重置视角）
  const routeKey = highlight?.stopIds.join(',') ?? '';
  useEffect(() => {
    const svg = svgRef.current;
    const z = zoomRef.current;
    if (!svg || !z || !routeKey) return;
    const pts = routeKey.split(',').map((id) => points.get(id)).filter((p): p is [number, number] => !!p);
    if (pts.length < 2) return;
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    // 窄屏 slice 模式下可见宽度只有 viewBox 的一部分
    const visibleW = narrow ? (W * svg.clientWidth) / ((svg.clientHeight * W) / H) : W;
    const k = Math.min(8, 0.6 * Math.min(visibleW / Math.max(x1 - x0, 1), H / Math.max(y1 - y0, 1)));
    const [cx, cy] = [(x0 + x1) / 2, (y0 + y1) / 2];
    select(svg).call(z.transform, zoomIdentity.translate(W / 2 - k * cx, H / 2 - k * cy).scale(k));
  }, [routeKey, points, narrow]);

  const cursor = useMemo(() => {
    if (!highlight || !route || route.coords.length < 2) return null;
    const { i, t } = highlight.segment;
    return project(geoInterpolate(route.coords[i], route.coords[i + 1])(t) as [number, number]);
  }, [highlight, route]);

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

  // 标签：按匹配度贪心放置，与已放置的标签重叠则隐藏（随缩放重新计算）
  const labels = useMemo(() => {
    const boxes: number[][] = [];
    const out: { n: CulinaryNode; x: number; y: number }[] = [];
    const order = [...nodes].sort((a, b) => Number(b.id === selectedId) - Number(a.id === selectedId) || (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0));
    for (const n of order) {
      const s = scores.get(n.id) ?? 0;
      if (route ? !route.ids.has(n.id) : s < 50 && n.id !== selectedId) continue;
      const [px, py] = points.get(n.id)!;
      const off = (dotRadius(s) + 3) / t.k;
      const w = (n.name.zh.replace(/（.*）/, '').length * 11) / t.k;
      const box = [px + off, py - off - 11 / t.k, px + off + w, py - off];
      if (boxes.some((o) => box[0] < o[2] && box[2] > o[0] && box[1] < o[3] && box[3] > o[1])) continue;
      boxes.push(box);
      out.push({ n, x: box[0], y: box[3] });
    }
    return out;
  }, [nodes, scores, selectedId, points, t.k, route]);

  return (
    <div ref={wrapRef} className="relative w-full overflow-hidden bg-[#101216]">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-[56vh] md:h-[66vh] touch-none select-none"
        preserveAspectRatio={narrow ? 'xMidYMid slice' : 'xMidYMid meet'}
        role="img"
        aria-label="全球风味节点地图"
      >
        <defs>
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
          <path d={SPHERE_D} fill="#101216" stroke="#2A2B2E" strokeWidth={0.8 / t.k} />
          <path d={GRATICULE_D} fill="none" stroke="#24262A" strokeWidth={0.5 / t.k} strokeDasharray={`${1 / t.k} ${3 / t.k}`} />
          <path d={LAND_D} fill="#1B1D21" />
          <path d={BORDERS_D} fill="none" stroke="#2C2E32" strokeWidth={0.4 / t.k} />
          <g fill="none" strokeLinecap="round">
            {edges.map(({ id, d }) => (
              <path key={id} d={d} stroke={`url(#edge-${id})`} strokeWidth={0.8 / t.k} strokeOpacity={route ? 0.08 : 0.35} />
            ))}
          </g>
          {route && highlight && (
            <path
              d={route.d}
              fill="none"
              stroke="#C8A96E"
              strokeWidth={1.4 / t.k}
              strokeOpacity={0.9}
              strokeDasharray={`${6 / t.k} ${4 / t.k}`}
              strokeLinecap="round"
            />
          )}
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
                dimmed={!!route && !route.ids.has(n.id)}
                onHover={onHover}
                onSelect={onSelect}
              />
            );
          })}
          <g pointerEvents="none" className="font-serif">
            {labels.map(({ n, x, y }) => (
              <text key={n.id} x={x} y={y} fontSize={11 / t.k} fill={n.id === selectedId ? '#F4F2EE' : '#9A958B'}>
                {n.name.zh.replace(/（.*）/, '')}
              </text>
            ))}
          </g>
          {cursor && highlight && (
            <g transform={`translate(${cursor[0]},${cursor[1]})`} pointerEvents="none">
              <circle r={9 / t.k} fill="none" stroke="#C8A96E" strokeWidth={0.8 / t.k} />
              <circle r={3.5 / t.k} fill="#F4F2EE" />
            </g>
          )}
        </g>
      </svg>

      {hover && (
        <div
          className="pointer-events-none absolute z-10 bg-slateNight/95 border border-slate-700 px-3 py-2 text-xs max-w-[220px]"
          style={{ left: Math.min(hover.x + 12, (wrapRef.current?.clientWidth ?? 0) - 230), top: hover.y + 12 }}
        >
          <div className="font-serif text-sm">
            {hover.node.name.zh} <span className="font-mono text-brass">{scores.get(hover.node.id)}%</span>
          </div>
          <div className="text-slate-400">{hover.node.flavorPrinciple.summaryChord}</div>
        </div>
      )}

      <MapLegend />
    </div>
  );
}

const LEGEND = [
  ['#86C8A6', '本味 · 酸 · 草本'],
  ['#D9A963', '干香料 · 油脂'],
  ['#7F9FD6', '发酵鲜'],
] as const;

/** 图例：颜色 = 风味谱系，大小 = 匹配度 */
function MapLegend() {
  return (
    <div className="absolute left-3 bottom-3 text-[11px] text-slate-400 space-y-1 pointer-events-none">
      {LEGEND.map(([c, l]) => (
        <div key={l} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: c }} />
          {l}
        </div>
      ))}
      <div className="flex items-end gap-1.5 pt-1">
        {[30, 60, 90].map((s) => (
          <span key={s} className="rounded-full bg-slate-400" style={{ width: dotRadius(s) * 2, height: dotRadius(s) * 2 }} />
        ))}
        <span className="ml-1">匹配度</span>
      </div>
    </div>
  );
}
