import { useEffect, useMemo, useRef, useState } from 'react';
import { geoGraticule10, geoInterpolate, geoNaturalEarth1, geoPath } from 'd3-geo';
import { select } from 'd3-selection';
import { zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from 'd3-zoom';
import { feature, mesh } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import { Layers, Plus, Minus, RotateCcw } from 'lucide-react';
import world from 'world-atlas/countries-110m.json';
import type { CulinaryNode } from '../types/flavor';
import { nodeTone, vectorToOklabChroma } from '../lib/color';
import { NodeDot, dotRadius } from './NodeDot';
import { extractIsoContours, oklabFlavorField } from '../lib/field';

const W = 960;
const H = 500;

const topo = world as unknown as Topology<{ countries: GeometryCollection }>;
const projection = geoNaturalEarth1().fitExtent(
  [
    [6, 6],
    [W - 6, H - 6],
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
  const [showField, setShowField] = useState(true);
  const [showContours, setShowContours] = useState(true);
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
      const [x, y] = project([104, 24]);
      const k = 1.65;
      sel.call(z.transform, zoomIdentity.translate(W / 2 - k * x, H / 2 - k * y).scale(k));
    }
    return () => {
      sel.on('.zoom', null);
    };
  }, [narrow]);

  const points = useMemo(() => new Map(nodes.map((n) => [n.id, project(n.coordinates)])), [nodes]);
  const colors = useMemo(() => new Map(nodes.map((n) => [n.id, nodeTone(n)])), [nodes]);
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  // 仅当悬停或选中某个节点时，展示它与邻居的风味关联弧线，彻底告别满屏蜘蛛网
  const focusNodeId = hover?.node.id ?? selectedId;
  const activeEdges = useMemo(() => {
    if (!focusNodeId) return [];
    const center = byId.get(focusNodeId);
    if (!center) return [];
    const out: { id: string; a: CulinaryNode; b: CulinaryNode; d: string }[] = [];
    for (const bid of center.neighborIds) {
      const b = byId.get(bid);
      if (!b) continue;
      const d = pathGen({ type: 'LineString', coordinates: [center.coordinates, b.coordinates] }) ?? '';
      if ((d.match(/M/g) ?? []).length > 1) continue;
      out.push({ id: `${center.id}__${b.id}`, a: center, b, d });
    }
    return out;
  }, [focusNodeId, byId]);

  const route = useMemo(() => {
    if (!highlight) return null;
    const coords = highlight.stopIds
      .map((id) => byId.get(id)?.coordinates)
      .filter((c): c is [number, number] => !!c);
    return {
      ids: new Set(highlight.stopIds),
      stopList: highlight.stopIds,
      coords,
      d: pathGen({ type: 'LineString', coordinates: coords }) ?? '',
    };
  }, [highlight, byId]);

  // 选中走廊时平滑缩放到走廊视野
  const routeKey = highlight?.stopIds.join(',') ?? '';
  useEffect(() => {
    const svg = svgRef.current;
    const z = zoomRef.current;
    if (!svg || !z || !routeKey) return;
    const pts = routeKey
      .split(',')
      .map((id) => points.get(id))
      .filter((p): p is [number, number] => !!p);
    if (pts.length < 2) return;
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const spanX = Math.max(x1 - x0, 45);
    const spanY = Math.max(y1 - y0, 35);
    const visibleW = narrow ? (W * svg.clientWidth) / ((svg.clientHeight * W) / H) : W;
    const k = Math.min(5.2, Math.max(1.35, 0.58 * Math.min(visibleW / spanX, H / spanY)));
    const [cx, cy] = [(x0 + x1) / 2, (y0 + y1) / 2];
    select(svg).call(z.transform, zoomIdentity.translate(W / 2 - k * cx, H / 2 - k * cy).scale(k));
  }, [routeKey, points, narrow]);

  const cursor = useMemo(() => {
    if (!highlight || !route || route.coords.length < 2) return null;
    const { i, t: segT } = highlight.segment;
    const c1 = route.coords[i];
    const c2 = route.coords[i + 1];
    if (!c1 || !c2) return null;
    return project(geoInterpolate(c1, c2)(segT) as [number, number]);
  }, [highlight, route]);

  const onHover = (node: CulinaryNode | null, evt?: React.PointerEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!node || !evt || !rect) return setHover(null);
    setHover({ node, x: evt.clientX - rect.left, y: evt.clientY - rect.top });
  };

  // 前 6 名高匹配节点标记
  const topMatchIds = useMemo(() => {
    const sorted = [...nodes].sort((a, b) => (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0));
    return new Set(sorted.slice(0, 6).map((n) => n.id));
  }, [nodes, scores]);

  // 低分先画，高分与选中节点压在最上层
  const drawOrder = useMemo(
    () =>
      [...nodes].sort(
        (a, b) =>
          Number(a.id === selectedId) - Number(b.id === selectedId) ||
          (scores.get(a.id) ?? 0) - (scores.get(b.id) ?? 0),
      ),
    [nodes, scores, selectedId],
  );

  // OKLab 感知均匀风味色场 + Marching Squares 地形等值线
  const { fieldUrl, contours } = useMemo(() => {
    const scale = 2;
    const GW = Math.floor(W / scale);
    const GH = Math.floor(H / scale);
    const sources = nodes.map((n) => {
      const [x, y] = points.get(n.id)!;
      const { a, b } = vectorToOklabChroma(n.sensoryVector);
      return {
        x,
        y,
        a,
        b,
        strength: Math.max(0, Math.min(1, (scores.get(n.id) ?? 0) / 100)),
      };
    });

    const { pixels, scoreGrid } = oklabFlavorField(sources, GW, GH, scale, 36);
    const contourLayers = extractIsoContours(scoreGrid, GW, GH, scale, [0.42, 0.54, 0.65, 0.74]);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext?.('2d');
    if (!ctx) return { fieldUrl: '', contours: contourLayers };
    canvas.width = GW;
    canvas.height = GH;
    const img = ctx.createImageData(GW, GH);
    img.data.set(pixels);
    ctx.putImageData(img, 0, 0);
    return { fieldUrl: canvas.toDataURL(), contours: contourLayers };
  }, [nodes, points, scores]);

  // 渐进式地名标签：默认只显示选中节点、走廊站点、或前 5 个高匹配无碰撞锚点；放大地图时才浮现更多标签
  const labels = useMemo(() => {
    const boxes: number[][] = [];
    const out: { n: CulinaryNode; x: number; y: number; isPrimary: boolean }[] = [];
    const maxLabels = route ? 12 : t.k > 2.8 ? 28 : t.k > 1.6 ? 14 : 6;
    const order = [...nodes].sort(
      (a, b) =>
        Number(b.id === selectedId) - Number(a.id === selectedId) ||
        Number(route?.ids.has(b.id) ?? 0) - Number(route?.ids.has(a.id) ?? 0) ||
        (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0),
    );

    for (const n of order) {
      if (out.length >= maxLabels) break;
      const s = scores.get(n.id) ?? 0;
      const isSelected = n.id === selectedId;
      const isRouteStop = route?.ids.has(n.id) ?? false;
      if (route && !isRouteStop && !isSelected) continue;
      if (!route && !isSelected && t.k < 1.5 && s < 68 && out.length >= 4) continue;

      const [px, py] = points.get(n.id)!;
      const off = (dotRadius(s) + 3.5) / t.k;
      const shortName = n.name.zh.replace(/（.*）/, '');
      const w = (shortName.length * 10.5) / t.k;
      const h = 11 / t.k;
      const box = [px + off, py - h / 2, px + off + w, py + h / 2];
      if (boxes.some((o) => box[0] < o[2] && box[2] > o[0] && box[1] < o[3] && box[3] > o[1])) continue;
      boxes.push(box);
      out.push({ n, x: box[0], y: py + 3.5 / t.k, isPrimary: isSelected || isRouteStop || s >= 76 });
    }
    return out;
  }, [nodes, scores, selectedId, points, t.k, route]);

  const handleZoomStep = (factor: number) => {
    const svg = svgRef.current;
    const z = zoomRef.current;
    if (!svg || !z) return;
    select(svg).call(z.scaleBy, factor);
  };

  const handleResetZoom = () => {
    const svg = svgRef.current;
    const z = zoomRef.current;
    if (!svg || !z) return;
    select(svg).call(z.transform, zoomIdentity);
  };

  return (
    <div ref={wrapRef} className="relative w-full overflow-hidden rounded-xl border border-slate-800/80 bg-[#080B10] shadow-2xl">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-[46vh] md:h-[54vh] touch-none select-none block"
        preserveAspectRatio={narrow ? 'xMidYMid slice' : 'xMidYMid meet'}
        role="img"
        aria-label="全球风味等值线星图"
      >
        <defs>
          <clipPath id="land-clip">
            <path d={LAND_D} />
          </clipPath>
          {activeEdges.map(({ id, a, b }) => {
            const [x1, y1] = points.get(a.id)!;
            const [x2, y2] = points.get(b.id)!;
            return (
              <linearGradient key={id} id={`edge-${id}`} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
                <stop offset="0%" stopColor={colors.get(a.id)} stopOpacity={0.85} />
                <stop offset="100%" stopColor={colors.get(b.id)} stopOpacity={0.35} />
              </linearGradient>
            );
          })}
        </defs>

        <g transform={t.toString()}>
          {/* 深空海面与经纬网格 */}
          <path d={SPHERE_D} fill="#0A0E15" stroke="#1E2636" strokeWidth={0.8 / t.k} />
          <path
            d={GRATICULE_D}
            fill="none"
            stroke="#151C28"
            strokeWidth={0.45 / t.k}
            strokeDasharray={`${1.5 / t.k} ${3 / t.k}`}
          />

          {/* 陆地基底 */}
          <path d={LAND_D} fill="#121722" />

          {/* OKLab 感知均匀风味色场（位置相近＝色相相近，亮度＝匹配度） */}
          {showField && fieldUrl && (
            <image
              href={fieldUrl}
              x={0}
              y={0}
              width={W}
              height={H}
              preserveAspectRatio="none"
              clipPath="url(#land-clip)"
              style={{ transition: 'opacity 350ms' }}
            />
          )}

          {/* 地形图式匹配度等值线（Iso-Match Contours） */}
          {showContours && (
            <g clipPath="url(#land-clip)" pointerEvents="none">
              {contours.map((layer) =>
                layer.svgPath ? (
                  <g key={layer.threshold}>
                    <path
                      d={layer.svgPath}
                      fill="none"
                      stroke={layer.isMajor ? 'rgba(248, 250, 252, 0.34)' : 'rgba(226, 232, 240, 0.16)'}
                      strokeWidth={(layer.isMajor ? 0.85 : 0.48) / t.k}
                      strokeDasharray={layer.isMajor ? undefined : `${2.5 / t.k} ${2 / t.k}`}
                    />
                    {layer.isMajor && layer.labelPos && (
                      <text
                        x={layer.labelPos[0] + 3 / t.k}
                        y={layer.labelPos[1] - 2 / t.k}
                        fontSize={7.5 / t.k}
                        className="font-mono"
                        fill="rgba(248, 250, 252, 0.52)"
                      >
                        {layer.label}
                      </text>
                    )}
                  </g>
                ) : null,
              )}
            </g>
          )}

          {/* 国界线与海岸线微描边 */}
          <path d={BORDERS_D} fill="none" stroke="rgba(255,255,255,0.065)" strokeWidth={0.4 / t.k} />
          <path d={LAND_D} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth={0.45 / t.k} />

          {/* 仅在悬停/选中某个节点时浮现的风味近亲连线 */}
          <g fill="none" strokeLinecap="round" pointerEvents="none">
            {activeEdges.map(({ id, d }) => (
              <path
                key={id}
                d={d}
                stroke={`url(#edge-${id})`}
                strokeWidth={1.1 / t.k}
                strokeDasharray={`${3 / t.k} ${2 / t.k}`}
              />
            ))}
          </g>

          {/* 跨国渐变走廊高亮航线 */}
          {route && highlight && (
            <g pointerEvents="none">
              <path
                d={route.d}
                fill="none"
                stroke={highlight.color}
                strokeWidth={3.6 / t.k}
                strokeOpacity={0.22}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={route.d}
                fill="none"
                stroke="#F8FAFC"
                strokeWidth={1.35 / t.k}
                strokeOpacity={0.92}
                strokeDasharray={`${5 / t.k} ${3.5 / t.k}`}
                strokeLinecap="round"
              />
            </g>
          )}

          {/* 43 个饮食节点 */}
          {drawOrder.map((n) => {
            const [x, y] = points.get(n.id)!;
            const isStop = route?.ids.has(n.id) ?? false;
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
                isTopMatch={topMatchIds.has(n.id)}
                isCorridorStop={isStop}
                dimmed={!!route && !isStop && n.id !== selectedId}
                onHover={onHover}
                onSelect={onSelect}
              />
            );
          })}

          {/* 走廊站点序号徽标 */}
          {route &&
            route.stopList.map((stopId, idx) => {
              const pt = points.get(stopId);
              if (!pt) return null;
              return (
                <g key={`badge-${stopId}`} transform={`translate(${pt[0]},${pt[1] - 9 / t.k})`} pointerEvents="none">
                  <rect
                    x={-7 / t.k}
                    y={-5.5 / t.k}
                    width={14 / t.k}
                    height={10 / t.k}
                    rx={3 / t.k}
                    fill="#080B10"
                    stroke="#F8FAFC"
                    strokeWidth={0.6 / t.k}
                  />
                  <text
                    textAnchor="middle"
                    y={2 / t.k}
                    fontSize={7.2 / t.k}
                    className="font-mono"
                    fill="#F8FAFC"
                  >
                    0{idx + 1}
                  </text>
                </g>
              );
            })}

          {/* 渐进避让地名标签 */}
          <g pointerEvents="none">
            {labels.map(({ n, x, y, isPrimary }) => (
              <text
                key={n.id}
                x={x}
                y={y}
                fontSize={(isPrimary ? 10.5 : 9.5) / t.k}
                fill={n.id === selectedId ? '#FFFFFF' : isPrimary ? '#E2E8F0' : '#94A3B8'}
                style={{
                  paintOrder: 'stroke',
                  stroke: '#080B10',
                  strokeWidth: `${2.6 / t.k}px`,
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                }}
              >
                {n.name.zh.replace(/（.*）/, '')}
              </text>
            ))}
          </g>

          {/* 走廊实时滑行探针 */}
          {cursor && highlight && (
            <g transform={`translate(${cursor[0]},${cursor[1]})`} pointerEvents="none">
              <circle r={11 / t.k} fill={highlight.color} fillOpacity={0.22} />
              <circle r={7.5 / t.k} fill="none" stroke="#F8FAFC" strokeWidth={1.1 / t.k} />
              <circle r={3.2 / t.k} fill="#F8FAFC" />
            </g>
          )}
        </g>
      </svg>

      {/* 右上角：图层开关与缩放控制 */}
      <div className="absolute right-3 top-3 flex items-center gap-1.5 bg-[#0E131B]/90 backdrop-blur-md border border-slate-800 rounded-lg px-2 py-1 text-[11px]">
        <Layers size={12} className="text-slate-400 mr-0.5" />
        <button
          onClick={() => setShowField((v) => !v)}
          className={`px-2 py-0.5 rounded transition ${
            showField ? 'bg-slate-800 text-slate-100' : 'text-slate-500 hover:text-slate-300'
          }`}
          title="切换 OKLab 风味空间色场"
        >
          色场
        </button>
        <button
          onClick={() => setShowContours((v) => !v)}
          className={`px-2 py-0.5 rounded transition ${
            showContours ? 'bg-slate-800 text-slate-100' : 'text-slate-500 hover:text-slate-300'
          }`}
          title="切换匹配度地形等值线"
        >
          等值线
        </button>
        <span className="w-px h-3.5 bg-slate-800 mx-0.5" />
        <button
          onClick={() => handleZoomStep(1.4)}
          className="p-1 text-slate-400 hover:text-white"
          aria-label="放大地图"
          title="放大"
        >
          <Plus size={13} />
        </button>
        <button
          onClick={() => handleZoomStep(1 / 1.4)}
          className="p-1 text-slate-400 hover:text-white"
          aria-label="缩小地图"
          title="缩小"
        >
          <Minus size={13} />
        </button>
        <button
          onClick={handleResetZoom}
          className="p-1 text-slate-400 hover:text-white"
          aria-label="重置地图视角"
          title="重置视角"
        >
          <RotateCcw size={12} />
        </button>
      </div>

      {/* 悬停浮窗 */}
      {hover && (
        <div
          className="pointer-events-none absolute z-20 bg-[#0E131B]/95 backdrop-blur-md border border-slate-700/80 rounded-lg px-3 py-2 text-xs max-w-[240px] shadow-xl"
          style={{
            left: Math.min(hover.x + 14, (wrapRef.current?.clientWidth ?? 0) - 250),
            top: Math.max(8, hover.y - 10),
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-serif text-sm text-slate-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: colors.get(hover.node.id) }} />
              {hover.node.name.zh}
            </span>
            <span className="font-mono text-brass font-medium">{scores.get(hover.node.id)}%</span>
          </div>
          <div className="text-slate-400 mt-0.5 leading-snug">{hover.node.flavorPrinciple.summaryChord}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            技法：{hover.node.cookingProfile.signatureMethods.slice(0, 3).join(' · ')}
          </div>
        </div>
      )}

      <MapLegend />
    </div>
  );
}

const FLAVOR_COMPASS_LEGEND = [
  ['#2DD4BF', '本味 · 明亮酸 · 草本 (翡翠青)'],
  ['#60A5FA', '发酵鲜 · 清雅回甘 (碧海蓝)'],
  ['#F472B6', '鲜辣椒麻 · 猛火镬气 (珊瑚绯)'],
  ['#F59E0B', '复合干香料 · 慢炖油脂 (琥珀金)'],
] as const;

/** 图例：颜色 = 风味空间象限（OKLab），细线 = 匹配度等高线 */
function MapLegend() {
  return (
    <div className="absolute left-3 bottom-3 bg-[#0E131B]/85 backdrop-blur-md border border-slate-800/80 rounded-lg px-3 py-2 text-[11px] text-slate-300 space-y-1.5 pointer-events-none">
      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
        风味空间色相 (邻近即同色系)
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        {FLAVOR_COMPASS_LEGEND.map(([c, l]) => (
          <div key={l} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c }} />
            <span className="truncate text-[10.5px] text-slate-300">{l}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-px bg-slate-200/60 inline-block" />
          <span>74% / 65% 适口等高线</span>
        </span>
        <span className="flex items-center gap-1">
          {[35, 65, 90].map((s) => (
            <span
              key={s}
              className="rounded-full bg-slate-300 inline-block"
              style={{ width: dotRadius(s) * 1.6, height: dotRadius(s) * 1.6 }}
            />
          ))}
          <span className="ml-0.5">匹配度</span>
        </span>
      </div>
    </div>
  );
}
