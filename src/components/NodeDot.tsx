import type { CulinaryNode } from '../types/flavor';

interface Props {
  node: CulinaryNode;
  x: number;
  y: number;
  score: number;
  color: string;
  /** 当前缩放倍数：圆点按屏幕像素保持大小 */
  k: number;
  selected: boolean;
  dimmed?: boolean;
  onHover: (node: CulinaryNode | null, evt?: React.PointerEvent) => void;
  onSelect: (node: CulinaryNode) => void;
}

/** 匹配度 → 屏幕半径（px）：越匹配越大 */
export const dotRadius = (score: number) => 3 + Math.pow(Math.max(score, 0) / 100, 2) * 11;

export function NodeDot({ node, x, y, score, color, k, selected, dimmed, onHover, onSelect }: Props) {
  const r = dotRadius(score) / k;
  const brightness = 0.35 + 0.65 * (Math.max(score, 0) / 100);
  return (
    <g
      transform={`translate(${x},${y})`}
      opacity={dimmed ? 0.25 : 1}
      style={{ cursor: 'pointer', transition: 'opacity 200ms' }}
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
      <circle r={r * 2.4} fill={`url(#glow-${node.id})`} opacity={brightness} filter="url(#blur)" />
      <circle r={r} fill={color} opacity={brightness} />
      <circle r={r * 0.4} fill="#fff" opacity={0.5 * brightness} />
      {selected && <circle r={r * 1.7} fill="none" stroke="#fff" strokeWidth={1.5 / k} />}
    </g>
  );
}
