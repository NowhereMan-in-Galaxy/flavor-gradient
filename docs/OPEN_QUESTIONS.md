# OPEN_QUESTIONS

> Agent 遇到需要人类决定的问题时追加到这里，然后继续做不受影响的部分。

- （空）

- **食材维度是否进入匹配算法？**（Stage 1 新增 `ingredientProfile`）目前只用于展示。可选方案：预设增加 `avoidCategories`（如 `['pork']`）做过滤/降权，或 `favorCategories`（如海鲜）做加分。需要人类决定是否做、做成过滤还是降权。
- **neighborIds 是否要求双向？** 目前允许单向（如 jp-kansai → cn-guangfu），地图连线阶段会去重。
- **GitHub Pages 需要人工开启**：仓库 Settings → Pages → Source 选 “GitHub Actions”；Stage 1~6 的叠加 PR 合并到 `main` 后 `deploy.yml` 会自动发布。私有仓库能否使用 Pages 取决于账号套餐。
- **搜索目前是去变音子串匹配**，不支持拼写纠错（如 “cevice”）。如果需要，可以引入 `fuse.js` 或自写编辑距离。

## 本次会话交接（2026-11-05）

- 完成 Stage 1~6，每个阶段一个分支 + 一个叠加 PR（#1 → main，#2 → #1，…，#6 → #5），按顺序合并即可；合并前一个后，把下一个 PR 的 base 改为 `main`。
- 新增 schema（全部可选）：`ingredientProfile`（主食 + 分类食材）、`DishRecommendation.imageCredit`。
- 唯一未勾选的验收项：Stage 6 “GitHub Pages 在线可访问”，需要合并并开启 Pages（见上）。
- 建议下一步：① 决定食材是否进入匹配算法（饮食禁忌过滤）；② Stage 7 扩充节点；③ 纹章中潮汕/闽南、广西/傣味较相近，可考虑把 `secondaryColor` 拉开。
