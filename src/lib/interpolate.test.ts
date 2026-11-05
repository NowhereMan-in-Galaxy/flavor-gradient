import { describe, expect, it } from 'vitest';
import type { SensoryVector10D } from '../types/flavor';
import { lerpVector, segmentAt } from './interpolate';
import { VECTOR_KEYS } from './scoring';

const fill = (v: number) => Object.fromEntries(VECTOR_KEYS.map((k) => [k, v])) as unknown as SensoryVector10D;

describe('lerpVector', () => {
  it('t=0 / t=1 返回端点，t=0.5 返回中点', () => {
    expect(lerpVector(fill(2), fill(8), 0)).toEqual(fill(2));
    expect(lerpVector(fill(2), fill(8), 1)).toEqual(fill(8));
    expect(lerpVector(fill(2), fill(8), 0.5)).toEqual(fill(5));
  });

  it('越界与 NaN 被夹住，不产生 NaN', () => {
    expect(lerpVector(fill(2), fill(8), 3)).toEqual(fill(8));
    expect(lerpVector(fill(2), fill(8), -1)).toEqual(fill(2));
    expect(lerpVector(fill(2), fill(8), Number.NaN)).toEqual(fill(2));
  });
});

describe('segmentAt', () => {
  it('把连续位置映射到区段', () => {
    expect(segmentAt(0, 3)).toEqual({ i: 0, t: 0 });
    expect(segmentAt(1.25, 3)).toEqual({ i: 1, t: 0.25 });
    expect(segmentAt(2, 3)).toEqual({ i: 1, t: 1 });
  });

  it('越界、NaN、站点不足时安全', () => {
    expect(segmentAt(9, 3)).toEqual({ i: 1, t: 1 });
    expect(segmentAt(-1, 3)).toEqual({ i: 0, t: 0 });
    expect(segmentAt(Number.NaN, 3)).toEqual({ i: 0, t: 0 });
    expect(segmentAt(0.5, 1)).toEqual({ i: 0, t: 0 });
  });
});
