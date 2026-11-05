import type { FlavorCorridor } from '../types/flavor';

/** 渐变走廊。每个 stop 的 nodeId 必须存在于 NODES（validate:data 会检查）。 */
export const CORRIDORS: FlavorCorridor[] = [
  {
    id: 'lingnan-indochina',
    title: { zh: '岭南—云贵—中南半岛酸鲜走廊', en: 'Lingnan–Yunnan–Indochina Sour-Umami Corridor' },
    subtitle: '从潮汕白灼到伊森青木瓜生舂（6 站）',
    themeColor: '#2DD4BF',
    gradientColors: ['#38BDF8', '#34D399', '#A3E635'],
    scientificDriver:
      '沿北回归线向南深入季风湿热带：鲜味基底从“活海产原汤”过渡到“山野发酵酸汤”再到“鱼露/发酵鱼 Pla ra”；酸味从蘸碟配角一步步升格为汤底主角与生猛果酸',
    morphingConceptName: '一碗米粉的六次跨国变形',
    stops: [
      {
        nodeId: 'cn-chaoshan',
        transitionNote: '鲜味来自刚出水的海产与牛骨清汤，酸只在蘸碟里轻轻点缀',
        representativeDishMorph: {
          dishName: '潮汕粿条汤',
          wrapperOrBase: '鮮米浆粿条',
          fillingOrProtein: '手锤鱼丸 / 鲜切牛肉',
          soulDipOrSauce: '鱼露、沙茶酱、蒜头酥',
          cookingShift: '清汤滚烫快焯（保本味）',
        },
      },
      {
        nodeId: 'cn-guangxi',
        transitionNote: '进入喀斯特盆地，发酵酸笋进锅猛炒再冲汤，酸味正式接管主场',
        representativeDishMorph: {
          dishName: '南宁老友粉 / 螺蛳粉',
          wrapperOrBase: '扁切粉 / 圆米粉',
          fillingOrProtein: '猪杂 / 猪肉片',
          soulDipOrSauce: '发酵酸笋、豆豉、指天椒',
          cookingShift: '猛火镬气炒料 + 高汤滚煮',
        },
      },
      {
        nodeId: 'cn-guizhou',
        transitionNote: '爬上云贵高原苗岭，米汤与野生毛辣果自然发酵出醇厚红酸汤，木姜子带来柠檬般清冽山野气',
        representativeDishMorph: {
          dishName: '凯里酸汤粉 / 酸汤鱼',
          wrapperOrBase: '酸粉 / 苦蒜米线',
          fillingOrProtein: '稻田鲤鱼 / 瘦肉',
          soulDipOrSauce: '发酵红酸汤、木姜子油、糊辣椒蘸水',
          cookingShift: '发酵酸汤慢滚入味',
        },
      },
      {
        nodeId: 'cn-dai-yunnan',
        transitionNote: '顺澜沧江下到热带河谷，滚汤退场，酸木瓜、柠檬与野香草冷拌或石臼生舂登场',
        representativeDishMorph: {
          dishName: '德宏撒撇 / 傣味毫甩',
          wrapperOrBase: '细软米线',
          fillingOrProtein: '火烧猪肉 / 牛肚',
          soulDipOrSauce: '青柠汁、酸木瓜、刺芫荽、涮涮辣',
          cookingShift: '炭烤切碎 + 酸汁冷拌',
        },
      },
      {
        nodeId: 'vn-north',
        transitionNote: '跨过红河入河内，汤底回归极清牛骨汤，但鱼露、青柠与成盘生薄荷/紫苏在桌上自由调配',
        representativeDishMorph: {
          dishName: '河内牛肉河粉 Phở Bò',
          wrapperOrBase: '宽薄河粉 Bánh phở',
          fillingOrProtein: '生烫牛肉片、牛腩',
          soulDipOrSauce: '鱼露 Nước mắm、青柠角、蒜醋辣椒',
          cookingShift: '烤姜葱牛骨长熬清汤 + 生草本冲烫',
        },
      },
      {
        nodeId: 'th-isaan',
        transitionNote: '顺湄公河抵达呵叻高原，未过滤发酵鱼汁 Pla ra 取代清澈鱼露，酸辣飙升到顶，连汤都省去',
        representativeDishMorph: {
          dishName: '伊森青木瓜沙拉 Som Tam + 糯米饭',
          wrapperOrBase: '手捏竹篓糯米饭 / 发酵米线 Khanom Jeen',
          fillingOrProtein: '青木瓜丝、生腌田蟹、炭烤鸡',
          soulDipOrSauce: 'Pla ra 发酵鱼酱、青柠汁、鸟眼椒',
          cookingShift: '陶臼生舂冷拌（无热油）',
        },
      },
    ],
  },
  {
    id: 'himalaya-dough',
    title: { zh: '喜马拉雅海拔骤降走廊', en: 'Himalayan Elevation & Spice Gradient' },
    subtitle: '从拉萨牦牛藏包到恒河咖喱与锡兰椰香（4 站）',
    themeColor: '#F59E0B',
    gradientColors: ['#60A5FA', '#FBBF24', '#F97316'],
    scientificDriver:
      '海拔从 3650 米骤降到海平面、年均温升高近 20°C：高原极寒无需抗菌香料、全靠酥油与红肉御寒；翻过喜马拉雅南坡后，复合抗菌香料密度随气温指数级攀升（Billing & Sherman 1998）',
    morphingConceptName: '从高原清蒸藏包到恒河油酥咖喱角',
    stops: [
      {
        nodeId: 'cn-tibet',
        transitionNote: '海拔 3650m：细菌难殖，不施干香料；小麦面皮裹纯牦牛肉与山葱，吃的是高寒脂肪与肉本味',
        representativeDishMorph: {
          dishName: '拉萨藏包 Momo',
          wrapperOrBase: '筋道小麦死面/半发面皮',
          fillingOrProtein: '手剁高原牦牛肉、山葱',
          soulDipOrSauce: '高原干辣椒油碟',
          cookingShift: '笼屉纯蒸汽蒸熟',
        },
      },
      {
        nodeId: 'np-kathmandu',
        transitionNote: '海拔 1400m（河谷过渡带）：包子的外形还在，但馅料已被孜然、姜黄、Timur 麻椒攻占，蘸料变成浓稠番茄芝麻咖喱酱',
        representativeDishMorph: {
          dishName: '加德满都 Jhol Momo',
          wrapperOrBase: '薄韧小麦面皮',
          fillingOrProtein: '水牛肉 / 鸡肉 + 姜蒜孜然姜黄',
          soulDipOrSauce: '烤番茄白芝麻酸辣汤酱（Jhol Achar）',
          cookingShift: '先蒸熟，再浸入香料浓汤碟',
        },
      },
      {
        nodeId: 'in-punjab',
        transitionNote: '海拔 220m（恒河—印度河高温平原）：水蒸彻底让位于酥油热炸与慢炖，面皮混入 Ghee 油酥，内馅变成重度 Garam Masala 香料土豆泥',
        representativeDishMorph: {
          dishName: '旁遮普咖喱角 Samosa + 鹰嘴豆浓咖喱',
          wrapperOrBase: 'Ghee 酥油起酥面皮',
          fillingOrProtein: '孜然芫荽籽姜黄土豆泥、青豌豆',
          soulDipOrSauce: '罗望子酸甜酱、薄荷酸奶 Chutney',
          cookingShift: '高温油炸 + 浓稠洋葱泥慢炖',
        },
      },
      {
        nodeId: 'lk-colombo',
        transitionNote: '海拔 5m（赤道热带岛屿）：乳制品（酥油/奶油）退居二线，热带椰浆、深度烘焙黑咖喱粉与发酵马尔代夫干鱼接管风味',
        representativeDishMorph: {
          dishName: '锡兰黑咖喱配椰浆米粉碗 Appam',
          wrapperOrBase: '发酵米浆椰奶脆边碗饼 Hoppers',
          fillingOrProtein: '深焙黑咖喱炖海鱼 / 鸡蛋',
          soulDipOrSauce: 'Pol Sambol（鲜椰丝+青柠+红葱+干鲣鱼辣碎）',
          cookingShift: '香料干锅深焙 + 椰浆慢煨',
        },
      },
    ],
  },
  {
    id: 'silk-road-pilaf',
    title: { zh: '丝绸之路绿洲—地中海走廊', en: 'Silk Road Oasis to Mediterranean Corridor' },
    subtitle: '从西安泡馍、天山抓饭到贝鲁特与摩洛哥（6 站）',
    themeColor: '#FB923C',
    gradientColors: ['#F59E0B', '#EC4899', '#2DD4BF'],
    scientificDriver:
      '横跨欧亚大陆干旱腹地至地中海：内陆绿洲以羊尾油、小茴香（孜然）和焖煮锁住热量；越靠近黑海与地中海，新鲜欧芹、薄荷、柠檬果酸与橄榄油逐步化解动物油脂的厚重',
    morphingConceptName: '一锅羊肉与谷物跨越亚欧的演进',
    stops: [
      {
        nodeId: 'cn-shaanxi',
        transitionNote: '丝路起点关中平原：小麦死面馍手掰成粒，吸饱花椒八角熬出的牛羊骨清汤，碳水与骨汤合一',
        representativeDishMorph: {
          dishName: '西安牛羊肉泡馍',
          wrapperOrBase: '饦饦馍（小麦烙饼）',
          fillingOrProtein: '黄牛肉 / 羊肉片',
          soulDipOrSauce: '糖蒜、油泼辣子、香菜',
          cookingShift: '骨汤香料长熬 + 掰馍冒汤',
        },
      },
      {
        nodeId: 'cn-xinjiang',
        transitionNote: '越过河西走廊进入天山绿洲：面食与大米并立，羊油热锅爆香皮牙子与黄胡萝卜，孜然与炭火登场',
        representativeDishMorph: {
          dishName: '新疆手抓饭 Polu',
          wrapperOrBase: '阿克苏长粒大米',
          fillingOrProtein: '带骨羔羊肉、黄胡萝卜、葡萄干',
          soulDipOrSauce: '皮牙子（洋葱）拌番茄青椒酸爽小菜',
          cookingShift: '羊油猛火炒底 + 盖锅焖饭',
        },
      },
      {
        nodeId: 'uz-tashkent',
        transitionNote: '锡尔河中亚腹地：抓饭在巨型铸铁锅 Kazan 中达到脂香巅峰，加入鹰嘴豆、整颗大蒜与小檗果酸味解腻',
        representativeDishMorph: {
          dishName: '塔什干国宴抓饭 Plov (Osh)',
          wrapperOrBase: 'Devzira 红米',
          fillingOrProtein: '羊肉、马肉肠、鹰嘴豆、鹌鹑蛋',
          soulDipOrSauce: 'Achichuk 薄切番茄洋葱沙拉',
          cookingShift: '羊尾油重油熬底（Zirvak）+ 慢焖',
        },
      },
      {
        nodeId: 'ge-tbilisi',
        transitionNote: '翻越高加索山脉进入黑海温润带：孜然羊油骤减，核桃泥、蓝胡芦巴与大量新鲜龙蒿、香菜、酸李子酱登场',
        representativeDishMorph: {
          dishName: '格鲁吉亚酸梅核桃炖肉 Chakapuli / Khinkali',
          wrapperOrBase: '炉烤船形芝士饼 / 厚皮大汤包',
          fillingOrProtein: '羔羊肉 / 牛肉',
          soulDipOrSauce: 'Tkemali 酸野李子酱、龙蒿草、核桃蒜泥',
          cookingShift: '白葡萄酒与海量鲜香草慢焖',
        },
      },
      {
        nodeId: 'lb-beirut',
        transitionNote: '抵达东地中海黎凡特海岸：米饭退为黄油细面配角，主角变成炭烤肉串与柠檬汁、橄榄油、欧芹构成的清爽前菜矩阵',
        representativeDishMorph: {
          dishName: '黎巴嫩炭烤拼盘 Mashawi + Tabbouleh',
          wrapperOrBase: '细面黄油米饭 / 皮塔薄饼',
          fillingOrProtein: '炭烤羊肉串 Kafta、柠檬蒜香鸡',
          soulDipOrSauce: 'Toum 乳化蒜霜、Tahini 芝麻柠檬酱',
          cookingShift: '果木炭火明烤 + 柠檬橄榄油冷拌',
        },
      },
      {
        nodeId: 'ma-marrakech',
        transitionNote: '北非大西洋与撒哈拉交界：锥形陶锅 Tagine 用微火蒸汽循环慢焖，盐渍柠檬与杏干、藏红花交织出独特的咸酸果甜香',
        representativeDishMorph: {
          dishName: '马拉喀什塔吉锅 Tagine 配古斯米',
          wrapperOrBase: '手搓蒸粗麦粉 Couscous',
          fillingOrProtein: '慢炖羊肉 / 鸡肉、杏干、扁桃仁',
          soulDipOrSauce: '盐渍发酵柠檬、藏红花、Harissa 玫瑰辣酱',
          cookingShift: '锥形陶锅少水微火蒸汽循环慢焖',
        },
      },
    ],
  },
  {
    id: 'maritime-nanyang',
    title: { zh: '下南洋侨乡—香料群岛走廊', en: 'Maritime Nanyang & Archipelago Corridor' },
    subtitle: '从闽南沙茶、梅州客家到槟城娘惹与巴东仁当（4 站）',
    themeColor: '#34D399',
    gradientColors: ['#38BDF8', '#10B981', '#F59E0B'],
    scientificDriver:
      '顺海上丝绸之路季风航线双向流动：福建/广东移民带去酱油、豆酱、猪肉与米粉炒制技法，在赤道群岛与马来/印尼的香茅、南姜、石栗、椰浆深度融合，演化出层次极丰的娘惹与巴东菜系',
    morphingConceptName: '当中国酱油猛火遇上赤道椰浆与香茅',
    stops: [
      {
        nodeId: 'cn-minnan',
        transitionNote: '刺桐古港与厦门湾：海鲜清甜本味中已埋下南洋伏笔——花生碎、虾米与南姜熬成的沙茶酱成为汤头灵魂',
        representativeDishMorph: {
          dishName: '闽南沙茶面',
          wrapperOrBase: '油面（碱水黄面）',
          fillingOrProtein: '鲜鱿鱼、猪肝沿、豆腐泡',
          soulDipOrSauce: '花生虾米沙茶酱、蒜泥醋',
          cookingShift: '猪骨海鲜汤冲调沙茶高汤快烫',
        },
      },
      {
        nodeId: 'ph-manila',
        transitionNote: '跨过吕宋海峡：中式酱油与大蒜保留，但热带气候引入大量甘蔗醋与四季橘（Calamansi），形成极酸咸开胃的慢炖体系',
        representativeDishMorph: {
          dishName: '菲律宾国菜 Adobo / Pancit 炒米粉',
          wrapperOrBase: '大米饭 / 福建式米粉 Pancit',
          fillingOrProtein: '五花肉 / 鸡腿肉',
          soulDipOrSauce: '酱油、甘蔗米醋、整粒黑胡椒、月桂叶、四季橘',
          cookingShift: '醋与酱油先炖后收汁煎香',
        },
      },
      {
        nodeId: 'my-penang-nyonya',
        transitionNote: '马六甲海峡中西交汇点：华人猛火炒制与猪骨汤底，正面撞上马来香茅、叻沙叶、虾膏（Belacan）与酸角（亚参）',
        representativeDishMorph: {
          dishName: '槟城亚参叻沙 Asam Laksa / 炒粿条',
          wrapperOrBase: '粗赖粉 / 猛火猪油炒粿条',
          fillingOrProtein: '拆骨鲭鱼肉、鲜虾',
          soulDipOrSauce: '烤虾膏 Belacan、罗望子酸汁、火炬姜花、薄荷',
          cookingShift: '石臼舂香料糊 (Rempah) + 酸辣鱼汤熬煮',
        },
      },
      {
        nodeId: 'id-padang',
        transitionNote: '深入赤道苏门答腊：汤水被彻底收干！浓椰浆与十几种鲜/干香料经过数小时慢火熬炼，直到底油析出、焦香裹满牛肉',
        representativeDishMorph: {
          dishName: '巴东仁当牛肉 Rendang',
          wrapperOrBase: '热白饭 + 木薯叶',
          fillingOrProtein: '牛腱肉块',
          soulDipOrSauce: '浓缩焦化椰浆、香茅、柠檬叶、南姜、青红辣椒酱 Sambal',
          cookingShift: '椰浆从煮沸到油水分离的 4 小时干焖焦化',
        },
      },
    ],
  },
  {
    id: 'coastal-umami-ring',
    title: { zh: '跨洋海岸线：本味海鲜与柑橘生腌共鸣带', en: 'Trans-Oceanic Coastal Umami & Citrus Cure Ring' },
    subtitle: '相隔万里却在「风味空间」紧挨着的五个海岸（5 站）',
    themeColor: '#38BDF8',
    gradientColors: ['#60A5FA', '#2DD4BF', '#34D399'],
    scientificDriver:
      '验证计算美食学的核心洞见：即使地理上跨越欧亚与南美，只要同处富饶海岸线且崇尚“刚出水海产 + 瞬时控温/果酸冷熟成”，它们在 10 维风味空间中就会聚在同一象限，成为中国沿海胃出国最稳的跨洋知己',
    morphingConceptName: '一条鲜鱼在五大海岸的极致本味表达',
    stops: [
      {
        nodeId: 'jp-kansai',
        transitionNote: '濑户内海与大阪湾：极致克制，只用昆布熟成与刀工释放鱼肉肌苷酸，一点酱油与山葵提味',
        representativeDishMorph: {
          dishName: '关西昆布缔刺身 / 鲷鱼高汤茶泡饭',
          wrapperOrBase: '醋饭 / 昆布柴鱼清高汤',
          fillingOrProtein: '真鲷 / 比目鱼薄造',
          soulDipOrSauce: '淡口酱油、现磨山葵、柑橘醋 Ponzu',
          cookingShift: '零热源冷熟成 / 沸水霜降',
        },
      },
      {
        nodeId: 'cn-chaoshan',
        transitionNote: '南海韩江口：在极致生鲜之上，大胆引入鱼露、酱油、蒜头、芫荽与小米辣，用高渗透压冷腌出果冻般的鲜甜口感',
        representativeDishMorph: {
          dishName: '潮汕生腌血蚶 / 鱼饭',
          wrapperOrBase: '白粥（糜）',
          fillingOrProtein: '鲜活膏蟹、虾蛄、巴浪鱼',
          soulDipOrSauce: '芫荽蒜头辣椒豉油卤、普宁豆酱',
          cookingShift: '浓盐水蒸熟冷食（鱼饭）/ 豉油生腌',
        },
      },
      {
        nodeId: 'es-basque',
        transitionNote: '比斯开湾圣塞巴斯蒂安：不靠复杂酱汁，用果木明火炭架（Parrilla）锁住整条比目鱼的胶质，泼上蒜片辣椒苹果醋热油',
        representativeDishMorph: {
          dishName: '巴斯克炭烤比目鱼 Rodaballo / 鳕鱼下巴 Kokotxas',
          wrapperOrBase: '炭火脆皮鱼皮自身胶质乳化汁',
          fillingOrProtein: '野生大菱鲆 / 银鳕鱼',
          soulDipOrSauce: '初榨橄榄油、蒜片、苹果醋、Guindilla 酸辣椒',
          cookingShift: '果木炭烤 + 低温晃锅胶质乳化（Pil-pil）',
        },
      },
      {
        nodeId: 'it-south',
        transitionNote: '第勒尼安海与西西里：阳光下的阿马尔菲柠檬、初榨橄榄油、海盐与牛至叶，直接浇在生切红虾与海鲈鱼上',
        representativeDishMorph: {
          dishName: '西西里生红虾 Crudo di Gamberi / 疯水煮鱼 Acqua Pazza',
          wrapperOrBase: '海水番茄清汤 / 手工意面',
          fillingOrProtein: '马扎拉生红虾、海鲈鱼',
          soulDipOrSauce: '柠檬汁、小番茄、刺山柑（Capers）、欧芹橄榄油',
          cookingShift: '柠檬橄榄油生拌 / 蒜片小番茄少水快焖',
        },
      },
      {
        nodeId: 'pe-lima-coastal',
        transitionNote: '南美太平洋寒流海岸：五百年前的印加传统融合日本侨民刀工，用极酸青柠汁在 3 分钟内让生鱼片表面蛋白冷变性，鲜酸直击灵魂',
        representativeDishMorph: {
          dishName: '利马经典酸橘汁腌生鱼 Ceviche Clásico',
          wrapperOrBase: '冰镇大粒白玉米 Choclo + 甜红薯块',
          fillingOrProtein: '太平洋白身海鱼现切方丁',
          soulDipOrSauce: 'Leche de Tigre（虎奶：青柠汁+鱼高汤+黄辣椒 Ají limo+红洋葱+香菜）',
          cookingShift: '高酸青柠汁 2 分钟瞬时冷腌（生脆与嫩滑并存）',
        },
      },
    ],
  },
];
