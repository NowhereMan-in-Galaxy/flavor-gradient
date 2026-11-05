/** 风味色场：在投影平面上做反距离加权（IDW）插值，生成 RGBA 像素 */
export interface FieldSource {
  x: number;
  y: number;
  rgb: [number, number, number];
  /** 0–1：该点的强度（如匹配度），决定色场亮度 */
  strength: number;
}

/**
 * gw×gh 网格，每格对应投影坐标 (i*scale, j*scale)。
 * 颜色 = 各源颜色按 1/d² 加权平均；不透明度随到最近源的距离衰减（远离数据的地方淡出），并乘以插值后的强度。
 */
export function flavorField(sources: FieldSource[], gw: number, gh: number, scale: number, reach = 80): Uint8ClampedArray {
  const out = new Uint8ClampedArray(gw * gh * 4);
  if (!sources.length) return out;
  for (let j = 0; j < gh; j++) {
    for (let i = 0; i < gw; i++) {
      const x = i * scale;
      const y = j * scale;
      let ws = 0;
      let r = 0;
      let g = 0;
      let b = 0;
      let s = 0;
      let dmin = Infinity;
      for (const src of sources) {
        const d2 = (src.x - x) ** 2 + (src.y - y) ** 2;
        if (d2 < dmin) dmin = d2;
        const w = 1 / (d2 + 16);
        ws += w;
        r += src.rgb[0] * w;
        g += src.rgb[1] * w;
        b += src.rgb[2] * w;
        s += src.strength * w;
      }
      const fade = Math.exp(-dmin / (reach * reach));
      const k = (j * gw + i) * 4;
      out[k] = r / ws;
      out[k + 1] = g / ws;
      out[k + 2] = b / ws;
      out[k + 3] = 255 * fade * (0.15 + 0.6 * (s / ws));
    }
  }
  return out;
}
