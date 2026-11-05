/**
 * 合理性抽查：数据“看起来对不对”。失败以非 0 退出，纳入 verify:stage。
 */
import { NODES, NODE_BY_ID } from '../src/data/nodes';
import { PRESETS } from '../src/data/presets';
import { nodeSimilarity, rankNodes } from '../src/lib/scoring';

const failures: string[] = [];
const check = (ok: boolean, msg: string) => {
  console.log(`${ok ? '✅' : '❌'} ${msg}`);
  if (!ok) failures.push(msg);
};
const node = (id: string) => {
  const n = NODE_BY_ID.get(id);
  if (!n) throw new Error(`sanityCheck 引用了不存在的节点 ${id}`);
  return n;
};
const sim = (a: string, b: string) => nodeSimilarity(node(a), node(b));

const coastal = PRESETS.find((p) => p.id === 'coastal-sea');
if (!coastal) throw new Error('缺少 coastal-sea 预设');
const ranked = rankNodes(NODES, coastal).map((r) => r.node);
console.log('沿海本味预设排序：' + ranked.map((n) => n.id).join(' > '));

const top5 = ranked.slice(0, 5);
const coastalLike = top5.filter(
  (n) =>
    n.regionGroup === 'china-coastal' ||
    n.regionGroup === 'southeast-asia' ||
    n.id === 'pe-lima-coastal' ||
    n.id === 'jp-kansai',
);
check(coastalLike.length >= 3, `前 5 名中沿海/东南亚/秘鲁/关西 ≥ 3（实际 ${coastalLike.length}）`);

const bottomThird = new Set(ranked.slice(ranked.length - Math.floor(ranked.length / 3)).map((n) => n.id));
for (const id of ['et-highland', 'lb-beirut', 'in-punjab']) {
  check(bottomThird.has(id), `${id} 在后 1/3（排名 ${ranked.findIndex((n) => n.id === id) + 1}/${ranked.length}）`);
}

check(
  sim('cn-chaoshan', 'cn-minnan') > sim('cn-chaoshan', 'et-highland'),
  `潮汕↔闽南 ${sim('cn-chaoshan', 'cn-minnan')} > 潮汕↔埃塞 ${sim('cn-chaoshan', 'et-highland')}`,
);
check(
  sim('cn-tibet', 'np-kathmandu') > sim('cn-tibet', 'th-central'),
  `西藏↔尼泊尔 ${sim('cn-tibet', 'np-kathmandu')} > 西藏↔泰国中部 ${sim('cn-tibet', 'th-central')}`,
);

if (failures.length) {
  console.error(`\n❌ 合理性抽查失败 ${failures.length} 项`);
  process.exit(1);
}
console.log('\n✅ 合理性抽查全部通过');
