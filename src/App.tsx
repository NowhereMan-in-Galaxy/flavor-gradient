import { useMemo, useState } from 'react';
import { NODES } from './data/nodes';
import { CORRIDORS } from './data/corridors';
import { PRESETS } from './data/presets';
import { rankNodes, VECTOR_KEYS, VECTOR_LABELS_ZH } from './lib/scoring';
import type { CulinaryNode } from './types/flavor';

/**
 * Stage 0 占位界面：只证明数据→评分→渲染这条链路是通的。
 * 地图（Stage 3）、走廊滑块（Stage 4）、SVG 纹章（Stage 5）按 docs/ROADMAP.md 逐步替换。
 */
export default function App() {
  const preset = PRESETS[0];
  const ranked = useMemo(() => rankNodes(NODES, preset), [preset]);
  const [selected, setSelected] = useState<CulinaryNode>(ranked[0].node);

  return (
    <div className="min-h-full p-6 md:p-10 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">FlavorGradient</h1>
        <p className="text-slate-400 mt-1">全球饮食渐变星图 · 本味罗盘（Stage 0 基座）</p>
        <p className="text-sm text-emerald-300 mt-3">当前口味：{preset.name}</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <section>
          <h2 className="text-sm uppercase text-slate-500 mb-3">匹配度排行</h2>
          <ul className="space-y-2">
            {ranked.map(({ node, score }) => (
              <li key={node.id}>
                <button
                  onClick={() => setSelected(node)}
                  className={`w-full text-left rounded-lg px-4 py-3 bg-cardNight border transition ${
                    selected.id === node.id ? 'border-emerald-400' : 'border-transparent hover:border-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full mr-2"
                        style={{ background: node.visuals.primaryColor }}
                      />
                      {node.name.zh} <span className="text-slate-500 text-sm">{node.name.en}</span>
                    </span>
                    <span className="font-mono">{score}%</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl bg-cardNight p-5">
          <h2 className="text-xl font-semibold">{selected.name.zh}</h2>
          <p className="text-slate-400 text-sm mb-4">{selected.travelerGuide.oneLineVibe}</p>
          <p className="text-sm mb-1">风味和弦：{selected.flavorPrinciple.summaryChord}</p>
          <p className="text-sm mb-1">烹饪哲学：{selected.cookingProfile.philosophyNote}</p>
          {selected.ingredientProfile && (
            <p className="text-sm mb-4">
              主食：{selected.ingredientProfile.staples.join('、')}　食材：
              {selected.ingredientProfile.keyIngredients.map((i) => i.name).join('、')}
            </p>
          )}
          <div className="space-y-1.5">
            {VECTOR_KEYS.map((k) => (
              <div key={k} className="flex items-center gap-2 text-xs">
                <span className="w-16 text-slate-400">{VECTOR_LABELS_ZH[k]}</span>
                <div className="flex-1 h-1.5 bg-slate-800 rounded">
                  <div
                    className="h-1.5 rounded"
                    style={{ width: `${selected.sensoryVector[k] * 10}%`, background: selected.visuals.primaryColor }}
                  />
                </div>
                <span className="w-4 text-right font-mono">{selected.sensoryVector[k]}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="text-sm uppercase text-slate-500 mb-3">渐变走廊</h2>
        {CORRIDORS.map((c) => (
          <div key={c.id} className="rounded-xl bg-cardNight p-5">
            <h3 className="font-semibold">{c.title.zh}</h3>
            <p className="text-slate-400 text-sm">{c.subtitle}</p>
            <div
              className="h-1 rounded my-4"
              style={{ background: `linear-gradient(90deg, ${c.gradientColors.join(',')})` }}
            />
            <ol className="grid md:grid-cols-3 gap-3 text-sm">
              {c.stops.map((s) => (
                <li key={s.nodeId} className="bg-slateNight rounded-lg p-3">
                  <div className="font-medium">{s.representativeDishMorph.dishName}</div>
                  <div className="text-slate-400">{s.transitionNote}</div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </section>
    </div>
  );
}
