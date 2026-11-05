import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { NODES } from '../data/nodes';
import { FlavorCrest, GLYPH_TYPES, NodeCrest } from './FlavorCrest';

describe('FlavorCrest', () => {
  it('同一向量多次渲染结果完全一致', () => {
    for (const n of NODES) {
      expect(renderToStaticMarkup(<NodeCrest node={n} />)).toBe(renderToStaticMarkup(<NodeCrest node={n} />));
    }
  });

  it('不同节点的纹章互不相同', () => {
    const marks = new Set(NODES.map((n) => renderToStaticMarkup(<NodeCrest node={n} />)));
    expect(marks.size).toBe(NODES.length);
  });

  it('7 种 svgGlyphType 都有中心图标', () => {
    expect(GLYPH_TYPES).toHaveLength(7);
  });

  it('快照：潮汕纹章', () => {
    const n = NODES.find((x) => x.id === 'cn-chaoshan')!;
    expect(
      renderToStaticMarkup(
        <FlavorCrest vector={n.sensoryVector} primary="#38BDF8" secondary="#E0F2FE" glyph="ocean-shell" />,
      ),
    ).toMatchSnapshot();
  });
});
