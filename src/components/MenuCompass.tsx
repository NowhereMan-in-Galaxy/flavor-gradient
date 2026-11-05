import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { CulinaryNode } from '../types/flavor';
import { closestChineseNode, searchNodes, type HitKind } from '../lib/search';
import { NodeCrest } from './FlavorCrest';

interface Props {
  nodes: CulinaryNode[];
  scores: ReadonlyMap<string, number>;
  onShowOnMap: (node: CulinaryNode) => void;
}

const HIT_LABEL: Record<HitKind, { label: string; cls: string }> = {
  place: { label: '地区', cls: 'border-slate-600 text-slate-300' },
  safe: { label: '闭眼点', cls: 'border-emerald-600 text-emerald-200' },
  caution: { label: '慎点', cls: 'border-amber-600 text-amber-200' },
  'term-safe': { label: '看到就点', cls: 'border-emerald-600 text-emerald-200' },
  'term-caution': { label: '看到就躲', cls: 'border-amber-600 text-amber-200' },
  ingredient: { label: '食材', cls: 'border-sky-700 text-sky-200' },
};

const EXAMPLES = ['Ceviche', '秘鲁', 'Wot', 'Momo', '抓饭', 'Phở'];

/** 点菜罗盘：输入国家/菜系/菜单关键词，返回闭眼点、慎点、关键词与最像的中国菜系 */
export function MenuCompass({ nodes, scores, onShowOnMap }: Props) {
  const [query, setQuery] = useState('');
  const [pickedId, setPickedId] = useState<string | null>(null);
  const results = useMemo(() => searchNodes(nodes, query).slice(0, 6), [nodes, query]);
  const active = results.find((r) => r.node.id === pickedId) ?? results[0];

  return (
    <section className="rounded-xl bg-cardNight p-4" aria-label="点菜罗盘">
      <h2 className="text-sm uppercase text-slate-500 mb-3">点菜罗盘</h2>
      <label className="flex items-center gap-2 bg-slateNight border border-slate-700 rounded-lg px-3 py-2 focus-within:border-emerald-400">
        <Search size={16} className="text-slate-500 shrink-0" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPickedId(null);
          }}
          placeholder="搜国家、菜名或菜单上的词：秘鲁 / Ceviche / Wot / 抓饭"
          aria-label="搜索国家、菜系或菜单关键词"
          className="flex-1 min-w-0 bg-transparent outline-none text-slate-100 placeholder:text-slate-600"
        />
      </label>

      {!query && (
        <div className="flex flex-wrap gap-2 mt-3 text-xs">
          <span className="text-slate-500">试试：</span>
          {EXAMPLES.map((e) => (
            <button key={e} onClick={() => setQuery(e)} className="text-emerald-300 hover:underline">
              {e}
            </button>
          ))}
        </div>
      )}

      {query && results.length === 0 && <p className="text-sm text-slate-500 mt-3">没有找到，换个写法试试（中文、英文或当地文字都行）。</p>}

      {results.length > 1 && (
        <ul className="flex flex-wrap gap-2 mt-3">
          {results.map((r) => (
            <li key={r.node.id}>
              <button
                onClick={() => setPickedId(r.node.id)}
                aria-pressed={r.node.id === active?.node.id}
                className={`text-sm rounded-full px-3 py-1 border ${
                  r.node.id === active?.node.id ? 'border-emerald-400 text-white' : 'border-slate-700 text-slate-400'
                }`}
              >
                {r.node.name.zh}
              </button>
            </li>
          ))}
        </ul>
      )}

      {active && <CompassResult result={active} nodes={nodes} score={scores.get(active.node.id) ?? null} onShowOnMap={onShowOnMap} />}
    </section>
  );
}

function CompassResult({
  result,
  nodes,
  score,
  onShowOnMap,
}: {
  result: ReturnType<typeof searchNodes>[number];
  nodes: CulinaryNode[];
  score: number | null;
  onShowOnMap: (node: CulinaryNode) => void;
}) {
  const { node, hits } = result;
  const g = node.travelerGuide;
  const like = closestChineseNode(node, nodes);
  const avoidHits = hits.filter((h) => h.kind === 'caution' || h.kind === 'term-caution');

  return (
    <div className="mt-4 space-y-4 animate-fade-in" key={node.id}>
      <div className="flex items-center gap-3">
        <NodeCrest node={node} size={48} />
        <div className="flex-1 min-w-0">
          <div className="font-semibold">
            {node.name.zh} <span className="text-slate-500 text-sm font-normal">{node.name.local}</span>
            {score !== null && <span className="font-mono text-emerald-300 text-sm ml-2">{score}%</span>}
          </div>
          <div className="text-sm text-slate-400">{g.oneLineVibe}</div>
        </div>
        <button onClick={() => onShowOnMap(node)} className="text-xs text-emerald-300 hover:underline shrink-0">
          详情 →
        </button>
      </div>

      <ul className="flex flex-wrap gap-1.5" aria-label="命中">
        {hits.map((h) => (
          <li key={h.kind + h.text} className={`text-xs rounded-full border px-2 py-0.5 ${HIT_LABEL[h.kind].cls}`}>
            {HIT_LABEL[h.kind].label} · {h.text}
          </li>
        ))}
      </ul>

      {avoidHits.length > 0 && (
        <p className="text-sm rounded-lg border border-amber-700 bg-amber-950/40 text-amber-100 px-3 py-2">
          ⚠️ 「{avoidHits[0].text}」在这里属于<strong>慎点</strong>，原因见下方。
        </p>
      )}

      {like && (
        <p className="text-sm">
          它像你熟悉的 <strong className="text-emerald-300">{like.node.name.zh}</strong>
          <span className="text-slate-500">（相似度 {like.similarity}%）</span>
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <h3 className="text-xs uppercase text-emerald-400 mb-1.5">闭眼点</h3>
          <ul className="space-y-1.5">
            {g.safeOrderDishes.map((d) => (
              <li key={d.localName}>
                <span className="font-medium">{d.zhName}</span>
                {d.localName !== d.zhName && <span className="text-slate-500"> {d.localName}</span>}
                <div className="text-slate-400">{d.whyMatchOrWarn}</div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs uppercase text-amber-400 mb-1.5">慎点</h3>
          <ul className="space-y-1.5">
            {g.cautionDishes.map((d) => (
              <li key={d.localName}>
                <span className="font-medium">{d.zhName}</span>
                {d.localName !== d.zhName && <span className="text-slate-500"> {d.localName}</span>}
                <div className="text-slate-400">{d.whyMatchOrWarn}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 text-sm">
        {(['safe', 'caution'] as const).map((vibe) => (
          <div key={vibe}>
            <h3 className={`text-xs uppercase mb-1.5 ${vibe === 'safe' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {vibe === 'safe' ? '看到这些词就点' : '看到这些词就躲'}
            </h3>
            <ul className="space-y-0.5">
              {g.menuKeyTerms
                .filter((t) => t.vibe === vibe)
                .map((t) => (
                  <li key={t.term}>
                    <span className="font-mono">{t.term}</span> <span className="text-slate-400">— {t.meaning}</span>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
