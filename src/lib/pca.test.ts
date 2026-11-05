import { describe, expect, it } from 'vitest';
import { NODES } from '../data/nodes';
import { flavorSpace } from './pca';

describe('flavorSpace', () => {
  const fs = flavorSpace(NODES);

  it('每个节点都有有限坐标，且结果确定', () => {
    expect(fs.points.size).toBe(NODES.length);
    for (const [x, y] of fs.points.values()) expect(Number.isFinite(x) && Number.isFinite(y)).toBe(true);
    expect(flavorSpace(NODES).points.get('cn-chaoshan')).toEqual(fs.points.get('cn-chaoshan'));
  });

  it('前两主成分解释的方差在 (0,1] 且递减', () => {
    const [a, b] = fs.explained;
    expect(a).toBeGreaterThan(b);
    expect(a + b).toBeLessThanOrEqual(1 + 1e-9);
    expect(b).toBeGreaterThan(0);
  });

  it('潮汕离闽南比离埃塞俄比亚近', () => {
    const p = (id: string) => fs.points.get(id)!;
    const dist = (a: string, b: string) => Math.hypot(p(a)[0] - p(b)[0], p(a)[1] - p(b)[1]);
    expect(dist('cn-chaoshan', 'cn-minnan')).toBeLessThan(dist('cn-chaoshan', 'et-highland'));
  });
});
