import type { CulinaryNode, SensoryVector10D } from '../types/flavor';

type RGB = [number, number, number];

/** 三个色系锚点：青绿＝本味/酸/草本，琥珀＝干香料/油脂，海蓝＝发酵鲜 */
const FRESH_GREEN: RGB = [52, 211, 153];
const SPICE_AMBER: RGB = [245, 158, 11];
const UMAMI_BLUE: RGB = [56, 130, 246];

const toHex = (c: RGB) => '#' + c.map((x) => Math.round(x).toString(16).padStart(2, '0')).join('').toUpperCase();

/**
 * 向量 → #RRGGBB。三组强度平方后做加权混色，让主导色系更突出。
 * 纯函数：同一向量永远得到同一颜色。
 */
export function vectorToColor(v: SensoryVector10D): string {
  const fresh = (v.naturalBenwei + v.brightAcid + v.freshHerbal) / 3;
  const spice = (v.warmDrySpice + v.lipidRichness) / 2;
  const umami = v.umamiFerment;
  const w = [fresh, spice, umami].map((x) => x * x);
  const total = w[0] + w[1] + w[2];
  if (total === 0) return '#94A3B8';
  const mix = [0, 1, 2].map(
    (i) => (FRESH_GREEN[i] * w[0] + SPICE_AMBER[i] * w[1] + UMAMI_BLUE[i] * w[2]) / total,
  ) as RGB;
  return toHex(mix);
}

/** 节点颜色：手填 primaryColor 优先（覆盖），留空时自动计算 */
export function nodeColor(node: CulinaryNode): string {
  return node.visuals.primaryColor || vectorToColor(node.sensoryVector);
}

/** 两个 #RRGGBB 线性混色 */
export function mixHex(a: string, b: string, t: number): string {
  const parse = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [pa, pb] = [parse(a), parse(b)];
  return toHex(pa.map((x, i) => x + (pb[i] - x) * t) as RGB);
}

/** 把任意颜色收进统一的低饱和色调（饱和度 ≤ 0.5、亮度 0.62），保证不同节点仍可区分但整体沉稳 */
export function muted(hex: string): string {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h = (h * 60 + 360) % 360;
  const lRaw = (max + min) / 2;
  const sRaw = d ? d / (1 - Math.abs(2 * lRaw - 1)) : 0;
  const s = Math.min(sRaw, 0.5);
  const l = 0.62;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r1, g1, b1] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return toHex([r1, g1, b1].map((v) => (v + m) * 255) as RGB);
}

/** 界面用的节点色：nodeColor 经 muted 收敛 */
export const nodeTone = (node: CulinaryNode) => muted(nodeColor(node));
