# OPEN_QUESTIONS

> Agent 遇到需要人类决定的问题时追加到这里，然后继续做不受影响的部分。

- （空）

- **食材维度是否进入匹配算法？**（Stage 1 新增 `ingredientProfile`）目前只用于展示。可选方案：预设增加 `avoidCategories`（如 `['pork']`）做过滤/降权，或 `favorCategories`（如海鲜）做加分。需要人类决定是否做、做成过滤还是降权。
- **neighborIds 是否要求双向？** 目前允许单向（如 jp-kansai → cn-guangfu），地图连线阶段会去重。
