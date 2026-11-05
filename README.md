# FlavorGradient 🍜→🌶️→🍛

**全球饮食渐变星图 · 本味罗盘**

出国站在餐厅门口不知道点什么？FlavorGradient 把世界各地的菜系放进同一个风味坐标系里，告诉你：

- 🧭 **这个地方的菜跟你熟悉的哪种家乡菜像**（潮汕胃去秘鲁该点 Ceviche）
- 🌈 **食物如何跨国界渐变**（西藏藏包 → 尼泊尔 Momo → 北印度 Samosa；广西酸笋粉 → 越南 Phở）
- 🍽️ **该点什么、该躲什么**，以及菜单上看到哪些词就能放心点

## 和别的美食项目有什么不一样

西方的计算美食学看**分子和调料**；中国人看菜，先看**本味**和**火候/做法**。所以我们用一个中西合璧的 10 维风味向量：

> 本味 · 镬气焦香 · 发酵鲜 · 明亮酸 · 生鲜草本 · 干香料 · 辣/麻 · 油脂醇厚 · 回甘 · 清爽质构

外加 6 类烹饪方式权重（蒸灼 / 猛火炒 / 生腌冷拌 / 炭烤 / 慢炖 / 发酵腌渍）。

理论依据：袁枚《随园食单》的本味论 · Rozin 的风味法则 (1973) · Ahn et al. 风味网络 (2011) · Billing & Sherman 香料抗菌假说 (1998) · ISO 感官质构术语。详见 [docs/DATA_GUIDE.md](docs/DATA_GUIDE.md)。

## 快速开始

```bash
npm install
npm run dev            # 本地开发
npm run validate:data  # 校验数据
npm run verify:stage   # 校验 + 类型检查 + 构建
```

## 项目进度

见 [docs/ROADMAP.md](docs/ROADMAP.md)。给 AI agent 的开发指令见 [AGENTS.md](AGENTS.md)。

## 技术栈

Vite · React · TypeScript · Tailwind · d3-geo（无需任何 API Key，纯静态站）

## License

MIT
