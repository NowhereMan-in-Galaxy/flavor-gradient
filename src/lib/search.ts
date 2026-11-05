import type { CulinaryNode } from '../types/flavor';
import { nodeSimilarity } from './scoring';

/** 国家码 → 中/英/当地别名，让“秘鲁”“Peru”“Perú”都能命中 */
const COUNTRY_ALIASES: Record<string, string[]> = {
  cn: ['中国', 'China'],
  vn: ['越南', 'Vietnam', 'Việt Nam'],
  th: ['泰国', 'Thailand', 'ไทย'],
  my: ['马来西亚', 'Malaysia'],
  np: ['尼泊尔', 'Nepal'],
  in: ['印度', 'India'],
  uz: ['乌兹别克斯坦', 'Uzbekistan'],
  lb: ['黎巴嫩', 'Lebanon'],
  et: ['埃塞俄比亚', 'Ethiopia'],
  it: ['意大利', 'Italy', 'Italia'],
  pe: ['秘鲁', 'Peru', 'Perú'],
  mx: ['墨西哥', 'Mexico', 'México'],
  jp: ['日本', 'Japan'],
};

export type HitKind = 'place' | 'safe' | 'caution' | 'term-safe' | 'term-caution' | 'ingredient';

export interface SearchHit {
  kind: HitKind;
  text: string;
}

export interface SearchResult {
  node: CulinaryNode;
  score: number;
  hits: SearchHit[];
}

/** 小写 + 去掉变音符号（Phở → pho、Perú → peru）+ 合并空白 */
export function normalize(s: string): string {
  return s.normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/gi, 'd').toLowerCase().replace(/\s+/g, ' ').trim();
}

const KIND_WEIGHT: Record<HitKind, number> = {
  place: 5,
  safe: 3,
  caution: 3,
  'term-safe': 2,
  'term-caution': 2,
  ingredient: 1,
};

function fields(n: CulinaryNode): SearchHit[] {
  const g = n.travelerGuide;
  const country = n.id.split('-')[0];
  return [
    ...[n.name.zh, n.name.en, n.name.local, ...(COUNTRY_ALIASES[country] ?? [])].map((text) => ({ kind: 'place' as const, text })),
    ...g.safeOrderDishes.flatMap((d) => [d.localName, d.zhName].map((text) => ({ kind: 'safe' as const, text }))),
    ...g.cautionDishes.flatMap((d) => [d.localName, d.zhName].map((text) => ({ kind: 'caution' as const, text }))),
    ...g.menuKeyTerms.map((t) => ({ kind: t.vibe === 'safe' ? ('term-safe' as const) : ('term-caution' as const), text: t.term })),
    ...(n.ingredientProfile
      ? [...n.ingredientProfile.staples, ...n.ingredientProfile.keyIngredients.map((i) => i.name)].map((text) => ({
          kind: 'ingredient' as const,
          text,
        }))
      : []),
  ];
}

/**
 * 纯前端搜索：对国家/地区名、菜名（当地文字+中文）、菜单关键词、食材做去变音子串匹配。
 * 完全相等的命中额外加分；同一字段只计一次。
 */
export function searchNodes(nodes: CulinaryNode[], query: string): SearchResult[] {
  const q = normalize(query);
  if (!q) return [];
  const out: SearchResult[] = [];
  for (const node of nodes) {
    let score = 0;
    const hits: SearchHit[] = [];
    const seen = new Set<string>();
    for (const f of fields(node)) {
      const t = normalize(f.text);
      if (!t.includes(q)) continue;
      const key = f.kind + '|' + f.text;
      if (seen.has(key)) continue;
      seen.add(key);
      score += KIND_WEIGHT[f.kind] * (t === q ? 2 : 1);
      hits.push(f);
    }
    if (score > 0) out.push({ node, score, hits });
  }
  return out.sort((a, b) => b.score - a.score);
}

/** 与某节点最相似的中国节点（“它像你熟悉的…”），排除自身 */
export function closestChineseNode(node: CulinaryNode, nodes: CulinaryNode[]) {
  let best: { node: CulinaryNode; similarity: number } | null = null;
  for (const n of nodes) {
    if (n.id === node.id || !n.id.startsWith('cn-')) continue;
    const similarity = nodeSimilarity(node, n);
    if (!best || similarity > best.similarity) best = { node: n, similarity };
  }
  return best;
}
