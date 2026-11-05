/**
 * FlavorGradient Core Schema
 * 融合「东方本味与火候技法体系」与「西方计算美食学 (Computational Gastronomy)」
 *
 * 理论支撑：
 * 1. 中国烹饪哲学：本味论（"有味使之出，无味使之入"）与火候传热介质分类（水蒸白灼、猛火镬气、冷酸生腌、炭火炙烤、油脂慢炖）
 * 2. Elisabeth Rozin (1973/1983) "Flavor Principles"（核心调味三元组）
 * 3. Yong-Yeol Ahn et al. (2011) "Flavor Network"（东亚反差碰撞 vs 西方同频叠加）
 * 4. Billing & Sherman (1998) "Antimicrobial Hypothesis"（海拔/气温与香料密度的地理渐变）
 * 5. ISO 感官流变学（质构从“慢炖泥糊状”到“生脆清爽分明”的光谱）
 */

export type ClimateZone = 'alpine' | 'temperate' | 'subtropical' | 'tropical' | 'arid' | 'mediterranean';

export type ThermalMedium =
  | 'water-steam'      // 水汽温润：清蒸、白灼、清汆、清汤（最大化保留食材本味）
  | 'high-heat-wok'    // 猛火热油：爆炒、镬气、生啫、热油泼淋（瞬时美拉德反应，外香里嫩）
  | 'raw-acid-cure'    // 冷食酸腌：生腌、鱼生、凉拌、Ceviche柠檬汁熟成（极度清爽生脆）
  | 'dry-char-bake'    // 干热炙烤：炭火烧烤、馕坑、Tandoor、明火吊烤（焦香脱水）
  | 'slow-fat-stew';   // 慢火浓炖：咖喱慢焖、黄油/酥油炖菜、豆泥糊化（香料深度融合、质地浓稠）

export type SvgGlyphType =
  | 'ocean-shell'      // 沿海本味/海鲜鲜甜
  | 'citrus-leaf'      // 酸爽草本/热带丛林
  | 'wok-flame'        // 猛火镬气/鲜辣小炒
  | 'mountain-mist'    // 高原牧歌/清炖酥油
  | 'spice-mandala'    // 复合干香料/慢炖浓咖喱
  | 'desert-ember'     // 炭火炙烤/干旱绿洲
  | 'olive-sun';       // 地中海阳光/果酸橄榄

/**
 * 10维中西合璧风味与技法向量 (每一项取值 0 ~ 10)
 * 专门解决纯西方分子模型忽略「食材本味」与「烹饪火候/质构」的问题
 */
export interface SensoryVector10D {
  /** 1. 自然本味度 (Benwei / Ingredient Purity): 10=极致吃食材原鲜清甜(白灼/清蒸)，0=香料或浓酱完全重塑味道 */
  naturalBenwei: number;
  /** 2. 猛火镬气与焦香 (Wok Hei & Char): 10=极高火候爆炒/炭烤香气，0=冷食或低温水煮 */
  wokHeiThermal: number;
  /** 3. 氨基酸与发酵鲜味 (Umami & Ferment): 海产原鲜、酱油、鱼露、虾酱、豆豉、菌菇高汤 */
  umamiFerment: number;
  /** 4. 明亮挥发酸度 (Bright Acid): 青柠、米醋、酸笋、酸木瓜、罗望子、番茄果酸 */
  brightAcid: number;
  /** 5. 生鲜草本植物气 (Fresh Herbal): 葱姜蒜、香菜、紫苏、薄荷、香茅、九层塔、刺芫荽 */
  freshHerbal: number;
  /** 6. 烘焙温暖干香料 (Warm Dry Spice): 孜然、小豆蔻、肉桂、丁香、八角、葫芦巴、Garam Masala、Berbere */
  warmDrySpice: number;
  /** 7. 鲜辣与椒麻刺激 (Capsaicin & Mala Heat): 鲜小米辣、涮涮辣、花椒、黑胡椒 */
  capsaicinHeat: number;
  /** 8. 油脂乳化与醇厚度 (Lipid Richness): 酥油Ghee、黄油、椰浆、芝麻酱Tahini、动物浓脂 */
  lipidRichness: number;
  /** 9. 提鲜回甘与甜度 (Sweet Harmony): 冰糖提鲜、椰糖、美拉德焦糖化洋葱、蜜汁 */
  sweetHarmony: number;
  /** 10. 质构清爽分明度 (Crisp & Clear Texture): 10=爽脆滑嫩/汤清叶绿/颗粒分明，0=慢炖打泥/糊状浓稠(Hummus/Wot/浓糊咖喱) */
  crispTexture: number;
}

/**
 * 6大烹饪方式占比分布 (0~10)，让中国人一眼看懂“这地方的菜是怎么做出来的”
 */
export interface CookingTechniqueProfile {
  primaryThermalMedium: ThermalMedium;
  signatureMethods: string[]; // 例如 ["白灼", "清蒸", "生腌", "猛火快炒"]
  methodWeights: {
    steamingPoaching: number; // 蒸、白灼、清汆、清汤煮
    stirFryWok: number;       // 猛火快炒、爆、溜、生啫
    rawColdMarinate: number;  // 生腌、刺身、酸汁冷拌、舂(Pounding)
    charGrillRoast: number;   // 炭烤、炙、炉烤、馕坑烘烤
    slowBraiseStew: number;   // 慢炖、焖、浓咖喱熬煮、泥糊化(Puree)
    fermentPickle: number;    // 酸笋发酵、糟卤、泡菜、腊味风干
  };
  philosophyNote: string; // 一句话点破当地烹饪哲学（如“追求刚出水海鲜的极致滑嫩与原汁清甜”）
}

export interface DishRecommendation {
  localName: string;
  zhName: string;
  cookingMethod: string;     // 例如 "青柠辣椒冷腌" 或 "猛火快炒"
  whyMatchOrWarn: string;    // 为什么适合你的胃 / 为什么可能踩雷
  svgBadge?: SvgGlyphType;
  imageUrl?: string;         // 预留图片槽位：未来可直接填入 Unsplash/Wikimedia/自拍美食图 URL
  imageCredit?: string;      // 有 imageUrl 时必填：作者 + 许可证 + 来源，如 "Kham Tran, CC BY 3.0, via Wikimedia Commons"
}

/** 食材大类：用于饮食禁忌筛选（清真/素食/不吃牛）与“爱海鲜”等偏好 */
export type IngredientCategory =
  | 'seafood'      // 鱼、虾蟹、贝类
  | 'pork'
  | 'beef'         // 含牦牛
  | 'lamb-goat'
  | 'poultry'
  | 'dairy'        // 奶、酥油、奶酪、酸奶
  | 'egg'
  | 'legume'       // 豆类、豆制品、鹰嘴豆、扁豆
  | 'grain'        // 米、麦、玉米、苔麸、青稞
  | 'vegetable'    // 蔬菜、块茎
  | 'fruit'
  | 'fungi'
  | 'nut-seed'     // 花生、芝麻、椰子
  | 'offal-other'; // 内脏、昆虫、星虫等“挑战型”食材

export interface KeyIngredient {
  name: string;               // 中文名，可附当地语言，如 "苔麸 Teff"
  category: IngredientCategory;
}

/** 这个地方“吃的是什么”——与风味向量互补：向量答“什么味”，这里答“什么料” */
export interface IngredientProfile {
  staples: string[];               // 主食：米饭、米粉、馕、Injera、玉米饼……
  keyIngredients: KeyIngredient[]; // 最具代表性的 3~8 种食材（不含纯调味料，调味料见 flavorPrinciple）
}

export interface CulinaryNode {
  id: string;
  name: {
    zh: string;
    en: string;
    local: string;
  };
  regionGroup:
    | 'china-coastal'
    | 'china-southwest'
    | 'china-northwest-himalaya'
    | 'southeast-asia'
    | 'south-asia'
    | 'central-west-asia'
    | 'east-africa'
    | 'mediterranean'
    | 'latin-america'
    | 'east-asia-northeast';
  coordinates: [number, number]; // [经度 longitude, 纬度 latitude]
  climate: {
    zone: ClimateZone;
    elevationMeters: number;
    avgTempCelsius: number;
    climateReason: string; // 气候如何塑造了当地饮食（如高寒保热 vs 热带抑菌开胃）
  };
  flavorPrinciple: {
    umamiOrBase: string[];
    acidOrSweet: string[];
    aromatics: string[];
    summaryChord: string;
  };
  cookingProfile: CookingTechniqueProfile;
  /** 可选（Stage 1 新增）：主食与核心食材 */
  ingredientProfile?: IngredientProfile;
  sensoryVector: SensoryVector10D;
  pairingLogic: 'contrast-Eastern' | 'compound-sharing-Western' | 'hybrid-bridge';
  visuals: {
    primaryColor: string;
    secondaryColor: string;
    svgGlyphType: SvgGlyphType;
    coverImageUrl?: string; // 预留节点封面大图 URL（有图显示图+SVG角标，无图显示全尺寸生成式SVG纹章）
  };
  travelerGuide: {
    oneLineVibe: string;
    safeOrderDishes: DishRecommendation[];
    cautionDishes: DishRecommendation[];
    menuKeyTerms: Array<{ term: string; meaning: string; vibe: 'safe' | 'caution' }>;
  };
  neighborIds: string[]; // 与哪些周边或跨洋风味节点相连
}

/**
 * 跨国饮食渐变走廊 (Culinary Gradient Corridor)
 * 展示食物如何随着海拔、纬度、贸易路线一步步变形
 */
export interface CorridorStop {
  nodeId: string;
  transitionNote: string; // 在这一站发生了什么关键风味/技法突变？
  representativeDishMorph: {
    dishName: string;
    wrapperOrBase: string;
    fillingOrProtein: string;
    soulDipOrSauce: string;
    cookingShift: string;
  };
}

export interface FlavorCorridor {
  id: string;
  title: {
    zh: string;
    en: string;
  };
  subtitle: string;
  themeColor: string;
  gradientColors: [string, string, string];
  scientificDriver: string; // 驱动这条走廊渐变的自然/历史原因（如海拔骤降3500米、澜沧江-湄公河流域）
  morphingConceptName: string; // 同源变形载体，如“从高原藏包到恒河咖喱饺”或“从螺蛳酸笋到湄公河柠檬鱼露粉”
  stops: CorridorStop[];
}

/**
 * 用户个人口味画像（吃货罗盘预设）
 */
export interface UserPalatePreset {
  id: string;
  name: string;
  description: string;
  idealVector: SensoryVector10D;
  weights: Record<keyof SensoryVector10D, number>; // 哪些维度是一票否决或高权重（如本味度、清爽质构、排斥干香料）
}
