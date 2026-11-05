import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { CulinaryNode, DishRecommendation } from '../types/flavor';
import { nodeColor } from '../lib/color';
import { VectorBars } from './VectorBars';

interface Props {
  node: CulinaryNode | null;
  score: number | null;
  onClose: () => void;
}

function DishList({ title, dishes, tone }: { title: string; dishes: DishRecommendation[]; tone: 'safe' | 'caution' }) {
  return (
    <div>
      <h3 className={`text-xs uppercase mb-2 ${tone === 'safe' ? 'text-emerald-400' : 'text-amber-400'}`}>{title}</h3>
      <ul className="space-y-2">
        {dishes.map((d) => (
          <li key={d.localName} className="bg-slateNight rounded-lg p-3 text-sm">
            <div className="font-medium">
              {d.zhName}
              {d.localName !== d.zhName && <span className="text-slate-500 font-normal"> {d.localName}</span>}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">{d.cookingMethod}</div>
            <div className="mt-1">{d.whyMatchOrWarn}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 节点详情抽屉：桌面在右侧，手机（< md）为底部弹出 */
export function NodeDrawer({ node, score, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!node) return null;
  const color = nodeColor(node);
  const { travelerGuide: g, ingredientProfile: ing } = node;

  return (
    <aside
      className="fixed z-30 bg-cardNight/95 backdrop-blur border-slate-700 shadow-2xl overflow-y-auto
        inset-x-0 bottom-0 max-h-[70vh] rounded-t-2xl border-t
        md:inset-y-0 md:left-auto md:right-0 md:w-[400px] md:max-h-none md:rounded-none md:border-t-0 md:border-l"
      aria-label={`${node.name.zh} 详情`}
    >
      <div className="sticky top-0 bg-cardNight/95 backdrop-blur px-5 pt-4 pb-3 border-b border-slate-800 flex items-start gap-3">
        <span className="mt-1.5 w-3 h-3 rounded-full shrink-0" style={{ background: color, boxShadow: `0 0 12px ${color}` }} />
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold leading-tight">
            {node.name.zh} <span className="text-slate-500 text-sm font-normal">{node.name.local}</span>
          </h2>
          <p className="text-slate-400 text-sm">{g.oneLineVibe}</p>
        </div>
        {score !== null && <span className="font-mono text-emerald-300">{score}%</span>}
        <button onClick={onClose} aria-label="关闭" className="p-1 text-slate-400 hover:text-white">
          <X size={18} />
        </button>
      </div>

      <div className="p-5 space-y-5">
        <div className="text-sm space-y-1">
          <p>风味和弦：{node.flavorPrinciple.summaryChord}</p>
          <p>烹饪哲学：{node.cookingProfile.philosophyNote}</p>
          <p className="text-slate-400">招牌做法：{node.cookingProfile.signatureMethods.join(' · ')}</p>
          {ing && (
            <p className="text-slate-400">
              主食：{ing.staples.join('、')}；食材：{ing.keyIngredients.map((i) => i.name).join('、')}
            </p>
          )}
        </div>

        <VectorBars vector={node.sensoryVector} color={color} />

        <DishList title="闭眼点" dishes={g.safeOrderDishes} tone="safe" />
        <DishList title="慎点" dishes={g.cautionDishes} tone="caution" />

        <div>
          <h3 className="text-xs uppercase mb-2 text-slate-400">菜单关键词</h3>
          <ul className="flex flex-wrap gap-2">
            {g.menuKeyTerms.map((t) => (
              <li
                key={t.term}
                className={`text-xs rounded-full px-2.5 py-1 border ${
                  t.vibe === 'safe' ? 'border-emerald-700 text-emerald-200' : 'border-amber-700 text-amber-200'
                }`}
                title={t.meaning}
              >
                {t.term} · {t.meaning}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
