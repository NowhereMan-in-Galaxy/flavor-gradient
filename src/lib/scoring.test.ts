import { describe, expect, it } from 'vitest';
import type { CulinaryNode, SensoryVector10D, UserPalatePreset } from '../types/flavor';
import { NODES } from '../data/nodes';
import { PRESETS } from '../data/presets';
import { matchScore, nodeSimilarity, rankNodes, VECTOR_KEYS } from './scoring';

const fill = (v: number): SensoryVector10D =>
  Object.fromEntries(VECTOR_KEYS.map((k) => [k, v])) as unknown as SensoryVector10D;
const weights = (w: number) => Object.fromEntries(VECTOR_KEYS.map((k) => [k, w])) as Record<keyof SensoryVector10D, number>;
const preset = (ideal: SensoryVector10D, w = weights(1)): UserPalatePreset => ({
  id: 't',
  name: 't',
  description: '',
  idealVector: ideal,
  weights: w,
});
const asNode = (v: SensoryVector10D): CulinaryNode => ({ ...NODES[0], sensoryVector: v });

describe('matchScore', () => {
  it('完全相同向量 → 100', () => {
    expect(matchScore(fill(5), preset(fill(5)))).toBe(100);
  });

  it('完全相反（0 vs 10）→ 0', () => {
    expect(matchScore(fill(0), preset(fill(10)))).toBe(0);
  });

  it('权重为 0 的维度不影响结果', () => {
    const w = { ...weights(1), warmDrySpice: 0 };
    const a = fill(5);
    const b = { ...fill(5), warmDrySpice: 10 };
    expect(matchScore(a, preset(fill(5), w))).toBe(matchScore(b, preset(fill(5), w)));
  });

  it('“全都淡”与“全都重”不相似（距离而非余弦）', () => {
    expect(matchScore(fill(2), preset(fill(8)))).toBeLessThan(50);
  });
});

describe('nodeSimilarity', () => {
  it('自身相似度为 100，且对称', () => {
    const [a, b] = NODES;
    expect(nodeSimilarity(a, a)).toBe(100);
    expect(nodeSimilarity(a, b)).toBe(nodeSimilarity(b, a));
  });

  it('全 0 与全 10 相似度为 0', () => {
    expect(nodeSimilarity(asNode(fill(0)), asNode(fill(10)))).toBe(0);
  });
});

describe('rankNodes', () => {
  it.each(PRESETS.map((p) => [p.id, p] as const))('%s 预设输出降序且不丢节点', (_, p) => {
    const ranked = rankNodes(NODES, p);
    expect(ranked).toHaveLength(NODES.length);
    for (let i = 1; i < ranked.length; i++) expect(ranked[i - 1].score).toBeGreaterThanOrEqual(ranked[i].score);
  });
});
