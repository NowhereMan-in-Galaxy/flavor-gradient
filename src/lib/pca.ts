import type { CulinaryNode } from '../types/flavor';
import { VECTOR_KEYS } from './scoring';

export interface FlavorSpace {
  /** 每个节点在前两主成分上的坐标 */
  points: Map<string, [number, number]>;
  /** 各维度在 PC1/PC2 上的载荷（双标图箭头） */
  loadings: [number, number][];
  /** 前两主成分解释的方差比例 */
  explained: [number, number];
}

function powerIteration(m: number[][], seed: number): { vec: number[]; val: number } {
  const n = m.length;
  let v = Array.from({ length: n }, (_, i) => 1 + ((i * 7 + seed) % 5) / 10);
  let val = 0;
  for (let it = 0; it < 500; it++) {
    const w = m.map((row) => row.reduce((s, x, j) => s + x * v[j], 0));
    const norm = Math.hypot(...w) || 1;
    const next = w.map((x) => x / norm);
    val = norm;
    const diff = next.reduce((s, x, i) => s + Math.abs(x - v[i]), 0);
    v = next;
    if (diff < 1e-10) break;
  }
  return { vec: v, val };
}

/** 10 维风味向量的主成分分析（协方差矩阵 + 幂迭代 + 降秩），纯函数、确定性 */
export function flavorSpace(nodes: CulinaryNode[]): FlavorSpace {
  const X = nodes.map((n) => VECTOR_KEYS.map((k) => n.sensoryVector[k]));
  const d = VECTOR_KEYS.length;
  const mean = VECTOR_KEYS.map((_, j) => X.reduce((s, r) => s + r[j], 0) / X.length);
  const C = X.map((r) => r.map((x, j) => x - mean[j]));
  const cov = Array.from({ length: d }, (_, i) =>
    Array.from({ length: d }, (_, j) => C.reduce((s, r) => s + r[i] * r[j], 0) / Math.max(1, X.length - 1)),
  );
  const total = cov.reduce((s, row, i) => s + row[i], 0) || 1;
  const p1 = powerIteration(cov, 1);
  const deflated = cov.map((row, i) => row.map((x, j) => x - p1.val * p1.vec[i] * p1.vec[j]));
  const p2 = powerIteration(deflated, 3);
  // 符号固定：让“本味”在 PC1 上为正，便于阅读且保持确定性
  const s1 = p1.vec[0] < 0 ? -1 : 1;
  const s2 = p2.vec[6] < 0 ? -1 : 1;
  const e1 = p1.vec.map((x) => x * s1);
  const e2 = p2.vec.map((x) => x * s2);
  const points = new Map<string, [number, number]>(
    nodes.map((n, i) => [n.id, [C[i].reduce((s, x, j) => s + x * e1[j], 0), C[i].reduce((s, x, j) => s + x * e2[j], 0)]]),
  );
  return { points, loadings: e1.map((x, j) => [x, e2[j]]), explained: [p1.val / total, p2.val / total] };
}
