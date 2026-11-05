# FlavorGradient 🍜→🌶️→🍛

**全球饮食渐变星图 · 本味罗盘**

🌐 在线体验：<https://nowhereman-in-galaxy.github.io/flavor-gradient/>（push 到 `main` 后由 GitHub Actions 自动发布）

![演示](docs/screenshots/demo.gif)

出国站在餐厅门口不知道点什么？FlavorGradient 把世界各地的菜系放进同一个风味坐标系里，告诉你：

- 🧭 **这个地方的菜跟你熟悉的哪种家乡菜像**（潮汕胃去秘鲁该点 Ceviche）
- 🌈 **食物如何跨国界渐变**（西藏藏包 → 尼泊尔 Momo → 北印度 Samosa；广西酸笋粉 → 越南 Phở）
- 🍽️ **该点什么、该躲什么**，以及菜单上看到哪些词就能放心点

## 和别的美食项目有什么不一样

西方的计算美食学看**分子和调料**；中国人看菜，先看**本味**和**火候/做法**。所以我们用一个中西合璧的 10 维风味向量：

> 本味 · 镬气焦香 · 发酵鲜 · 明亮酸 · 生鲜草本 · 干香料 · 辣/麻 · 油脂醇厚 · 回甘 · 清爽质构

外加 6 类烹饪方式权重（蒸灼 / 猛火炒 / 生腌冷拌 / 炭烤 / 慢炖 / 发酵腌渍）。

理论依据：袁枚《随园食单》的本味论 · Rozin 的风味法则 (1973) · Ahn et al. 风味网络 (2011) · Billing & Sherman 香料抗菌假说 (1998) · ISO 感官质构术语。详见 [docs/DATA_GUIDE.md](docs/DATA_GUIDE.md)。

## 功能

- **点菜罗盘**：搜国家、菜名或菜单上的词（中文 / 英文 / 当地文字都行，`Phở` 打成 `pho` 也能搜到），直接给出闭眼点、慎点、看到就点 / 就躲的词，以及“它像你熟悉的哪种中国菜”
- **风味地图**：21 个风味节点在世界地图上发光，越合你胃口的越大越亮；切换“我的胃口”预设，地图会重新排序
- **渐变走廊**：拖动滑块，看一碗粉 / 一个饺子 / 一锅饭怎样跨国界一站站变形
- **风味纹章**：每个地方的 10 维向量都会画成一枚独特的 SVG 纹章（访问 `#crests` 可以看全部纹章）

## 快速开始

```bash
npm install
npm run dev            # 本地开发
npm run validate:data  # 校验数据
npm test               # 单元测试
npm run verify:stage   # 数据校验 + 合理性抽查 + 测试 + 类型检查 + 构建
```

## 贡献一个节点（5 步）

1. **选地方、定 id**：按 `<国家码>-<地区>` 命名（如 `kr-jeolla`），在 `src/data/nodes/` 里找到对应大区文件（没有就新建一个，并在 `index.ts` 里汇总）。
2. **对照锚点打分**：照着 [docs/DATA_GUIDE.md](docs/DATA_GUIDE.md) 的锚点表填 10 维 `sensoryVector` 和 `methodWeights`，先找最近的锚点再微调，不要凭感觉。
3. **填旅行者指南和食材**：`safeOrderDishes` 至少 2 道、`cautionDishes` 至少 1 道、`menuKeyTerms` 至少 3 个，`whyMatchOrWarn` 用中国人熟悉的菜做参照；`ingredientProfile` 填主食和 3~8 种核心食材。
4. **连邻居、写来源**：`neighborIds` 至少连 1 个地理相邻或风味相近的节点；在 [docs/SOURCES.md](docs/SOURCES.md) 写 1~3 条真实存在的来源，没有就标 `editorial-estimate`，不要编造文献。
5. **跑校验、提 PR**：`npm run verify:stage` 全部通过后提 PR，附上节点详情抽屉的截图。

## 项目进度

见 [docs/ROADMAP.md](docs/ROADMAP.md)。给 AI agent 的开发指令见 [AGENTS.md](AGENTS.md)。

## 技术栈

Vite · React · TypeScript · Tailwind · d3-geo / d3-zoom · world-atlas（Natural Earth）· Vitest（无需任何 API Key，纯静态站）

## License

MIT
