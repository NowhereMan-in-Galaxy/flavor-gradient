import { useEffect } from 'react';
import { Flame, Sparkles, Utensils, X } from 'lucide-react';
import type { CookingTechniqueProfile, CulinaryNode, DishRecommendation } from '../types/flavor';
import { nodeTone } from '../lib/color';
import { closestChineseNode } from '../lib/search';
import { VectorBars } from './VectorBars';
import { DishCard } from './DishCard';
import { NodeCrest } from './FlavorCrest';

interface Props {
  node: CulinaryNode | null;
  allNodes?: CulinaryNode[];
  score: number | null;
  inline?: boolean;
  onClose: () => void;
  onSelectNode?: (node: CulinaryNode) => void;
}

const METHOD_LABELS: Array<[keyof CookingTechniqueProfile['methodWeights'], string]> = [
  ['steamingPoaching', '蒸 / 白灼'],
  ['stirFryWok', '猛火快炒'],
  ['rawColdMarinate', '生腌 / 冷拌'],
  ['charGrillRoast', '炭火炙烤'],
  ['slowBraiseStew', '慢火浓炖'],
  ['fermentPickle', '发酵酸腌'],
];

function DishList({
  title,
  dishes,
  node,
  tone,
}: {
  title: string;
  dishes: DishRecommendation[];
  node: CulinaryNode;
  tone: 'safe' | 'caution';
}) {
  return (
    <div>
      <h3
        className={`text-xs font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
          tone === 'safe' ? 'text-emerald-400' : 'text-amber-400'
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            tone === 'safe' ? 'bg-emerald-400' : 'bg-amber-400'
          }`}
        />
        {title}
      </h3>
      <ul className="space-y-2">
        {dishes.map((d) => (
          <li key={d.localName}>
            <DishCard dish={d} node={node} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 节点详情面板：支持右栏内嵌模式（inline）与移动端抽屉模式 */
export function NodeDrawer({ node, allNodes, score, inline = false, onClose, onSelectNode }: Props) {
  useEffect(() => {
    if (inline) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, inline]);

  if (!node) return null;
  const color = nodeTone(node);
  const { travelerGuide: g, ingredientProfile: ing } = node;
  const chineseCousin = allNodes ? closestChineseNode(node, allNodes) : null;

  const content = (
    <>
      <div className="sticky top-0 z-10 bg-[#0E131B]/95 backdrop-blur-md px-4 pt-3.5 pb-3 border-b border-slate-800/80 flex items-start gap-3">
        <NodeCrest node={node} size={46} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-serif text-lg leading-tight text-slate-50">{node.name.zh}</h2>
            <span className="text-slate-500 text-xs">{node.name.local}</span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5 leading-snug">{g.oneLineVibe}</p>
        </div>
        {score !== null && (
          <div className="text-right shrink-0">
            <div className="font-mono text-lg font-semibold leading-none" style={{ color }}>
              {score}%
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">适口度</div>
          </div>
        )}
        {!inline && (
          <button onClick={onClose} aria-label="关闭" className="p-1 text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* 跨国参照：它最像哪个中国菜系？ */}
        {chineseCousin && (
          <div className="rounded-lg bg-slate-900/90 border border-slate-800 px-3 py-2 flex items-center justify-between gap-2 text-xs">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Sparkles size={13} className="text-brass shrink-0" />
              中国胃参照：最像你熟悉的
              <button
                onClick={() => onSelectNode?.(chineseCousin.node)}
                className="font-serif text-slate-50 font-medium underline decoration-brass/60 hover:text-brass"
              >
                {chineseCousin.node.name.zh}
              </button>
            </span>
            <span className="font-mono text-[11px] text-brass shrink-0">
              相似度 {chineseCousin.similarity}%
            </span>
          </div>
        )}

        {/* 风味和弦与烹饪哲学 */}
        <div className="rounded-lg bg-[#0A0E15]/80 border border-slate-800/70 p-3 text-xs space-y-1.5">
          <div className="flex items-start gap-2">
            <Utensils size={13} className="text-slate-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-slate-400">风味和弦：</span>
              <span className="text-slate-100 font-medium">{node.flavorPrinciple.summaryChord}</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Flame size={13} className="text-slate-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-slate-400">烹饪哲学：</span>
              <span className="text-slate-200">{node.cookingProfile.philosophyNote}</span>
            </div>
          </div>
          <div className="pt-1 flex flex-wrap gap-1">
            {node.cookingProfile.signatureMethods.map((m) => (
              <span
                key={m}
                className="px-2 py-0.5 rounded bg-slate-800/80 text-[11px] text-slate-300 border border-slate-700/50"
              >
                {m}
              </span>
            ))}
          </div>
          {ing && (
            <p className="text-slate-400 pt-1 border-t border-slate-800/70 leading-relaxed">
              主食：{ing.staples.join('、')} · 核心食材：{ing.keyIngredients.map((i) => i.name).join('、')}
            </p>
          )}
        </div>

        {/* 10 维本味与感官向量 */}
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
            10 维本味与感官指纹
          </div>
          <VectorBars vector={node.sensoryVector} color={color} />
        </div>

        {/* 6 大烹饪方式比重 */}
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
            烹饪技法与火候结构
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs bg-[#0A0E15]/60 rounded-lg p-2.5 border border-slate-800/60">
            {METHOD_LABELS.map(([key, label]) => {
              const val = node.cookingProfile.methodWeights[key];
              return (
                <div key={key} className="flex items-center gap-2">
                  <span className="w-16 text-[11px] text-slate-400 truncate">{label}</span>
                  <div className="flex-1 h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${val * 10}%`, background: color, opacity: 0.35 + val * 0.065 }}
                    />
                  </div>
                  <span className="w-3 text-right font-mono text-[10.5px] text-slate-400">{val}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 闭眼点 & 慎点 */}
        <DishList title="闭眼点（合胃口推荐）" dishes={g.safeOrderDishes} node={node} tone="safe" />
        <DishList title="慎点（风味/质构预警）" dishes={g.cautionDishes} node={node} tone="caution" />

        {/* 菜单黑话关键词 */}
        <div>
          <h3 className="text-[11px] font-mono uppercase tracking-wider mb-2 text-slate-400">
            当地菜单速查词典
          </h3>
          <ul className="flex flex-wrap gap-1.5">
            {g.menuKeyTerms.map((t) => (
              <li
                key={t.term}
                className={`text-xs rounded-md px-2.5 py-1 border ${
                  t.vibe === 'safe'
                    ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-200'
                    : 'border-amber-500/40 bg-amber-950/30 text-amber-200'
                }`}
                title={t.meaning}
              >
                <span className="font-mono font-medium">{t.term}</span>
                <span className="text-slate-400"> · {t.meaning}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );

  if (inline) {
    return (
      <div
        className="rounded-xl border border-slate-800/90 bg-[#0E131B] overflow-y-auto max-h-[76vh] no-scrollbar"
        aria-label={`${node.name.zh} 详情`}
      >
        {content}
      </div>
    );
  }

  return (
    <aside
      className="fixed z-30 bg-[#0E131B]/95 backdrop-blur-md border-slate-700 shadow-2xl overflow-y-auto
        inset-x-0 bottom-0 max-h-[72vh] rounded-t-2xl border-t
        md:inset-y-0 md:left-auto md:right-0 md:w-[400px] md:max-h-none md:rounded-none md:border-t-0 md:border-l"
      aria-label={`${node.name.zh} 详情`}
    >
      {content}
    </aside>
  );
}
