import type { CulinaryNode, DishRecommendation } from '../types/flavor';
import { NodeCrest } from './FlavorCrest';

interface Props {
  dish: DishRecommendation;
  node: CulinaryNode;
}

/** 菜品卡：有 imageUrl 时显示图片 + 右下角小纹章 + credit；没有时显示全尺寸纹章 */
export function DishCard({ dish, node }: Props) {
  const text = (
    <div className="min-w-0">
      <div className="font-medium">
        {dish.zhName}
        {dish.localName !== dish.zhName && <span className="text-slate-500 font-normal"> {dish.localName}</span>}
      </div>
      <div className="text-xs text-slate-400 mt-0.5">{dish.cookingMethod}</div>
      <div className="mt-1">{dish.whyMatchOrWarn}</div>
    </div>
  );

  if (dish.imageUrl) {
    return (
      <figure className="bg-slateNight rounded-lg overflow-hidden text-sm">
        <div className="relative">
          <img src={dish.imageUrl} alt={dish.zhName} loading="lazy" className="w-full aspect-[16/10] object-cover" />
          <div className="absolute right-2 bottom-2 rounded-full ring-2 ring-black/40">
            <NodeCrest node={node} size={36} />
          </div>
        </div>
        <div className="p-3">{text}</div>
        {dish.imageCredit && (
          <figcaption className="px-3 pb-2 text-[10px] text-slate-500">图片：{dish.imageCredit}</figcaption>
        )}
      </figure>
    );
  }

  return (
    <div className="bg-slateNight rounded-lg p-3 text-sm flex gap-3 items-start">
      <NodeCrest node={node} size={56} />
      {text}
    </div>
  );
}
