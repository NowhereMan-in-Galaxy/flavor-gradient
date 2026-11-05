import type { CulinaryNode } from '../../types/flavor';

export const EAST_ASIA_NODES: CulinaryNode[] = [
  {
    id: 'jp-kansai',
    name: { zh: '日本关西', en: 'Kansai (Osaka–Kyoto)', local: '関西' },
    regionGroup: 'east-asia-northeast',
    coordinates: [135.5, 34.69],
    climate: {
      zone: 'temperate',
      elevationMeters: 20,
      avgTempCelsius: 16.9,
      climateReason: '温带海洋性季风，软水适合萃取昆布高汤；京都怀石重季节，大阪“食倒”重平民小吃',
    },
    flavorPrinciple: {
      umamiOrBase: ['昆布高汤', '柴鱼', '淡口酱油', '白味噌'],
      acidOrSweet: ['味醂', '米醋', '柚子'],
      aromatics: ['山葵', '葱', '紫苏', '山椒'],
      summaryChord: '昆布柴鱼高汤 + 淡口酱油 + 味醂',
    },
    cookingProfile: {
      primaryThermalMedium: 'water-steam',
      signatureMethods: ['出汁煮物', '刺身', '天妇罗', '铁板烧（大阪烧）', '渍物'],
      methodWeights: {
        steamingPoaching: 9,
        stirFryWok: 3,
        rawColdMarinate: 8,
        charGrillRoast: 6,
        slowBraiseStew: 5,
        fermentPickle: 7,
      },
      philosophyNote: '汤色要淡，味道要深——高汤托住食材而不是盖住它',
    },
    ingredientProfile: {
      staples: ['米饭', '乌冬', '大阪烧面糊'],
      keyIngredients: [
        { name: '鲷鱼/鳗/金枪鱼', category: 'seafood' },
        { name: '豆腐/汤叶', category: 'legume' },
        { name: '京野菜', category: 'vegetable' },
        { name: '昆布', category: 'vegetable' },
        { name: '和牛', category: 'beef' },
        { name: '章鱼', category: 'seafood' },
      ],
    },
    sensoryVector: {
      naturalBenwei: 9,
      wokHeiThermal: 3,
      umamiFerment: 9,
      brightAcid: 3,
      freshHerbal: 4,
      warmDrySpice: 0,
      capsaicinHeat: 0,
      lipidRichness: 2,
      sweetHarmony: 7,
      crispTexture: 8,
    },
    pairingLogic: 'contrast-Eastern',
    visuals: { primaryColor: '#60A5FA', secondaryColor: '#F1F5F9', svgGlyphType: 'ocean-shell' },
    travelerGuide: {
      oneLineVibe: '一碗淡色高汤里的季节',
      safeOrderDishes: [
        { localName: 'きつねうどん', zhName: '油豆腐乌冬', cookingMethod: '昆布高汤煮', whyMatchOrWarn: '汤清鲜微甜，像潮汕清汤' },
        { localName: '刺身盛り合わせ', zhName: '刺身拼盘', cookingMethod: '生切', whyMatchOrWarn: '本味极致，像潮汕鱼生' },
        { localName: 'たこ焼き', zhName: '章鱼烧', cookingMethod: '铁板烤', whyMatchOrWarn: '外焦里嫩，酱汁甜咸' },
      ],
      cautionDishes: [
        { localName: '鮒寿司', zhName: '鲫鱼熟寿司', cookingMethod: '米饭乳酸发酵一年以上', whyMatchOrWarn: '强烈发酵臭，近江名物，挑人' },
        { localName: '納豆', zhName: '纳豆', cookingMethod: '枯草菌发酵', whyMatchOrWarn: '拉丝+氨味' },
      ],
      menuKeyTerms: [
        { term: '出汁 (dashi)', meaning: '高汤', vibe: 'safe' },
        { term: '焼き (yaki)', meaning: '烤/煎', vibe: 'safe' },
        { term: '生 (nama)', meaning: '生的', vibe: 'caution' },
        { term: '納豆 (nattō)', meaning: '纳豆', vibe: 'caution' },
      ],
    },
    neighborIds: ['cn-guangfu', 'pe-lima-coastal'],
  },
];
