# AGENTS.md — 给云端 / 本地 Coding Agent 的执行指令

> 你正在开发 **FlavorGradient**：全球饮食渐变星图 + 本味罗盘。
> 读完本文件、[docs/ROADMAP.md](docs/ROADMAP.md)、[docs/DATA_GUIDE.md](docs/DATA_GUIDE.md) 再动手。

## 0. 一句话目标

让一个中国胃的旅行者在国外餐厅门口，30 秒内知道：**这个地方的菜是怎么做的、跟我熟悉的哪种家乡菜像、该点什么、别点什么**；同时可以在地图上看到食物如何跨国界渐变。

## 1. 工作方式（必须遵守）

1. **按阶段推进**：严格按 `docs/ROADMAP.md` 的 Stage 顺序。当前阶段的「验收标准」全部打勾之前，不开始下一阶段。
2. **每个阶段一个分支 + 一个 PR**：分支名 `stage-<N>-<短描述>`，例如 `stage-1-seed-data`。PR 描述里逐条贴出验收标准并打勾，附截图（UI 阶段）。
3. **每次提交前运行**：
   ```bash
   npm run verify:stage   # = validate:data + tsc + vite build，必须全部通过
   ```
4. **小步提交**：一次提交只做一件事，信息用 `feat: / data: / fix: / docs: / chore:` 前缀。
5. **不确定就写进 `docs/OPEN_QUESTIONS.md`**，继续做不受影响的部分，不要停下来空等。
6. **时间盒**：如果一个阶段卡住超过 40 分钟，先交付能通过验收的最小版本，把遗留项写进 `docs/OPEN_QUESTIONS.md`。

## 2. 不可违背的约束

- **纯前端静态站**：不加后端、不加数据库、不需要任何 API Key。最终能部署到 GitHub Pages。
- **不引入付费 / 需注册的地图服务**（不要 Mapbox / Google Maps）。地图用 `d3-geo` + 开源 world-atlas TopoJSON（Natural Earth，公有领域）。
- **类型是唯一真相**：`src/types/flavor.ts` 是数据契约。要改 schema，必须同时改：类型、`scripts/validateData.ts`、`docs/DATA_GUIDE.md`、所有现有数据。
- **不要删除现有字段**；新增字段优先设为可选（`?`），避免一次性改爆所有数据。
- **图片**：现阶段只用 SVG。`coverImageUrl` / `imageUrl` 字段保留但留空。以后接图片时，只允许 Wikimedia Commons / Unsplash 等许可明确的来源，并在数据里记录 `imageCredit`。
- **不编造文献**：数据里的 `sources` 只能写真实存在的书/论文/网站；不确定就写 `"editorial-estimate"`。
- **中文优先**：UI 文案默认中文，菜名保留当地语言原文 + 中文。

## 3. 核心设计理念（写代码前必须理解）

本项目和西方 computational gastronomy 的区别：**中国人看菜，先看“本味”和“火候/做法”，再看调料。** 所以向量有 10 维：

| 维度 | 含义 | 来源 |
|---|---|---|
| `naturalBenwei` 本味 | 吃的是食材本身还是调料 | 中国烹饪“本味论” |
| `wokHeiThermal` 镬气焦香 | 高温瞬时美拉德 | 中国火候体系 |
| `umamiFerment` 发酵鲜 | 鱼露/酱油/虾酱/菌菇 | Rozin 风味法则 |
| `brightAcid` 明亮酸 | 青柠/醋/酸笋 | Rozin |
| `freshHerbal` 生鲜草本 | 葱姜/香菜/薄荷/香茅 | Rozin |
| `warmDrySpice` 干香料 | 孜然/豆蔻/Berbere | Billing & Sherman 1998 |
| `capsaicinHeat` 辣/麻 | 辣椒/花椒/胡椒 | — |
| `lipidRichness` 油脂醇厚 | 黄油/椰浆/芝麻酱 | 感官科学 |
| `sweetHarmony` 回甘 | 提鲜糖/椰糖/焦糖化 | — |
| `crispTexture` 清爽质构 | 生脆分明 ↔ 糊状浓稠 | ISO 质构/流变学 |

另有 `cookingProfile`（6 类烹饪方式权重 + 主导传热介质）专门回答“这菜是怎么做的”。

匹配算法在 `src/lib/scoring.ts`：**加权欧氏距离**（不是余弦——余弦会把“全都淡”和“全都重”判成相似）。

## 4. 目录约定

```
src/
  types/flavor.ts        # 数据契约（唯一真相）
  data/nodes.ts          # 风味节点（Stage 1 后可拆分为 data/nodes/<region>.ts）
  data/corridors.ts      # 渐变走廊
  data/presets.ts        # 口味预设
  lib/scoring.ts         # 匹配/相似度算法（纯函数，必须有单元测试 — Stage 2 起）
  lib/color.ts           # 向量 → 颜色（Stage 3）
  components/            # UI 组件（Stage 3 起）
scripts/validateData.ts  # 数据校验，CI 会跑
docs/                    # ROADMAP / DATA_GUIDE / OPEN_QUESTIONS / SOURCES
```

## 5. 完成的定义（Definition of Done，每个 PR 都适用）

- [ ] `npm run verify:stage` 通过
- [ ] CI 绿
- [ ] 没有 `any`、没有被注释掉的大段代码、没有 `console.log` 残留（脚本除外）
- [ ] 新增数据通过 `validate:data`，且在 `docs/SOURCES.md` 留了来源或标注 `editorial-estimate`
- [ ] UI 改动：PR 附桌面 + 手机宽度（390px）截图
- [ ] 更新 `docs/ROADMAP.md` 中对应阶段的勾选状态
