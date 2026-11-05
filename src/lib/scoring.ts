import type { CulinaryNode, SensoryVector10D, UserPalatePreset } from '../types/flavor';

export const VECTOR_KEYS: (keyof SensoryVector10D)[] = [
  'naturalBenwei',
  'wokHeiThermal',
  'umamiFerment',
  'brightAcid',
  'freshHerbal',
  'warmDrySpice',
  'capsaicinHeat',
  'lipidRichness',
  'sweetHarmony',
  'crispTexture',
];

export const VECTOR_LABELS_ZH: Record<keyof SensoryVector10D, string> = {
  naturalBenwei: '本味',
  wokHeiThermal: '镬气焦香',
  umamiFerment: '发酵鲜',
  brightAcid: '明亮酸',
  freshHerbal: '生鲜草本',
  warmDrySpice: '干香料',
  capsaicinHeat: '辣/麻',
  lipidRichness: '油脂醇厚',
  sweetHarmony: '回甘',
  crispTexture: '清爽质构',
};

/**
 * 加权欧氏距离 → 0~100 匹配度。
 * 选距离而不是余弦：余弦只看“方向”，会把“全都淡”和“全都重”判成相似，不符合点菜直觉。
 */
export function matchScore(vector: SensoryVector10D, preset: UserPalatePreset): number {
  let sum = 0;
  let maxSum = 0;
  for (const k of VECTOR_KEYS) {
    const w = preset.weights[k];
    const d = vector[k] - preset.idealVector[k];
    sum += w * d * d;
    maxSum += w * 100; // 单维最大差 10
  }
  return Math.round(100 * (1 - Math.sqrt(sum / maxSum)));
}

/** 两个节点之间的相似度（不加权），用于走廊/邻居推荐 */
export function nodeSimilarity(a: CulinaryNode, b: CulinaryNode): number {
  let sum = 0;
  for (const k of VECTOR_KEYS) {
    const d = a.sensoryVector[k] - b.sensoryVector[k];
    sum += d * d;
  }
  return Math.round(100 * (1 - Math.sqrt(sum / (VECTOR_KEYS.length * 100))));
}

export function rankNodes(nodes: CulinaryNode[], preset: UserPalatePreset) {
  return nodes
    .map((n) => ({ node: n, score: matchScore(n.sensoryVector, preset) }))
    .sort((a, b) => b.score - a.score);
}
