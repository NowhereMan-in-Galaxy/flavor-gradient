import { oklabToRgb } from './color';

/** 风味色场：支持基础 RGB 源（兼容旧测试）与 OKLab 风味空间源 */
export interface FieldSource {
  x: number;
  y: number;
  rgb: [number, number, number];
  /** 0–1：该点的强度（如匹配度），决定色场亮度 */
  strength: number;
}

export interface OklabFieldSource {
  x: number;
  y: number;
  /** OKLab 色度坐标 a, b（由风味空间 PCA 位置决定） */
  a: number;
  b: number;
  /** 0–1：当前胃口下的匹配度 */
  strength: number;
}

export interface ContourLayer {
  threshold: number;
  label: string;
  svgPath: string;
  isMajor: boolean;
  labelPos?: [number, number];
}

/**
 * 基础反距离加权色场（保留向后兼容与单元测试）
 */
export function flavorField(
  sources: FieldSource[],
  gw: number,
  gh: number,
  scale: number,
  reach = 80,
): Uint8ClampedArray {
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
        if (d2 < dmin) d2 >= 0 && (dmin = d2);
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

/**
 * OKLab 感知均匀风味色场 + 匹配度标量场生成
 * - 颜色在 OKLab (a, b) 空间内按高斯核平滑插值，过渡带清澈透亮，绝不产生 RGB 混色的棕绿泥色
 * - 同时返回 `scoreGrid` 供地形等值线（Marching Squares Contours）提取使用
 */
export function oklabFlavorField(
  sources: OklabFieldSource[],
  gw: number,
  gh: number,
  scale: number,
  sigma = 38,
): { pixels: Uint8ClampedArray; scoreGrid: Float32Array } {
  const pixels = new Uint8ClampedArray(gw * gh * 4);
  const scoreGrid = new Float32Array(gw * gh);
  if (!sources.length) return { pixels, scoreGrid };

  const twoSigma2 = 2 * sigma * sigma;

  for (let j = 0; j < gh; j++) {
    const y = j * scale;
    for (let i = 0; i < gw; i++) {
      const x = i * scale;
      let wSum = 0;
      let aSum = 0;
      let bSum = 0;
      let sSum = 0;
      let wMax = 0;

      for (let idx = 0; idx < sources.length; idx++) {
        const src = sources[idx];
        const dx = src.x - x;
        const dy = src.y - y;
        const d2 = dx * dx + dy * dy;
        const k = Math.exp(-d2 / twoSigma2) + 1e-9;
        wSum += k;
        aSum += src.a * k;
        bSum += src.b * k;
        sSum += src.strength * k;
        if (k > wMax) wMax = k;
      }

      const sv = sSum / wSum;
      // 距离最近节点的覆盖度（远离数据点的荒漠/极地自然消隐）
      const cover = Math.pow(Math.min(1, wMax * 1.28), 0.72);
      const effectiveScore = sv * Math.pow(cover, 0.35);
      const cellIdx = j * gw + i;
      scoreGrid[cellIdx] = effectiveScore;

      const aMean = aSum / wSum;
      const bMean = bSum / wSum;
      // 高匹配区更明亮清透，低匹配区沉入暗夜底色
      const L = 0.54 + 0.25 * Math.pow(sv, 1.1);
      const chromaBoost = 0.85 + 0.32 * sv;
      const [r, g, b] = oklabToRgb(L, aMean * chromaBoost, bMean * chromaBoost);

      const alpha = cover * (0.14 + 0.62 * Math.pow(sv, 1.35));
      const pIdx = cellIdx * 4;
      pixels[pIdx] = r;
      pixels[pIdx + 1] = g;
      pixels[pIdx + 2] = b;
      pixels[pIdx + 3] = Math.round(255 * Math.min(1, Math.max(0, alpha)));
    }
  }

  return { pixels, scoreGrid };
}

/**
 * Marching Squares 地形等值线提取器（带线性插值平滑）
 * 在匹配度标量场 `scoreGrid` 上提取多条等高线，呈现类似国家地理/等高线地形图的精致质感
 */
export function extractIsoContours(
  scoreGrid: Float32Array,
  gw: number,
  gh: number,
  scale: number,
  thresholds: number[] = [0.42, 0.55, 0.66, 0.75],
): ContourLayer[] {
  if (gw < 2 || gh < 2 || scoreGrid.length < gw * gh) return [];

  return thresholds.map((th, idx) => {
    const parts: string[] = [];
    let bestLabelPos: [number, number] | undefined;
    let bestY = Infinity;

    const interp = (v1: number, v2: number): number => {
      const denom = v2 - v1;
      if (Math.abs(denom) < 1e-6) return 0.5;
      return Math.min(1, Math.max(0, (th - v1) / denom));
    };

    for (let j = 0; j < gh - 1; j++) {
      const row0 = j * gw;
      const row1 = (j + 1) * gw;
      for (let i = 0; i < gw - 1; i++) {
        const v00 = scoreGrid[row0 + i];     // top-left
        const v10 = scoreGrid[row0 + i + 1]; // top-right
        const v11 = scoreGrid[row1 + i + 1]; // bottom-right
        const v01 = scoreGrid[row1 + i];     // bottom-left

        const mask =
          (v00 >= th ? 8 : 0) |
          (v10 >= th ? 4 : 0) |
          (v11 >= th ? 2 : 0) |
          (v01 >= th ? 1 : 0);

        if (mask === 0 || mask === 15) continue;

        // 4 条边上的插值交点: top(0), right(1), bottom(2), left(3)
        const top = (): [number, number] => [(i + interp(v00, v10)) * scale, j * scale];
        const right = (): [number, number] => [(i + 1) * scale, (j + interp(v10, v11)) * scale];
        const bottom = (): [number, number] => [(i + interp(v01, v11)) * scale, (j + 1) * scale];
        const left = (): [number, number] => [i * scale, (j + interp(v00, v01)) * scale];

        const addSeg = (p1: [number, number], p2: [number, number]) => {
          parts.push(`M${p1[0].toFixed(1)},${p1[1].toFixed(1)}L${p2[0].toFixed(1)},${p2[1].toFixed(1)}`);
          if (p1[1] < bestY && p1[0] > scale * gw * 0.15 && p1[0] < scale * gw * 0.85) {
            bestY = p1[1];
            bestLabelPos = p1;
          }
        };

        switch (mask) {
          case 1:
          case 14:
            addSeg(left(), bottom());
            break;
          case 2:
          case 13:
            addSeg(bottom(), right());
            break;
          case 3:
          case 12:
            addSeg(left(), right());
            break;
          case 4:
          case 11:
            addSeg(top(), right());
            break;
          case 5: {
            const center = 0.25 * (v00 + v10 + v11 + v01);
            if (center >= th) {
              addSeg(left(), top());
              addSeg(bottom(), right());
            } else {
              addSeg(left(), bottom());
              addSeg(top(), right());
            }
            break;
          }
          case 6:
          case 9:
            addSeg(top(), bottom());
            break;
          case 7:
          case 8:
            addSeg(left(), top());
            break;
          case 10: {
            const center = 0.25 * (v00 + v10 + v11 + v01);
            if (center >= th) {
              addSeg(left(), bottom());
              addSeg(top(), right());
            } else {
              addSeg(left(), top());
              addSeg(bottom(), right());
            }
            break;
          }
        }
      }
    }

    return {
      threshold: th,
      label: `${Math.round(th * 100)}%`,
      svgPath: parts.join(''),
      isMajor: idx >= thresholds.length - 2,
      labelPos: bestLabelPos,
    };
  });
}
