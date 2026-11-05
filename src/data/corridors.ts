import type { FlavorCorridor } from '../types/flavor';

/** 渐变走廊。每个 stop 的 nodeId 必须存在于 NODES（validate:data 会检查）。 */
export const CORRIDORS: FlavorCorridor[] = [
  {
    id: 'lingnan-indochina',
    title: { zh: '岭南—中南半岛酸鲜走廊', en: 'Lingnan–Indochina Sour-Umami Corridor' },
    subtitle: '从潮汕白灼到伊森青木瓜沙拉',
    themeColor: '#22C55E',
    gradientColors: ['#38BDF8', '#84CC16', '#22C55E'],
    scientificDriver: '同属季风湿热带，海产与发酵水产（鱼露/虾酱）共享鲜味来源；酸味从“蘸碟酸”过渡到“发酵酸”再到“青柠酸”',
    morphingConceptName: '一碗汤粉的三次变形',
    stops: [
      {
        nodeId: 'cn-chaoshan',
        transitionNote: '鲜味来自刚出水的海产，酸只在蘸碟里',
        representativeDishMorph: {
          dishName: '粿条汤',
          wrapperOrBase: '米粿条',
          fillingOrProtein: '鱼丸/牛肉',
          soulDipOrSauce: '鱼露、沙茶',
          cookingShift: '清汤快煮',
        },
      },
      {
        nodeId: 'cn-guangxi',
        transitionNote: '酸笋进汤，酸从配角变成主角',
        representativeDishMorph: {
          dishName: '老友粉',
          wrapperOrBase: '切粉',
          fillingOrProtein: '猪肉',
          soulDipOrSauce: '酸笋、豆豉、辣椒',
          cookingShift: '猛火炒料后煮',
        },
      },
      {
        nodeId: 'vn-north',
        transitionNote: '鱼露+青柠，草本以生的形式一大把上桌',
        representativeDishMorph: {
          dishName: 'Phở',
          wrapperOrBase: '河粉',
          fillingOrProtein: '牛肉',
          soulDipOrSauce: '鱼露、青柠、辣椒',
          cookingShift: '长熬清汤+生草本',
        },
      },
      {
        nodeId: 'cn-dai-yunnan',
        transitionNote: '沿红河—澜沧江上溯，汤退场，舂与包烧登场，酸木瓜和野香草接管',
        representativeDishMorph: {
          dishName: '傣味米线 / 喃咪',
          wrapperOrBase: '米线、糯米饭',
          fillingOrProtein: '江鱼、牛肉',
          soulDipOrSauce: '喃咪舂酱、酸木瓜、小米辣',
          cookingShift: '石臼舂+芭蕉叶包烧',
        },
      },
      {
        nodeId: 'th-isaan',
        transitionNote: '顺湄公河而下，发酵鱼 Pla ra 取代鱼露，酸辣到顶，糖几乎消失',
        representativeDishMorph: {
          dishName: 'Som tam + 糯米饭',
          wrapperOrBase: '糯米饭（手捏）',
          fillingOrProtein: '青木瓜、烤鸡',
          soulDipOrSauce: 'Pla ra、青柠、鲜辣椒',
          cookingShift: '生舂冷拌',
        },
      },
    ],
  },
  {
    id: 'himalaya-dough',
    title: { zh: '喜马拉雅面团走廊', en: 'Himalayan Dough Corridor' },
    subtitle: '从拉萨藏包到旁遮普咖喱角',
    themeColor: '#CA8A04',
    gradientColors: ['#A8A29E', '#CA8A04', '#EA580C'],
    scientificDriver:
      '海拔从 3650 米骤降到 250 米、年均温升高约 16°C：高原的酥油清炖让位给河谷的香料与平原的酥油慢炖，香料密度随气温上升（Billing & Sherman 1998）',
    morphingConceptName: '从高原藏包到恒河咖喱角',
    stops: [
      {
        nodeId: 'cn-tibet',
        transitionNote: '面皮包牦牛肉蒸熟，只靠盐和葱，脂肪就是温度',
        representativeDishMorph: {
          dishName: '藏包 Momo',
          wrapperOrBase: '小麦面皮',
          fillingOrProtein: '牦牛肉',
          soulDipOrSauce: '辣椒酱',
          cookingShift: '蒸',
        },
      },
      {
        nodeId: 'np-kathmandu',
        transitionNote: '翻过山口，馅里出现孜然、姜黄和 Timur 花椒，蘸碟变成番茄芝麻 Achar',
        representativeDishMorph: {
          dishName: 'Momo',
          wrapperOrBase: '小麦面皮',
          fillingOrProtein: '水牛肉 / 鸡',
          soulDipOrSauce: '番茄芝麻 Achar',
          cookingShift: '蒸 / 汤泡（Jhol）',
        },
      },
      {
        nodeId: 'in-punjab',
        transitionNote: '面皮改用油酥、整个油炸，馅变成香料土豆豌豆，配罗望子与薄荷酸辣酱',
        representativeDishMorph: {
          dishName: 'Samosa',
          wrapperOrBase: '油酥面皮',
          fillingOrProtein: '香料土豆、豌豆',
          soulDipOrSauce: '罗望子酱、薄荷酸奶酱',
          cookingShift: '油炸',
        },
      },
    ],
  },
  {
    id: 'silk-road-pilaf',
    title: { zh: '丝路抓饭走廊', en: 'Silk Road Pilaf Corridor' },
    subtitle: '从乌鲁木齐抓饭到贝鲁特米饭',
    themeColor: '#D97706',
    gradientColors: ['#D97706', '#B45309', '#84CC16'],
    scientificDriver:
      '沿古丝绸之路由干旱绿洲走向地中海：羊油焖饭逐渐让位给橄榄油、柠檬与新鲜香草，大陆性干旱→地中海湿润，酸味与草本随之增加',
    morphingConceptName: '一锅米饭从羊油到柠檬',
    stops: [
      {
        nodeId: 'cn-xinjiang',
        transitionNote: '羊肉、胡萝卜、洋葱在羊油里焖饭，孜然点香，旁边一串炭烤',
        representativeDishMorph: {
          dishName: '抓饭 Polu',
          wrapperOrBase: '大米',
          fillingOrProtein: '羊肉',
          soulDipOrSauce: '皮牙子拌番茄',
          cookingShift: '羊油焖',
        },
      },
      {
        nodeId: 'uz-tashkent',
        transitionNote: '同一口大锅（Kazan），油更多，加入黄胡萝卜、鹰嘴豆、葡萄干——抓饭成了国宴',
        representativeDishMorph: {
          dishName: 'Osh / Plov',
          wrapperOrBase: '大米',
          fillingOrProtein: '羊肉、鹰嘴豆',
          soulDipOrSauce: 'Achichuk 番茄洋葱沙拉',
          cookingShift: '羊尾油大锅焖',
        },
      },
      {
        nodeId: 'lb-beirut',
        transitionNote: '米饭退为配角（细面米饭），主角换成炭烤肉串、柠檬、芝麻酱与欧芹沙拉',
        representativeDishMorph: {
          dishName: 'Riz bi sh’arieh + Kebab',
          wrapperOrBase: '炒细面米饭',
          fillingOrProtein: '羊肉 / 鸡肉串',
          soulDipOrSauce: 'Toum 蒜蓉酱、Tahini',
          cookingShift: '黄油炒米后焖 + 炭烤',
        },
      },
    ],
  },
];
