import { NODES } from '../data/nodes';
import { NodeCrest } from './FlavorCrest';

/** 纹章图鉴（访问 #crests）：用于肉眼检查各节点纹章是否可区分 */
export function CrestGallery() {
  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      <h1 className="text-xl font-semibold mb-1">风味纹章图鉴</h1>
      <p className="text-sm text-slate-400 mb-5">
        瓣长＝10 维分值（12 点钟起顺时针：本味、镬气、发酵鲜、酸、草本、干香料、辣、油脂、回甘、清爽），中心图标＝风味原型。
        <a href="#" className="text-emerald-400 ml-2">← 返回地图</a>
      </p>
      <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {NODES.map((n) => (
          <li key={n.id} className="flex flex-col items-center text-center gap-1">
            <NodeCrest node={n} size={120} />
            <span className="text-sm">{n.name.zh}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
