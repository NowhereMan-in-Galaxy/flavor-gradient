import type { SensoryVector10D } from '../types/flavor';
import { VECTOR_KEYS } from './scoring';

const clamp01 = (t: number) => (Number.isFinite(t) ? Math.min(1, Math.max(0, t)) : 0);

/** 两个向量线性插值，t 被夹在 [0,1]（NaN 视为 0） */
export function lerpVector(a: SensoryVector10D, b: SensoryVector10D, t: number): SensoryVector10D {
  const u = clamp01(t);
  const out = {} as SensoryVector10D;
  for (const k of VECTOR_KEYS) out[k] = a[k] + (b[k] - a[k]) * u;
  return out;
}

/**
 * 滑块位置（0 ~ stopCount-1 的连续值）→ 所在区段 `i` 与区段内进度 `t`。
 * 最后一站返回 i = stopCount-2, t = 1，保证 i+1 永远是合法下标。
 */
export function segmentAt(pos: number, stopCount: number): { i: number; t: number } {
  if (stopCount < 2) return { i: 0, t: 0 };
  const p = Math.min(stopCount - 1, Math.max(0, Number.isFinite(pos) ? pos : 0));
  const i = Math.min(Math.floor(p), stopCount - 2);
  return { i, t: p - i };
}
