import { describe, expect, it } from 'vitest';
import { NODES } from '../data/nodes';
import { nodeColor, vectorToColor } from './color';

describe('vectorToColor', () => {
  it('输出 #RRGGBB 且确定性', () => {
    for (const n of NODES) {
      const c = vectorToColor(n.sensoryVector);
      expect(c).toMatch(/^#[0-9A-F]{6}$/);
      expect(vectorToColor(n.sensoryVector)).toBe(c);
    }
  });

  it('干香料主导偏琥珀（红 > 蓝），本味主导偏青绿（绿 > 红）', () => {
    const punjab = NODES.find((n) => n.id === 'in-punjab')!;
    const vn = NODES.find((n) => n.id === 'vn-north')!;
    const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const [pr, , pb] = rgb(vectorToColor(punjab.sensoryVector));
    const [vr, vg] = rgb(vectorToColor(vn.sensoryVector));
    expect(pr).toBeGreaterThan(pb);
    expect(vg).toBeGreaterThan(vr);
  });

  it('primaryColor 为空时自动计算', () => {
    const n = { ...NODES[0], visuals: { ...NODES[0].visuals, primaryColor: '' } };
    expect(nodeColor(n)).toBe(vectorToColor(n.sensoryVector));
    expect(nodeColor(NODES[0])).toBe(NODES[0].visuals.primaryColor);
  });
});
