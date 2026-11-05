/**
 * 数据校验：每个阶段合并前必须通过 `npm run validate:data`
 * 失败时以非 0 退出码结束，CI 会拦截。
 */
import { NODES } from '../src/data/nodes';
import { CORRIDORS } from '../src/data/corridors';
import { PRESETS } from '../src/data/presets';
import { VECTOR_KEYS } from '../src/lib/scoring';

/** 只允许许可明确的图片来源（AGENTS.md §2） */
const ALLOWED_IMAGE_HOSTS = ['upload.wikimedia.org', 'images.unsplash.com'];

const errors: string[] = [];
const err = (m: string) => errors.push(m);

const ids = new Set<string>();
for (const n of NODES) {
  if (ids.has(n.id)) err(`重复 id: ${n.id}`);
  ids.add(n.id);

  if (!/^[a-z]{2}-[a-z0-9-]+$/.test(n.id)) err(`${n.id}: id 需为 "国家码-地区" 小写格式`);

  const [lng, lat] = n.coordinates;
  if (lng < -180 || lng > 180 || lat < -90 || lat > 90) err(`${n.id}: 坐标越界`);

  for (const k of VECTOR_KEYS) {
    const v = n.sensoryVector[k];
    if (typeof v !== 'number' || v < 0 || v > 10) err(`${n.id}: sensoryVector.${k}=${v} 不在 0~10`);
  }
  for (const [k, v] of Object.entries(n.cookingProfile.methodWeights)) {
    if (v < 0 || v > 10) err(`${n.id}: methodWeights.${k}=${v} 不在 0~10`);
  }
  if (n.visuals.primaryColor && !/^#[0-9A-Fa-f]{6}$/.test(n.visuals.primaryColor))
    err(`${n.id}: primaryColor 需为 #RRGGBB 或留空（留空自动计算）`);
  if (n.travelerGuide.safeOrderDishes.length < 2) err(`${n.id}: 至少 2 道 safeOrderDishes`);
  if (n.travelerGuide.cautionDishes.length < 1) err(`${n.id}: 至少 1 道 cautionDishes`);
  if (n.travelerGuide.menuKeyTerms.length < 3) err(`${n.id}: 至少 3 个 menuKeyTerms`);
  if (n.neighborIds.length < 1) err(`${n.id}: 至少 1 个 neighborIds`);
  if (n.neighborIds.includes(n.id)) err(`${n.id}: neighborIds 不能包含自己`);
  for (const d of [...n.travelerGuide.safeOrderDishes, ...n.travelerGuide.cautionDishes]) {
    if (!d.imageUrl) continue;
    let host = '';
    try {
      host = new URL(d.imageUrl).host;
    } catch {
      err(`${n.id}: ${d.localName} 的 imageUrl 不是合法 URL`);
    }
    if (host && !ALLOWED_IMAGE_HOSTS.includes(host)) err(`${n.id}: ${d.localName} 图片来源 ${host} 不在白名单`);
    if (!d.imageCredit) err(`${n.id}: ${d.localName} 有 imageUrl 但缺少 imageCredit`);
  }
  const ing = n.ingredientProfile;
  if (ing) {
    if (ing.staples.length < 1) err(`${n.id}: ingredientProfile.staples 至少 1 项`);
    if (ing.keyIngredients.length < 3 || ing.keyIngredients.length > 8)
      err(`${n.id}: ingredientProfile.keyIngredients 需 3~8 项`);
  }
  if (!n.name.zh || !n.name.en || !n.name.local) err(`${n.id}: name 三语不全`);
}

for (const n of NODES) {
  for (const nb of n.neighborIds) if (!ids.has(nb)) err(`${n.id}: neighborIds 引用不存在的 ${nb}`);
}

if (CORRIDORS.length < 3) err(`至少 3 条走廊（当前 ${CORRIDORS.length}）`);
if (PRESETS.length < 4) err(`至少 4 个口味预设（当前 ${PRESETS.length}）`);
if (new Set(PRESETS.map((p) => p.id)).size !== PRESETS.length) err('预设 id 重复');

for (const c of CORRIDORS) {
  if (c.stops.length < 3) err(`走廊 ${c.id}: 至少 3 站`);
  for (const s of c.stops) if (!ids.has(s.nodeId)) err(`走廊 ${c.id}: stop 引用不存在的 ${s.nodeId}`);
}

for (const p of PRESETS) {
  for (const k of VECTOR_KEYS) {
    if (p.idealVector[k] === undefined || p.weights[k] === undefined) err(`预设 ${p.id}: 缺少 ${k}`);
  }
}

if (errors.length) {
  console.error(`❌ 数据校验失败（${errors.length} 项）:`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(`✅ 数据校验通过：${NODES.length} 个节点 / ${CORRIDORS.length} 条走廊 / ${PRESETS.length} 个口味预设`);
