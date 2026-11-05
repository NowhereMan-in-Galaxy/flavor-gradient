import type { CulinaryNode } from '../types/flavor';

interface Props {
  node: CulinaryNode;
  x: number;
  y: number;
  score: number;
  color: string;
  /** 当前缩放倍数：圆点按屏幕像素保持精致比例 */
  k: number;
  selected: boolean;
  isTopMatch?: boolean;
  isCorridorStop?: boolean;
  dimmed?: boolean;
  onHover: (node: CulinaryNode | null, evt?: React.PointerEvent) => void;
  onSelect: (node: CulinaryNode) => void;
}

/** 匹配度 → 屏幕半径（px）：克制精致，避免 43 个点挤成一团麻疹 */
export const dotRadius = (score: number) => 1.6 + Math.pow(Math.max(score, 0) / 100, 2.5) * 3.4;

export function NodeDot({
  node,
  x,
  y,
  score,
  color,
  k,
  selected,
  isTopMatch,
  isCorridorStop,
  dimmed,
  onHover,
  onSelect,
}: Props) {
  const baseR = dotRadius(score);
  const r = (selected ? baseR + 1.2 : isCorridorStop ? Math.max(baseR, 3.6) : baseR) / k;
  const v = Math.max(score, 0) / 100;

  return (
    <g
      transform={`translate(${x},${y})`}
      opacity={dimmed ? 0.16 : 1}
      style={{ cursor: 'pointer', transition: 'opacity 300ms' }}
      onPointerEnter={(e) => onHover(node, e)}
      onPointerMove={(e) => onHover(node, e)}
      onPointerLeave={() => onHover(null)}
      onClick={() => onSelect(node)}
      role="button"
      tabIndex={0}
      aria-label={`${node.name.zh}，匹配度 ${score}%`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onSelect(node);
      }}
    >
      {/* 隐形热区方便点击 */}
      <circle r={Math.max(r * 2.5, 9 / k)} fill="transparent" />

      {/* 高匹配或走廊节点的外圈微光环 */}
      {(isTopMatch || isCorridorStop) && !dimmed && (
        <circle
          r={r + 2.6 / k}
          fill="none"
          stroke={color}
          strokeOpacity={selected ? 0.85 : 0.38}
          strokeWidth={0.75 / k}
        />
      )}

      {/* 核心宝石圆点 */}
      <circle
        r={r}
        fill={color}
        stroke="#080B10"
        strokeWidth={0.85 / k}
        opacity={0.48 + 0.52 * v}
        style={{ transition: 'r 450ms cubic-bezier(.2,.8,.2,1)' }}
      />

      {/* 选中态靶心高亮环 */}
      {selected && (
        <>
          <circle r={r + 4.5 / k} fill="none" stroke="#F8FAFC" strokeWidth={1.25 / k} />
          <circle r={r + 7.5 / k} fill="none" stroke={color} strokeOpacity={0.55} strokeWidth={0.8 / k} />
        </>
      )}
    </g>
  );
}
