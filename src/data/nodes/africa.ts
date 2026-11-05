import type { CulinaryNode } from '../../types/flavor';

export const AFRICA_NODES: CulinaryNode[] = [
  {
    id: 'et-highland',
    name: { zh: '埃塞俄比亚高原', en: 'Ethiopian Highlands', local: 'ኢትዮጵያ' },
    regionGroup: 'east-africa',
    coordinates: [38.74, 9.03],
    climate: {
      zone: 'temperate',
      elevationMeters: 2355,
      avgTempCelsius: 16,
      climateReason: '高原农耕，苔麸发酵饼为主食，复合干香料与澄清黄油长时间慢炖',
    },
    flavorPrinciple: {
      umamiOrBase: ['Niter kibbeh 香料黄油', '洋葱'],
      acidOrSweet: ['Injera 发酵酸'],
      aromatics: ['Berbere', '葫芦巴', '豆蔻'],
      summaryChord: '香料黄油 + Berbere + 洋葱长炖',
    },
    cookingProfile: {
      primaryThermalMedium: 'slow-fat-stew',
      signatureMethods: ['Wot 慢炖', 'Injera 发酵', 'Tibs 煎炒'],
      methodWeights: {
        steamingPoaching: 1,
        stirFryWok: 4,
        rawColdMarinate: 3,
        charGrillRoast: 2,
        slowBraiseStew: 9,
        fermentPickle: 7,
      },
      philosophyNote: '洋葱干炒到化，再让香料和油脂慢慢熬合',
    },
    ingredientProfile: {
      staples: ['Injera（苔麸发酵饼）'],
      keyIngredients: [
        { name: '苔麸 Teff', category: 'grain' },
        { name: '牛肉', category: 'beef' },
        { name: '鸡/鸡蛋', category: 'poultry' },
        { name: '红扁豆/鹰嘴豆粉', category: 'legume' },
        { name: '澄清黄油', category: 'dairy' },
        { name: '羽衣甘蓝', category: 'vegetable' },
      ],
    },
    sensoryVector: {
      naturalBenwei: 2,
      wokHeiThermal: 3,
      umamiFerment: 5,
      brightAcid: 5,
      freshHerbal: 2,
      warmDrySpice: 9,
      capsaicinHeat: 7,
      lipidRichness: 7,
      sweetHarmony: 2,
      crispTexture: 2,
    },
    pairingLogic: 'hybrid-bridge',
    visuals: { primaryColor: '#B45309', secondaryColor: '#FDE68A', svgGlyphType: 'spice-mandala' },
    travelerGuide: {
      oneLineVibe: '用酸饼抓起香料的厚度',
      safeOrderDishes: [
        { localName: 'ጥብስ (Tibs)', zhName: '香料煎牛肉', cookingMethod: '热锅快煎', whyMatchOrWarn: '最接近“小炒”的一道' },
        { localName: 'በያይነቱ (Beyaynetu)', zhName: '素食拼盘', cookingMethod: '多种豆菜炖', whyMatchOrWarn: '一次尝多种，辣度可选，斋戒日必有' },
      ],
      cautionDishes: [
        { localName: 'ዶሮ ወጥ (Doro wot)', zhName: '香料炖鸡', cookingMethod: 'Berbere 长炖', whyMatchOrWarn: '干香料+糊状质地都很重' },
        { localName: 'ክትፎ (Kitfo)', zhName: '生牛肉碎', cookingMethod: '香料黄油拌生牛肉', whyMatchOrWarn: '生肉，可要求 leb-leb（半熟）' },
      ],
      menuKeyTerms: [
        { term: 'Wot', meaning: '浓稠炖菜', vibe: 'caution' },
        { term: 'Tibs', meaning: '煎炒肉块', vibe: 'safe' },
        { term: 'Kitfo / Tere siga', meaning: '生牛肉', vibe: 'caution' },
        { term: 'Alicha', meaning: '不辣的黄色炖菜', vibe: 'safe' },
      ],
    },
    neighborIds: ['lb-beirut', 'in-punjab'],
  },
];
