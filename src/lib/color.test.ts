import { describe, expect, it } from 'vitest';
import { NODES } from '../data/nodes';
import { mixHex, muted, nodeColor, nodeTone, oklchToRgb, vectorToColor, vectorToOklabChroma } from './color';

describe('color (OKLab Flavor Space Mapping)', () => {
  it('输出 #RRGGBB 且确定性', () => {
    for (const n of NODES) {
      const c = vectorToColor(n.sensoryVector);
      expect(c).toMatch(/^#[0-9A-F]{6}$/);
      expect(vectorToColor(n.sensoryVector)).toBe(c);
      expect(nodeTone(n)).toBe(c);
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

  it('风味空间邻近的地区（如潮汕与闽南）在 OKLab 中的色距远小于潮汕与埃塞俄比亚', () => {
    const cs = NODES.find((n) => n.id === 'cn-chaoshan')!;
    const mn = NODES.find((n) => n.id === 'cn-minnan')!;
    const et = NODES.find((n) => n.id === 'et-highland')!;
    const cCs = vectorToOklabChroma(cs.sensoryVector);
    const cMn = vectorToOklabChroma(mn.sensoryVector);
    const cEt = vectorToOklabChroma(et.sensoryVector);
    const distNear = Math.hypot(cCs.a - cMn.a, cCs.b - cMn.b);
    const distFar = Math.hypot(cCs.a - cEt.a, cCs.b - cEt.b);
    expect(distNear).toBeLessThan(distFar * 0.5);
  });

  it('primaryColor 为空时自动计算，辅助函数正常工作', () => {
    const n = { ...NODES[0], visuals: { ...NODES[0].visuals, primaryColor: '' } };
    expect(nodeColor(n)).toBe(vectorToColor(n.sensoryVector));
    expect(nodeColor(NODES[0])).toBe(NODES[0].visuals.primaryColor);
    expect(mixHex('#000000', '#FFFFFF', 0.5)).toMatch(/^#[0-9A-F]{6}$/);
    expect(muted('#38BDF8')).toBe('#38BDF8');
    expect(oklchToRgb(0.7, 0.1, 1.5)).toHaveLength(3);
  });
});
