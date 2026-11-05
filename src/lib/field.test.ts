import { describe, expect, it } from 'vitest';
import { extractIsoContours, flavorField, oklabFlavorField } from './field';

describe('flavorField & oklabFlavorField & extractIsoContours', () => {
  const src = [
    { x: 0, y: 0, rgb: [255, 0, 0] as [number, number, number], strength: 1 },
    { x: 100, y: 0, rgb: [0, 0, 255] as [number, number, number], strength: 0 },
  ];
  const f = flavorField(src, 11, 11, 10);
  const px = (i: number, j: number) => Array.from(f.slice((j * 11 + i) * 4, (j * 11 + i) * 4 + 4));

  it('靠近源取源色，中点为混色', () => {
    expect(px(0, 0)[0]).toBeGreaterThan(240);
    expect(px(10, 0)[2]).toBeGreaterThan(240);
    const mid = px(5, 0);
    expect(Math.abs(mid[0] - mid[2])).toBeLessThan(2);
  });

  it('强度高的源更不透明，远离源淡出', () => {
    expect(px(0, 0)[3]).toBeGreaterThan(px(10, 0)[3]);
    expect(px(5, 10)[3]).toBeLessThan(px(5, 0)[3]);
  });

  it('无源时全透明', () => {
    expect(flavorField([], 2, 2, 1).every((v) => v === 0)).toBe(true);
    const emptyOklab = oklabFlavorField([], 2, 2, 1);
    expect(emptyOklab.pixels.every((v) => v === 0)).toBe(true);
  });

  it('oklabFlavorField 生成平滑标量场且 extractIsoContours 提取出匹配度等值线路径', () => {
    const oklabSrc = [
      { x: 20, y: 20, a: -0.08, b: 0.06, strength: 0.92 },
      { x: 80, y: 80, a: 0.08, b: 0.07, strength: 0.25 },
    ];
    const { pixels, scoreGrid } = oklabFlavorField(oklabSrc, 20, 20, 5, 25);
    expect(pixels.length).toBe(20 * 20 * 4);
    expect(scoreGrid.length).toBe(20 * 20);
    const contours = extractIsoContours(scoreGrid, 20, 20, 5, [0.3, 0.5, 0.7]);
    expect(contours).toHaveLength(3);
    expect(contours.some((c) => c.svgPath.includes('M') && c.svgPath.includes('L'))).toBe(true);
  });
});
