import type { CulinaryNode, SensoryVector10D, SvgGlyphType } from '../types/flavor';
import { nodeColor } from '../lib/color';
import { VECTOR_KEYS } from '../lib/scoring';

interface Props {
  vector: SensoryVector10D;
  primary: string;
  secondary: string;
  glyph: SvgGlyphType;
  size?: number;
  title?: string;
}

/** 7 种中心图标：24×24 坐标系手写 path，用 currentColor 描边 */
const GLYPHS: Record<SvgGlyphType, JSX.Element> = {
  'ocean-shell': (
    <>
      <path d="M12 20 L3.5 9.5 Q12 1.5 20.5 9.5 Z" />
      <path d="M12 20 L7 6.5 M12 20 L12 4.5 M12 20 L17 6.5" />
    </>
  ),
  'citrus-leaf': (
    <>
      <path d="M4.5 19.5 C4.5 9.5 10.5 4.5 19.5 4.5 C19.5 13.5 14.5 19.5 4.5 19.5 Z" />
      <path d="M4.5 19.5 L14.5 9.5 M9 15 L9 11 M12 12 L15.5 12" />
    </>
  ),
  'wok-flame': (
    <>
      <path d="M12 2.5 C15 6.5 16.5 8.5 16.5 11.5 A4.5 4.5 0 0 1 7.5 11.5 C7.5 9 9 8 9.5 5.5 C10.5 7.5 11.5 7 12 2.5 Z" />
      <path d="M2.5 16 Q12 23.5 21.5 16 M2.5 16 H21.5" />
    </>
  ),
  'mountain-mist': (
    <>
      <path d="M2 17.5 L8.5 6.5 L12.5 12.5 L15.5 8.5 L22 17.5 Z" />
      <path d="M7 10.5 L8.5 12 L10 10.5 M4 20.5 H20 M7 22.5 H17" />
    </>
  ),
  'spice-mandala': (
    <>
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 2.5 Q14.5 7 12 9.5 Q9.5 7 12 2.5 Z M12 21.5 Q14.5 17 12 14.5 Q9.5 17 12 21.5 Z M2.5 12 Q7 9.5 9.5 12 Q7 14.5 2.5 12 Z M21.5 12 Q17 9.5 14.5 12 Q17 14.5 21.5 12 Z" />
      <path d="M5.3 5.3 L8 8 M18.7 5.3 L16 8 M5.3 18.7 L8 16 M18.7 18.7 L16 16" />
    </>
  ),
  'desert-ember': (
    <>
      <path d="M5 14 A7 7 0 0 1 19 14" />
      <path d="M12 3 V5 M5.5 6.5 L6.9 7.9 M18.5 6.5 L17.1 7.9" />
      <path d="M2 18 Q7 14.5 12 18 T22 18 M4 21.5 Q9 19 14 21.5" />
    </>
  ),
  'olive-sun': (
    <>
      <circle cx="16" cy="7" r="3" />
      <path d="M3.5 20.5 Q10 16 15 11.5" />
      <path d="M7 18 Q5 14.5 8.5 14 Q9 17 7 18 Z M10.5 15.5 Q10 12 13.5 12.5 Q13 15.5 10.5 15.5 Z M8.5 19 Q12 21 12.5 17.5 Q9.5 17 8.5 19 Z" />
    </>
  ),
};

export const GLYPH_TYPES = Object.keys(GLYPHS) as SvgGlyphType[];

const polar = (r: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [+(r * Math.cos(a)).toFixed(2), +(r * Math.sin(a)).toFixed(2)];
};

/** 由输入确定的短 id（纯函数，保证同一向量多次渲染完全一致） */
function crestId(vector: SensoryVector10D, primary: string, secondary: string, glyph: string): string {
  const str = VECTOR_KEYS.map((k) => vector[k]).join(',') + primary + secondary + glyph;
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h * 33) ^ str.charCodeAt(i)) >>> 0;
  return 'crest-' + h.toString(36);
}

/**
 * 风味纹章：10 瓣极坐标花形（瓣长＝该维分值）+ 雷达多边形 + 中心图标。
 * 维度顺序固定从 12 点钟方向顺时针。
 */
export function FlavorCrest({ vector, primary, secondary, glyph, size = 64, title }: Props) {
  const id = crestId(vector, primary, secondary, glyph);
  const step = 360 / VECTOR_KEYS.length;
  const petals = VECTOR_KEYS.map((k, i) => {
    const v = Math.max(0, Math.min(10, vector[k]));
    const deg = i * step - 90;
    const r = 15 + v * 3.3;
    const [tx, ty] = polar(r, deg);
    const [lx, ly] = polar(r * 0.55, deg - 15);
    const [rx, ry] = polar(r * 0.55, deg + 15);
    return { k, v, d: `M0 0 Q${lx} ${ly} ${tx} ${ty} Q${rx} ${ry} 0 0 Z` };
  });
  const radar = VECTOR_KEYS.map((k, i) => polar(10 + Math.max(0, Math.min(10, vector[k])) * 3.3, i * step - 90).join(','));

  return (
    <svg
      viewBox="-50 -50 100 100"
      width={size}
      height={size}
      role="img"
      aria-label={title ?? '风味纹章'}
      className="shrink-0"
    >
      <defs>
        <radialGradient id={`${id}-bg`}>
          <stop offset="0%" stopColor={primary} stopOpacity={0.35} />
          <stop offset="100%" stopColor="#0B1120" stopOpacity={1} />
        </radialGradient>
      </defs>
      <circle r={49} fill={`url(#${id}-bg)`} stroke={primary} strokeOpacity={0.5} strokeWidth={1} />
      <g>
        {petals.map((p) => (
          <path key={p.k} d={p.d} fill={primary} fillOpacity={0.3 + p.v * 0.05} stroke={secondary} strokeOpacity={0.35} strokeWidth={0.6} />
        ))}
      </g>
      <polygon points={radar.join(' ')} fill="none" stroke={secondary} strokeWidth={1.2} strokeOpacity={0.85} strokeLinejoin="round" />
      <circle r={13} fill="#0B1120" stroke={secondary} strokeWidth={1} />
      <g
        transform="translate(-9 -9) scale(0.75)"
        fill="none"
        stroke={secondary}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {GLYPHS[glyph]}
      </g>
    </svg>
  );
}

/** 节点纹章快捷方式：颜色取 nodeColor（留空时自动计算） */
export function NodeCrest({ node, size }: { node: CulinaryNode; size?: number }) {
  return (
    <FlavorCrest
      vector={node.sensoryVector}
      primary={nodeColor(node)}
      secondary={node.visuals.secondaryColor}
      glyph={node.visuals.svgGlyphType}
      size={size}
      title={`${node.name.zh} 风味纹章`}
    />
  );
}
