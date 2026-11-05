import { useMemo } from 'react';
import type { CulinaryNode } from '../types/flavor';
import { flavorSpace } from '../lib/pca';
import { VECTOR_LABELS_ZH, VECTOR_KEYS } from '../lib/scoring';
import { nodeTone } from '../lib/color';
import { dotRadius } from './NodeDot';

interface Props {
  nodes: CulinaryNode[];
  scores: ReadonlyMap<string, number>;
  selectedId: string | null;
  corridorStopIds?: string[];
  onSelect: (node: CulinaryNode) => void;
}

const W = 500;
const H = 430;
const PAD = 32;

/** 风味空间双标图：10 维向量的前两主成分 + 各维度载荷箭头 + 极坐标色相映射环 */
export function FlavorSpace({ nodes, scores, selectedId, corridorStopIds, onSelect }: Props) {
  const fs = useMemo(() => flavorSpace(nodes), [nodes]);
  const pts = [...fs.points.values()];
  const ext = Math.max(...pts.map(([x, y]) => Math.max(Math.abs(x), Math.abs(y)))) * 1.12;
  const sx = (x: number) => W / 2 + (x / ext) * (W / 2 - PAD);
  const sy = (y: number) => H / 2 - (y / ext) * (H / 2 - PAD);
  const L = Math.min(W, H) / 2 - PAD - 22;

  // 走廊在风味空间中的轨迹连线
  const corridorPolyline = useMemo(() => {
    if (!corridorStopIds || corridorStopIds.length < 2) return null;
    const coords = corridorStopIds
      .map((id) => fs.points.get(id))
      .filter((p): p is [number, number] => !!p)
      .map(([x, y]) => `${sx(x).toFixed(1)},${sy(y).toFixed(1)}`);
    return coords.length >= 2 ? coords.join(' ') : null;
  }, [corridorStopIds, fs]);

  const stopSet = useMemo(() => new Set(corridorStopIds ?? []), [corridorStopIds]);

  // 节点标签贪心避让：选中项与高分优先
  const shown = new Set<string>();
  const boxes: number[][] = [];
  fs.loadings.forEach(([lx, ly], i) => {
    if (Math.hypot(lx, ly) < 0.3) return;
    const x = W / 2 + lx * (L + 13);
    const y = H / 2 - ly * (L + 13) + 4;
    const w = VECTOR_LABELS_ZH[VECTOR_KEYS[i]].length * 10;
    const x0 = lx > 0.1 ? x : lx < -0.1 ? x - w : x - w / 2;
    boxes.push([x0, y - 10, x0 + w, y + 2]);
  });

  const sortedForLabels = [...nodes].sort(
    (a, b) =>
      Number(b.id === selectedId) - Number(a.id === selectedId) ||
      Number(stopSet.has(b.id)) - Number(stopSet.has(a.id)) ||
      (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0),
  );

  for (const n of sortedForLabels) {
    const [x, y] = fs.points.get(n.id)!;
    const r = dotRadius(scores.get(n.id) ?? 0) * 0.85;
    const shortName = n.name.zh.replace(/（.*）/, '');
    const bx = [sx(x) + r + 3, sy(y) - 6, sx(x) + r + 3 + shortName.length * 10, sy(y) + 5];
    if (boxes.some((o) => bx[0] < o[2] && bx[2] > o[0] && bx[1] < o[3] && bx[3] > o[1])) continue;
    boxes.push(bx);
    shown.add(n.id);
  }

  return (
    <div className="relative rounded-xl border border-slate-800/80 bg-[#0A0E15] p-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block select-none" role="img" aria-label="风味空间主成分双标图">
        <defs>
          <radialGradient id="pca-ring" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1E293B" stopOpacity="0" />
            <stop offset="85%" stopColor="#334155" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#475569" stopOpacity="0.22" />
          </radialGradient>
        </defs>

        {/* 极坐标风味雷达环 */}
        <circle cx={W / 2} cy={H / 2} r={L * 0.5} fill="none" stroke="#182030" strokeDasharray="2 3" />
        <circle cx={W / 2} cy={H / 2} r={L * 0.98} fill="url(#pca-ring)" stroke="#1E293B" />

        <line x1={PAD} x2={W - PAD} y1={H / 2} y2={H / 2} stroke="#1E2636" strokeDasharray="2 4" />
        <line y1={PAD} y2={H - PAD} x1={W / 2} x2={W / 2} stroke="#1E2636" strokeDasharray="2 4" />

        {/* 四个象限的风味语义底标 */}
        <g className="font-mono" fontSize={9.5} fill="#64748B">
          <text x={W - PAD - 4} y={H / 2 + 13} textAnchor="end">
            PC1 ({(fs.explained[0] * 100).toFixed(0)}%) · 本味/清爽 →
          </text>
          <text x={PAD + 4} y={H / 2 + 13}>
            ← 干香料/浓醇
          </text>
          <text x={W / 2 + 6} y={PAD + 10}>
            ↑ PC2 ({(fs.explained[1] * 100).toFixed(0)}%) · 鲜辣/草本
          </text>
        </g>

        {/* 10 维载荷向量箭头 */}
        <g>
          {fs.loadings.map(([lx, ly], i) => {
            const x = W / 2 + lx * L;
            const y = H / 2 - ly * L;
            const len = Math.hypot(lx, ly);
            if (len < 0.3) return null;
            return (
              <g key={VECTOR_KEYS[i]}>
                <line x1={W / 2} y1={H / 2} x2={x} y2={y} stroke="#D4B373" strokeOpacity={0.28} strokeWidth={1} />
                <circle cx={x} cy={y} r={1.8} fill="#D4B373" fillOpacity={0.55} />
                <text
                  x={W / 2 + lx * (L + 12)}
                  y={H / 2 - ly * (L + 12) + 3.5}
                  textAnchor={lx > 0.1 ? 'start' : lx < -0.1 ? 'end' : 'middle'}
                  fontSize={9.5}
                  fill="#D4B373"
                  fillOpacity={0.85}
                >
                  {VECTOR_LABELS_ZH[VECTOR_KEYS[i]]}
                </text>
              </g>
            );
          })}
        </g>

        {/* 当选中某条走廊时，在风味空间中也同步画出它的跨界迁移轨迹 */}
        {corridorPolyline && (
          <polyline
            points={corridorPolyline}
            fill="none"
            stroke="#F8FAFC"
            strokeWidth={1.3}
            strokeDasharray="4 3"
            strokeOpacity={0.75}
          />
        )}

        {/* 43 个菜系在风味空间中的散点（位置直接决定其 OKLab 色相！） */}
        {nodes.map((n) => {
          const [x, y] = fs.points.get(n.id)!;
          const s = scores.get(n.id) ?? 0;
          const r = dotRadius(s) * 0.92;
          const sel = n.id === selectedId;
          const inCorridor = stopSet.has(n.id);
          const color = nodeTone(n);
          return (
            <g
              key={n.id}
              transform={`translate(${sx(x)},${sy(y)})`}
              style={{ cursor: 'pointer' }}
              onClick={() => onSelect(n)}
              role="button"
              tabIndex={0}
              aria-label={`${n.name.zh}，匹配度 ${s}%`}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(n)}
            >
              <circle
                r={sel ? r + 1.5 : r}
                fill={color}
                stroke="#080B10"
                strokeWidth={0.8}
                opacity={0.45 + (0.55 * s) / 100}
                style={{ transition: 'r 450ms' }}
              />
              {(sel || inCorridor) && (
                <circle r={r + 3.5} fill="none" stroke={sel ? '#FFFFFF' : color} strokeWidth={sel ? 1.3 : 0.9} />
              )}
              {shown.has(n.id) && (
                <text
                  x={r + 3.5}
                  y={3}
                  fontSize={sel ? 10.5 : 9.5}
                  fill={sel ? '#FFFFFF' : inCorridor ? '#E2E8F0' : '#94A3B8'}
                  style={{ paintOrder: 'stroke', stroke: '#0A0E15', strokeWidth: '2.5px' }}
                >
                  {n.name.zh.replace(/（.*）/, '')}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
