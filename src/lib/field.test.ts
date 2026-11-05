import { describe, expect, it } from 'vitest';
import { flavorField } from './field';

describe('flavorField', () => {
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
  });
});
