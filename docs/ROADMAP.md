# ROADMAP — 分阶段任务与验收标准

> 规则：上一阶段的验收标准**全部**打勾，才能开始下一阶段。每阶段一个分支、一个 PR。
> 每个阶段末尾运行 `npm run verify:stage`，必须通过。
> 括号里的时间是给云端 agent 的建议时间盒（总计约 3.5 小时）。

---

## ✅ Stage 0 — 基座（已完成，由人工 + 本地 agent 搭建）

- [x] Vite + React + TS + Tailwind 工程可 `npm run dev`
- [x] `src/types/flavor.ts` 10 维向量 + 烹饪方式 schema
- [x] 4 个种子节点（潮汕、广西、越南北部、埃塞俄比亚高原）+ 1 条走廊 + 1 个口味预设
- [x] `scripts/validateData.ts` + GitHub Actions CI
- [x] 占位 UI：匹配度排行 + 节点详情条形图 + 走廊卡片

---

## Stage 1 — 种子数据扩充到 20 个节点（约 50 分钟）

**分支**：`stage-1-seed-data`

### 任务
1. 把 `src/data/nodes.ts` 拆成按大区分文件：`src/data/nodes/china.ts`、`southeast-asia.ts`、`south-asia.ts`、`west-central-asia.ts`、`africa.ts`、`europe.ts`、`americas.ts`、`east-asia.ts`，由 `src/data/nodes/index.ts` 汇总导出 `NODES`。
2. 新增节点，**总数 ≥ 20**，必须包含下面全部：
   - 中国：潮汕 ✅、广西 ✅、粤港（广府）、闽南、云南傣味（西双版纳/德宏）、四川、新疆、西藏
   - 东南亚：越南北部 ✅、泰国伊森、泰国中部、马来/槟城娘惹
   - 南亚：尼泊尔加德满都、北印度旁遮普
   - 西/中亚：乌兹别克斯坦、黎巴嫩
   - 非洲：埃塞俄比亚高原 ✅
   - 欧洲：意大利南部（那不勒斯/西西里）
   - 美洲：秘鲁沿海（利马）、墨西哥瓦哈卡
   - 东亚：日本关西
3. 每个节点所有字段都填满；`safeOrderDishes` ≥ 2、`cautionDishes` ≥ 1、`menuKeyTerms` ≥ 3。
4. 打分严格对照 `docs/DATA_GUIDE.md` 的**锚点表**，不要凭感觉。
5. 在 `docs/SOURCES.md` 为每个节点写 1~3 条参考来源（真实存在的书/论文/维基条目），或标注 `editorial-estimate`。
6. 把 `neighborIds` 按地理邻接 + 风味相似补齐，每个节点至少 1 个邻居（埃塞俄比亚可连黎巴嫩/北印度）。

### 验收标准
- [ ] `npm run validate:data` 输出 `≥ 20 个节点`，0 错误
- [ ] 把 `validateData.ts` 的规则升级：`safeOrderDishes ≥ 2`、`menuKeyTerms ≥ 3`、`neighborIds ≥ 1`
- [ ] **合理性抽查**（写成 `scripts/sanityCheck.ts` 并加入 `verify:stage`）：用默认预设“沿海本味 + 东南亚酸鲜胃”排序后
  - 前 5 名中至少 3 个来自 `china-coastal` / `southeast-asia` / 秘鲁沿海 / 日本关西
  - 埃塞俄比亚高原、黎巴嫩、北印度旁遮普**都在后 1/3**
  - 潮汕 ↔ 闽南 的 `nodeSimilarity` > 潮汕 ↔ 埃塞俄比亚 的相似度
  - 西藏 ↔ 尼泊尔 的相似度 > 西藏 ↔ 泰国中部
- [ ] `docs/SOURCES.md` 覆盖全部节点

---

## Stage 2 — 走廊 ×3、口味预设 ×4、算法测试（约 35 分钟）

**分支**：`stage-2-corridors-presets`

### 任务
1. 走廊补齐到 3 条（每条 ≥ 3 站，stop 的 nodeId 必须存在）：
   - `lingnan-indochina` 岭南—中南半岛酸鲜走廊 ✅（扩展：加入云南傣味、泰国伊森）
   - `himalaya-dough` 喜马拉雅面团走廊：西藏 → 尼泊尔 → 北印度旁遮普（变形载体：藏包 → Momo → Samosa/咖喱）
   - `silk-road-pilaf` 丝路抓饭走廊：新疆 → 乌兹别克斯坦 → 黎巴嫩（变形载体：抓饭 → Plov → 中东米饭/Kebab）
2. 口味预设 ≥ 4 个：`沿海本味+东南亚酸鲜` ✅、`川湘重辣`、`西北面食+烤肉`、`清淡日料系`。
3. 引入 `vitest`，为 `src/lib/scoring.ts` 写单元测试：
   - 完全相同向量 → 100
   - 完全相反（0 vs 10）→ 0
   - 权重为 0 的维度不影响结果
   - `rankNodes` 输出降序
4. 加入 `npm test`，并让 `verify:stage` 包含 `npm test`；CI 也跑测试。

### 验收标准
- [ ] `validate:data` 显示 3 条走廊 / ≥ 4 个预设
- [ ] `npm test` 全绿，scoring 覆盖率 ≥ 90%
- [ ] 切换到“川湘重辣”预设时，四川排第 1 或第 2（写进 sanityCheck）
- [ ] 切换到“西北面食+烤肉”预设时，新疆/乌兹别克斯坦进前 3（写进 sanityCheck）

---

## Stage 3 — 风味地图（主界面）（约 60 分钟）

**分支**：`stage-3-flavor-map`

### 任务
1. 安装 `topojson-client` + `world-atlas`（110m 精度即可），用 `d3-geo` 的 `geoNaturalEarth1` 投影画暗色世界底图（SVG）。
2. 写 `src/lib/color.ts`：向量 → 颜色。规则：
   - 主色由「本味+酸+草本」(青绿系) vs 「干香料+油脂」(琥珀系) vs 「发酵鲜」(海蓝系) 三者混合
   - 输出 `#RRGGBB`，并在数据校验中允许 `primaryColor` 为空时自动计算
3. 每个节点画成发光圆点（SVG `radialGradient` + `feGaussianBlur` 光晕），半径按与当前预设的匹配度缩放（匹配越高越大越亮）。
4. 邻居之间画渐变连线（线的两端分别是两个节点的颜色）。
5. 交互：
   - 悬停：tooltip 显示中文名、匹配度、风味和弦
   - 点击：右侧抽屉打开节点详情（复用 Stage 0 的条形图）
   - 滚轮/双指缩放 + 拖拽平移（`d3-zoom`）
6. 顶部「我的胃口」下拉框切换预设，地图实时重新着色/缩放。
7. 组件拆分：`components/WorldMap.tsx`、`components/NodeDot.tsx`、`components/NodeDrawer.tsx`、`components/PresetSwitcher.tsx`。

### 验收标准
- [ ] 打开首页即看到世界地图 + ≥ 20 个发光节点
- [ ] 切换预设后 300ms 内完成重绘，无报错
- [ ] 390px 宽手机视图：地图可拖拽缩放，抽屉变为底部弹出
- [ ] Lighthouse Performance ≥ 85（PR 中附截图）
- [ ] 不依赖任何 API Key、离线（打包后）可用

---

## Stage 4 — 走廊渐变滑块（约 40 分钟）

**分支**：`stage-4-corridor-slider`

### 任务
1. `components/CorridorPanel.tsx`：选择一条走廊后，地图上高亮走廊路径（其余节点降低透明度至 0.25）。
2. 一个横向滑块，从第一站拖到最后一站；位于两站之间时：
   - 10 维条形图对两站向量做**线性插值**并动画过渡
   - 显示 `representativeDishMorph` 的四个字段（皮/馅/灵魂蘸料/做法），在临界点切换并带淡入淡出
   - 显示 `transitionNote`
3. 地图上有一个沿走廊移动的小光标与滑块同步。

### 验收标准
- [ ] 3 条走廊都能拖动，无跳变或 NaN
- [ ] 插值函数 `lerpVector` 有单元测试
- [ ] 键盘可操作（←/→ 切换站点），滑块有 `aria-label`

---

## Stage 5 — SVG 风味纹章 + 图片预留（约 30 分钟）

**分支**：`stage-5-flavor-crest`

### 任务
1. `components/FlavorCrest.tsx`：根据 10 维向量生成一个独特的 SVG 纹章（10 瓣极坐标花形 / 雷达多边形 + `svgGlyphType` 对应的中心图标），颜色用节点 primary/secondary。
2. 纹章出现在：节点抽屉头部、匹配排行列表、走廊站点卡片。
3. 图片预留：`<DishCard>` 组件——有 `imageUrl` 时显示图片 + 右下角小纹章；没有时显示全尺寸纹章。为 schema 增加可选字段 `imageCredit?: string`。
4. 7 种 `svgGlyphType` 都要有对应的中心图标（手写 SVG path，不引入图标库）。

### 验收标准
- [ ] 20 个节点生成的纹章肉眼可区分（PR 附一张 20 宫格截图）
- [ ] 同一向量多次渲染结果完全一致（纯函数，有快照测试）
- [ ] 给任意一道菜填一个 Wikimedia 图片 URL，`DishCard` 正确显示图片与 credit

---

## Stage 6 — 点菜罗盘 + 部署（约 30 分钟）

**分支**：`stage-6-menu-compass-deploy`

### 任务
1. `components/MenuCompass.tsx`：输入框支持搜索国家/菜系/菜单关键词（中/英/当地文字），返回：
   - 「闭眼点」：该节点 `safeOrderDishes` + 匹配理由
   - 「慎点」：`cautionDishes` + 原因
   - 「看到这些词就点 / 就躲」：`menuKeyTerms`
   - 「它像你熟悉的…」：与该节点最相似的中国节点（用 `nodeSimilarity`）
2. 搜索是纯前端模糊匹配（自己写或用 `fuse.js`）。
3. GitHub Actions 增加 Pages 部署工作流（`actions/deploy-pages`），push 到 main 自动发布。
4. README 加上线地址、截图 GIF、如何贡献一个新节点。

### 验收标准
- [ ] 搜 “Ceviche”、“秘鲁”、“Lima” 都能命中秘鲁沿海
- [ ] 搜 “Wot” 命中埃塞俄比亚且显示为「慎点」
- [ ] GitHub Pages 在线可访问，首页加载 < 3s（4G 模拟）
- [ ] README 中有“贡献一个节点”的 5 步说明

---

## Stage 7+（之后，人工决定是否开工）

- 全球撒网：扩充到 80+ 节点，按 `regionGroup` 分批 PR
- 用户自定义口味：拖动 10 个滑块生成自己的预设，存 localStorage，可分享 URL
- 照片：为每个节点接入 1 张授权图片
- 多语言：英文 UI
- 社区贡献：Issue 模板「我吃过这个地方的菜」
