# DATA_GUIDE — 怎样给一个地方打分

> 目标：不同人 / 不同 agent 打出来的分数**可比较**。所以每一维都有锚点。打分前先找到最近的锚点，再上下微调。
> 所有分数都是 0~10 的整数（允许 .5）。这些是**编辑性估计**，不是实验测量——在 `docs/SOURCES.md` 里如实标注。

## 10 维锚点表

| 维度 | 0~2 | 4~6 | 8~10 |
|---|---|---|---|
| `naturalBenwei` 本味 | 埃塞 Wot、北印咖喱（调料完全重塑） | 川菜家常、墨西哥 mole 之外的日常菜 | 潮汕白灼、日本刺身、粤式清蒸鱼 |
| `wokHeiThermal` 镬气焦香 | 刺身、Ceviche、清汤 | 越南炭烤、意大利披萨窑烤 | 广府干炒牛河、新疆烤肉、潮汕生啫 |
| `umamiFerment` 发酵鲜 | 北欧水煮、西藏清炖 | 意大利（帕玛森/番茄）、黎巴嫩 | 泰国（鱼露+虾酱）、日本（味噌+柴鱼）、潮汕 |
| `brightAcid` 明亮酸 | 新疆抓饭、西藏 | 意大利（番茄）、北印度（酸奶/番茄） | 秘鲁 Ceviche、泰伊森、广西酸笋 |
| `freshHerbal` 生鲜草本 | 新疆、北印咖喱主菜、埃塞 | 黎巴嫩（欧芹沙拉有，主菜少）、四川 | 越南、泰国、老挝 |
| `warmDrySpice` 干香料 | 日本、潮汕、秘鲁沿海 | 四川（八角/花椒）、墨西哥 | 北印度、埃塞俄比亚、摩洛哥 |
| `capsaicinHeat` 辣/麻 | 日本、潮汕、意大利 | 越南、墨西哥中辣、新疆 | 四川、泰伊森、湖南 |
| `lipidRichness` 油脂醇厚 | 日本、越南清汤 | 广府、意大利 | 北印度（Ghee/奶油）、娘惹（椰浆）、黎巴嫩（Tahini） |
| `sweetHarmony` 回甘 | 埃塞、伊森 | 广府、泰国中部 | 苏帮菜、娘惹、日本关西照烧 |
| `crispTexture` 清爽质构 | Hummus、Wot、浓咖喱、Dal | 意大利面、墨西哥 taco | 潮汕白灼、越南生卷、Ceviche、刺身 |

## 烹饪方式权重 `methodWeights`（0~10）

回答：**在这个地方的一桌日常菜里，这种做法有多常见？**
- 10 = 几乎每顿都有；5 = 常见但不主导；0 = 基本不用
- `primaryThermalMedium` 选权重最高、最能代表当地哲学的那一个

## 其他字段规则

- `id`：`<ISO 3166 两位小写国家码>-<地区英文小写连字符>`，如 `th-isaan`、`pe-lima-coastal`
- `coordinates`：`[经度, 纬度]`，取代表城市
- `climate.climateReason`：一句话，说清气候/海拔如何塑造饮食（可引用 Billing & Sherman 1998 的温度-香料关系）
- `flavorPrinciple`：遵循 Rozin 的“风味和弦”——2~4 个最常反复出现的调味基底
- `pairingLogic`：
  - `contrast-Eastern` 东亚式反差搭配（Ahn et al. 2011）
  - `compound-sharing-Western` 西式同类香气叠加
  - `hybrid-bridge` 介于两者或明显融合
- `travelerGuide.safeOrderDishes[].whyMatchOrWarn`：用**中国人熟悉的参照**解释，例如“像不放酱油的白切鸡”、“像加了青柠的潮汕鱼生”
- `visuals.primaryColor`：Stage 3 之后可由 `lib/color.ts` 自动计算，手填仅作覆盖

## 参考文献（可在 SOURCES.md 中引用）

- Rozin, E. (1973). *The Flavor-Principle Cookbook*. Hawthorn Books. 再版为 *Ethnic Cuisine: The Flavor-Principle Cookbook* (1983)
- Ahn, Y.-Y., Ahnert, S. E., Bagrow, J. P., & Barabási, A.-L. (2011). Flavor network and the principles of food pairing. *Scientific Reports*, 1, 196.
- Billing, J., & Sherman, P. W. (1998). Antimicrobial functions of spices: why some like it hot. *The Quarterly Review of Biology*, 73(1), 3–49.
- 袁枚《随园食单》（“有味使之出，无味使之入”；本味与火候）
- ISO 5492:2008 Sensory analysis — Vocabulary（质构术语）
