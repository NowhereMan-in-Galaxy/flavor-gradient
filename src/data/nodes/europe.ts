import type { CulinaryNode } from '../../types/flavor';

export const EUROPE_NODES: CulinaryNode[] = [
  {
    id: 'it-south',
    name: { zh: '意大利南部', en: 'Southern Italy (Naples–Sicily)', local: 'Mezzogiorno' },
    regionGroup: 'mediterranean',
    coordinates: [14.25, 40.85],
    climate: {
      zone: 'mediterranean',
      elevationMeters: 20,
      avgTempCelsius: 17.5,
      climateReason: '夏干冬湿的地中海气候，番茄、橄榄、柑橘与海鲜丰富，烹饪靠好食材少处理',
    },
    flavorPrinciple: {
      umamiOrBase: ['番茄', '帕玛森/佩科里诺', '凤尾鱼'],
      acidOrSweet: ['番茄', '柠檬', '刺山柑'],
      aromatics: ['罗勒', '蒜', '牛至', '橄榄油'],
      summaryChord: '番茄 + 橄榄油 + 蒜 + 罗勒',
    },
    cookingProfile: {
      primaryThermalMedium: 'dry-char-bake',
      signatureMethods: ['柴窑烤披萨', '煮面拌酱', '烤海鲜', '番茄慢炖 Ragù'],
      methodWeights: {
        steamingPoaching: 6,
        stirFryWok: 5,
        rawColdMarinate: 5,
        charGrillRoast: 7,
        slowBraiseStew: 6,
        fermentPickle: 4,
      },
      philosophyNote: '四五种好食材，十分钟上桌',
    },
    ingredientProfile: {
      staples: ['意大利面', '披萨饼底', '面包'],
      keyIngredients: [
        { name: '番茄', category: 'vegetable' },
        { name: '马苏里拉/帕玛森', category: 'dairy' },
        { name: '蛤蜊/鱿鱼/沙丁鱼', category: 'seafood' },
        { name: '茄子', category: 'vegetable' },
        { name: '柠檬', category: 'fruit' },
        { name: '猪肉（香肠/腌肉）', category: 'pork' },
      ],
    },
    sensoryVector: {
      naturalBenwei: 7,
      wokHeiThermal: 5,
      umamiFerment: 5,
      brightAcid: 5,
      freshHerbal: 4,
      warmDrySpice: 2,
      capsaicinHeat: 2,
      lipidRichness: 5,
      sweetHarmony: 4,
      crispTexture: 5,
    },
    pairingLogic: 'compound-sharing-Western',
    visuals: { primaryColor: '#EF4444', secondaryColor: '#FEF3C7', svgGlyphType: 'olive-sun' },
    travelerGuide: {
      oneLineVibe: '番茄、橄榄油和海的简单',
      safeOrderDishes: [
        { localName: 'Spaghetti alle vongole', zhName: '白酒蛤蜊面', cookingMethod: '蒜油快炒蛤蜊', whyMatchOrWarn: '像蒜蓉炒蛤蜊拌面，海鲜本味' },
        { localName: 'Pizza Margherita', zhName: '玛格丽特披萨', cookingMethod: '柴窑 90 秒', whyMatchOrWarn: '饼边焦香，番茄酸甜，不腻' },
        { localName: 'Frittura di paranza', zhName: '炸小海鲜', cookingMethod: '薄粉油炸', whyMatchOrWarn: '像椒盐小鱼去掉椒盐' },
      ],
      cautionDishes: [
        { localName: 'Pasta con le sarde', zhName: '沙丁鱼茴香面', cookingMethod: '沙丁鱼+野茴香+葡萄干', whyMatchOrWarn: '鱼味重+甜咸混搭' },
      ],
      menuKeyTerms: [
        { term: 'Frutti di mare', meaning: '海鲜', vibe: 'safe' },
        { term: 'alla griglia', meaning: '烤', vibe: 'safe' },
        { term: 'Crudo', meaning: '生的（生海鲜/生火腿）', vibe: 'caution' },
        { term: 'Al dente', meaning: '面偏硬是正宗，不是没煮熟', vibe: 'caution' },
      ],
    },
    neighborIds: ['lb-beirut', 'pe-lima-coastal'],
  },
];
