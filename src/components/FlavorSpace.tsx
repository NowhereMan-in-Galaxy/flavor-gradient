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
  onSelect: (node: CulinaryNode) => void;
}

const W = 520;
const H = 460;
const PAD = 28;

/** 风味空间双标图：10 维向量的前两主成分 + 各维度载荷箭头 */
export function FlavorSpace({ nodes, scores, selectedId, onSelect }: Props) {
  const fs = useMemo(() => flavorSpace(nodes), [nodes]);
  const pts = [...fs.points.values()];
  const ext = Math.max(...pts.map(([x, y]) => Math.max(Math.abs(x), Math.abs(y)))) * 1.1;
  const sx = (x: number) => W / 2 + (x / ext) * (W / 2 - PAD);
  const sy = (y: number) => H / 2 - (y / ext) * (H / 2 - PAD);
  const L = Math.min(W, H) / 2 - PAD - 20;
  // 节点标签贪心避让：高分优先，重叠则只画点
  const shown = new Set<string>();
  // 先占住载荷标签的位置
  const boxes: number[][] = [];
  fs.loadings.forEach(([lx, ly], i) => {
    if (Math.hypot(lx, ly) < 0.3) return;
    const x = W / 2 + lx * (L + 12);
    const y = H / 2 - ly * (L + 12) + 4;
    const w = VECTOR_LABELS_ZH[VECTOR_KEYS[i]].length * 10;
    const x0 = lx > 0.1 ? x : lx < -0.1 ? x - w : x - w / 2;
    boxes.push([x0, y - 10, x0 + w, y + 2]);
  });
  for (const n of [...nodes].sort((a, b) => Number(b.id === selectedId) - Number(a.id === selectedId) || (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0))) {
    const [x, y] = fs.points.get(n.id)!;
    const r = dotRadius(scores.get(n.id) ?? 0) * 0.8;
    const bx = [sx(x) + r + 3, sy(y) - 6, sx(x) + r + 3 + n.name.zh.replace(/（.*）/, '').length * 10, sy(y) + 5];
    if (boxes.some((o) => bx[0] < o[2] && bx[2] > o[0] && bx[1] < o[3] && bx[3] > o[1])) continue;
    boxes.push(bx);
    shown.add(n.id);
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="风味空间主成分双标图">
      <rect x={PAD} y={PAD} width={W - 2 * PAD} height={H - 2 * PAD} fill="none" stroke="#26272A" />
      <line x1={PAD} x2={W - PAD} y1={H / 2} y2={H / 2} stroke="#26272A" strokeDasharray="2 4" />
      <line y1={PAD} y2={H - PAD} x1={W / 2} x2={W / 2} stroke="#26272A" strokeDasharray="2 4" />
      <g className="font-mono" fontSize={10} fill="#7A766E">
        <text x={W - PAD - 4} y={H / 2 + 14} textAnchor="end">PC1 {(fs.explained[0] * 100).toFixed(0)}%</text>
        <text x={W / 2 + 6} y={PAD + 12}>PC2 {(fs.explained[1] * 100).toFixed(0)}%</text>
      </g>
      <g>
        {fs.loadings.map(([lx, ly], i) => {
          const x = W / 2 + lx * L;
          const y = H / 2 - ly * L;
          const len = Math.hypot(lx, ly);
          if (len < 0.3) return null;
          return (
            <g key={VECTOR_KEYS[i]}>
              <line x1={W / 2} y1={H / 2} x2={x} y2={y} stroke="#C8A96E" strokeOpacity={0.35} />
              <text
                x={W / 2 + lx * (L + 12)}
                y={H / 2 - ly * (L + 12) + 4}
                textAnchor={lx > 0.1 ? 'start' : lx < -0.1 ? 'end' : 'middle'}
                fontSize={10}
                fill="#C8A96E"
                fillOpacity={0.8}
              >
                {VECTOR_LABELS_ZH[VECTOR_KEYS[i]]}
              </text>
            </g>
          );
        })}
      </g>
      {nodes.map((n) => {
        const [x, y] = fs.points.get(n.id)!;
        const s = scores.get(n.id) ?? 0;
        const r = dotRadius(s) * 0.8;
        const sel = n.id === selectedId;
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
            <circle r={r} fill={nodeTone(n)} opacity={0.4 + (0.6 * s) / 100} style={{ transition: 'r 600ms' }} />
            {sel && <circle r={r + 4} fill="none" stroke="#C8A96E" />}
            {shown.has(n.id) && <text x={r + 3} y={3} fontSize={10} fill={sel ? '#F4F2EE' : '#7A766E'} className="font-serif">
              {n.name.zh.replace(/（.*）/, '')}
            </text>}
          </g>
        );
      })}
    </svg>
  );
}
