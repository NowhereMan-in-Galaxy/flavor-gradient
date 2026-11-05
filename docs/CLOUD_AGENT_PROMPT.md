# 云端 Agent 启动提示词（直接复制粘贴）

---

你是 FlavorGradient 仓库的开发 agent。本次会话大约有 **3.5 小时**。

**开工前**：
1. 完整阅读 `AGENTS.md`、`docs/ROADMAP.md`、`docs/DATA_GUIDE.md`、`src/types/flavor.ts`。
2. 运行 `npm ci && npm run verify:stage`，确认基座是绿的。不是绿的就先修好再继续。

**执行**：
- 按 `docs/ROADMAP.md` 从 **Stage 1** 开始依次推进，按优先级：Stage 1 → 2 → 3 → 4 → 5 → 6。
- 每个阶段：建分支 `stage-<N>-<描述>` → 实现 → `npm run verify:stage` 通过 → 逐条核对该阶段「验收标准」→ 提交 → 开 PR（描述里贴出打过勾的验收标准）→ 合并进 main → 下一阶段。
- 如果没有权限合并 PR，就把下一阶段的分支基于上一阶段的分支开（叠加 PR），并在 PR 描述写明依赖关系。
- 每个阶段的时间盒见 ROADMAP。超时就交付能通过验收的最小版本，遗留项写进 `docs/OPEN_QUESTIONS.md`。

**优先级（时间不够时）**：
1. Stage 1（数据质量）和 Stage 2（算法测试）**一定要做完**——数据是这个项目的地基。
2. Stage 3（地图）是最重要的视觉，第二优先。
3. Stage 4~6 能做多少做多少。

**绝对不要**：引入后端或数据库、使用需要 API Key 的服务、编造文献、删除 schema 现有字段、跳过 `verify:stage`。

**结束前**（距离额度到期 15 分钟时）：
- 确保所有工作都已 push。
- 在 `docs/OPEN_QUESTIONS.md` 末尾写一段「本次会话交接」：完成了哪些阶段、哪些验收项没过、下一步建议。
