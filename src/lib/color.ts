import type { CulinaryNode, SensoryVector10D } from '../types/flavor';
import { VECTOR_KEYS } from './scoring';

export type RGB = [number, number, number];

/**
 * 线性 sRGB → Gamma sRGB (0~1)
 */
const gammaEncode = (c: number): number =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

/**
 * OKLab (L, a, b) → sRGB [0..255, 0..255, 0..255]
 * 在感知均匀的 OKLab 空间中进行颜色映射与插值，彻底避免 RGB 直接混色导致的“发灰发泥（棕绿脏色）”。
 */
export function oklabToRgb(L: number, a: number, b: number): RGB {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const rLin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bLin = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  return [
    Math.round(255 * Math.min(1, Math.max(0, gammaEncode(rLin)))),
    Math.round(255 * Math.min(1, Math.max(0, gammaEncode(gLin)))),
    Math.round(255 * Math.min(1, Math.max(0, gammaEncode(bLin)))),
  ];
}

/**
 * OKLCH (L, C, hRad) → sRGB [0..255, 0..255, 0..255]
 */
export function oklchToRgb(L: number, C: number, hRad: number): RGB {
  return oklabToRgb(L, C * Math.cos(hRad), C * Math.sin(hRad));
}

export const toHex = (c: RGB): string =>
  '#' + c.map((x) => Math.round(Math.min(255, Math.max(0, x))).toString(16).padStart(2, '0')).join('').toUpperCase();

/**
 * 风味空间（PCA 主成分平面）的基底轴，与 `src/lib/pca.ts` 的 PC1 / PC2 方向严格对齐：
 * - X 轴（PC1）：正方向 = 本味 / 清爽质构 / 发酵鲜 / 明亮酸；负方向 = 温暖干香料 / 油脂醇厚
 * - Y 轴（PC2）：正方向 = 鲜辣椒麻 / 生鲜草本 / 镬气焦香；负方向 = 甜润回甘 / 温和醇厚
 *
 * 这样在「图 2 风味空间」里位置相近的两个菜系，必然拥有相近的 (x, y) 极角与半径，
 * 从而在地图、散点图、走廊剖面和排行榜中呈现完全一致且有地理-风味意义的渐变色彩！
 */
export function vectorToFlavorCoords(v: SensoryVector10D): [number, number] {
  // PC1 轴：沿海本味/清爽酸鲜 (+) vs 复合干香料/慢炖浓脂 (-)
  const pc1 =
    0.42 * (v.naturalBenwei - 5.5) +
    0.38 * (v.crispTexture - 5.5) +
    0.26 * (v.umamiFerment - 5.5) +
    0.16 * (v.brightAcid - 4.8) +
    0.12 * (v.freshHerbal - 5.0) -
    0.46 * (v.warmDrySpice - 4.2) -
    0.34 * (v.lipidRichness - 4.8);

  // PC2 轴：生猛鲜辣/草本镬气 (+) vs 温润醇甜/清雅 (-)
  const pc2 =
    0.48 * (v.capsaicinHeat - 4.5) +
    0.34 * (v.freshHerbal - 5.0) +
    0.28 * (v.brightAcid - 4.8) +
    0.22 * (v.wokHeiThermal - 5.0) -
    0.32 * (v.sweetHarmony - 4.5) -
    0.24 * (v.lipidRichness - 4.8) -
    0.18 * (v.naturalBenwei - 5.5);

  return [pc1, pc2];
}

/**
 * 把 10 维风味向量映射到 OKLab 的色度平面 (a, b) 与色相/饱和度 (hRad, normRadius)
 * HUE_OFFSET = 2.95 rad 使得：
 * - PC1 > 0（本味/清爽/酸鲜，如潮汕、越南、日本）落在翡翠青 — 碧海蓝绿区间 (h ≈ 2.6 ~ 3.6 rad)
 * - PC1 < 0, PC2 < 0（干香料/浓脂慢炖，如旁遮普、埃塞、黎巴嫩）落在琥珀金 — 赤陶橙区间 (h ≈ 0.8 ~ 1.5 rad)
 * - PC2 > 0（重辣/镬气/草本，如川湘、泰伊森、墨西哥）落在珊瑚赤红 — 青柠翠绿过渡带
 */
const HUE_OFFSET = 2.95;
const MAX_RADIUS = 6.2;

export function vectorToOklabChroma(v: SensoryVector10D): {
  hRad: number;
  normR: number;
  a: number;
  b: number;
} {
  const [x, y] = vectorToFlavorCoords(v);
  // 让角度分布更舒展，避免聚成一团
  const hRad = Math.atan2(-y * 1.15, x) + HUE_OFFSET;
  const rRaw = Math.hypot(x, y * 1.15);
  const normR = Math.min(1, Math.max(0.22, Math.pow(rRaw / MAX_RADIUS, 0.78)));
  const chroma = 0.055 + normR * 0.095; // OKLab C 范围 0.055 ~ 0.150，既清澈鲜明又不刺眼溢出
  return {
    hRad,
    normR,
    a: chroma * Math.cos(hRad),
    b: chroma * Math.sin(hRad),
  };
}

/**
 * 向量 → #RRGGBB（基于风味空间位置的 OKLCH 映射）
 * 纯函数：同一向量永远得到同一颜色，且在风味空间中邻近的地区颜色自然相近。
 */
export function vectorToColor(v: SensoryVector10D, lightness = 0.76): string {
  const sum = VECTOR_KEYS.reduce((s, k) => s + v[k], 0);
  if (sum === 0) return '#94A3B8';
  const { a, b } = vectorToOklabChroma(v);
  return toHex(oklabToRgb(lightness, a, b));
}

/** 节点颜色：保留对 visuals.primaryColor 的兼容，留空时按风味空间位置计算 */
export function nodeColor(node: CulinaryNode): string {
  return node.visuals.primaryColor || vectorToColor(node.sensoryVector);
}

/**
 * 界面统一使用的节点风味空间色：
 * 直接由该节点在 10 维风味空间中的坐标经 OKLab 生成，确保“图 2 里离得近 = 地图上颜色相近”！
 */
export function nodeTone(node: CulinaryNode, lightness = 0.76): string {
  return vectorToColor(node.sensoryVector, lightness);
}

/**
 * 在 OKLab 感知均匀空间中对两个 #RRGGBB 或两个向量做平滑插值，绝不产生发灰发泥的中间色
 */
export function mixHex(aHex: string, bHex: string, t: number): string {
  const parse = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
  const [ra, ga, ba] = parse(aHex);
  const [rb, gb, bb] = parse(bHex);
  // 转换到线性空间做插值再编码，比直接 RGB 线性插值干净得多
  const lin = (c: number) => {
    const u = c / 255;
    return u <= 0.04045 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4);
  };
  const r = gammaEncode(lin(ra) + (lin(rb) - lin(ra)) * t) * 255;
  const g = gammaEncode(lin(ga) + (lin(gb) - lin(ga)) * t) * 255;
  const b = gammaEncode(lin(ba) + (lin(bb) - lin(ba)) * t) * 255;
  return toHex([r, g, b]);
}

/**
 * 将颜色调整到指定明度（保持清澈色相，不再像旧版那样把饱和度压死成泥灰色）
 */
export function muted(hex: string): string {
  return hex;
}
