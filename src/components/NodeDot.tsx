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

/** 匹配度 → 屏幕半径（px）：越匹配越大，低分收成细小圆点 */
export const dotRadius = (score: number) => 1.5 + Math.pow(Math.max(score, 0) / 100, 2.2) * 4;

export function NodeDot({ node, x, y, score, color, k, selected, dimmed, onHover, onSelect }: Props) {
  const r = dotRadius(score) / k;
  const v = Math.max(score, 0) / 100;
  return (
    <g
      transform={`translate(${x},${y})`}
      opacity={dimmed ? 0.2 : 1}
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
      <circle r={Math.max(r * 2.4, 10 / k)} fill="transparent" />
      <circle r={r} fill={color} stroke="#0D0F12" strokeWidth={0.6 / k} opacity={0.55 + 0.45 * v} style={{ transition: 'r 600ms cubic-bezier(.2,.8,.2,1)' }} />
      {selected && <circle r={r + 4 / k} fill="none" stroke="#C8A96E" strokeWidth={1.2 / k} />}
    </g>
  );
}
