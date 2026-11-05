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
