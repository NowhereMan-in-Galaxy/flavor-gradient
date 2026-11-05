import { describe, expect, it } from 'vitest';
import { NODES } from '../data/nodes';
import { closestChineseNode, normalize, searchNodes } from './search';

const top = (q: string) => searchNodes(NODES, q)[0];

describe('searchNodes', () => {
  it.each(['Ceviche', '秘鲁', 'Lima', 'peru', 'CEVICHE'])('“%s” 命中秘鲁沿海', (q) => {
    expect(top(q)?.node.id).toBe('pe-lima-coastal');
  });

  it('“Wot” 命中埃塞俄比亚，且命中项为慎点', () => {
    const r = top('Wot');
    expect(r?.node.id).toBe('et-highland');
    expect(r?.hits.some((h) => h.kind === 'caution' || h.kind === 'term-caution')).toBe(true);
  });

  it('去变音：pho 命中越南 Phở', () => {
    expect(top('pho')?.node.id).toBe('vn-north');
  });

  it('空查询返回空', () => {
    expect(searchNodes(NODES, '  ')).toEqual([]);
  });

  it('normalize 去掉变音与大小写', () => {
    expect(normalize('  Phở  Bò ')).toBe('pho bo');
    expect(normalize('Đà Nẵng')).toBe('da nang');
  });
});

describe('closestChineseNode', () => {
  it('秘鲁沿海最像中国沿海/西南节点，且不返回自身', () => {
    const pe = NODES.find((n) => n.id === 'pe-lima-coastal')!;
    const best = closestChineseNode(pe, NODES)!;
    expect(best.node.id.startsWith('cn-')).toBe(true);
    const cs = NODES.find((n) => n.id === 'cn-chaoshan')!;
    expect(closestChineseNode(cs, NODES)!.node.id).not.toBe('cn-chaoshan');
  });
});
