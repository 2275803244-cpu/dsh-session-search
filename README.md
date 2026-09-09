# dsh-client-ui-session-search

会话内全文搜索插件：会话标题栏 🔍 按钮，搜索当前会话全部节点的文本，点结果直接滚动跳转并高亮。

## 功能

- **全文搜索**：用户消息 / AI 回复 / 工具调用（名称、参数、结果）/ 命令 / 压缩摘要 / 错误 / 重试
- **多关键词 AND**：空格分隔多个词，全部命中才算匹配（如 `插件 搜索`）
- **类型过滤 chips**：全部 / 我 / AI / 工具 / 命令 / 错误 / 其他，带实时计数
- **键盘导航**：↑/↓ 选择结果，Enter 跳转，Esc 关闭
- **一键复制**：每条结果悬停出现「复制」，复制该节点完整文本
- **结果计数**：显示「N 条结果」
- **全命中高亮**：片段内该词的所有出现都标亮
- **跳转定位**：平滑滚动到目标消息 + 蓝色描边 1.6 秒

## 实现要点

- 槽位：`conversation.session.header.actions`（order=30，与后台任务列表同席）
- 数据：框架 session kit 的 `useSession` 读 `ConversationSnapshot.chat.order` + `chat.nodes`
- 文本提取按节点 kind 分派（user/assistant-step/tool-call/command/compaction/turn-error/model-retry…）
- 跳转锚点：chat view 每行带 `data-chat-anchor-key=<节点 key>`
- 纯浏览器侧，不依赖服务端全文搜索（默认关闭的 opt-in 能力）

## 安装 / 更新

```powershell
pnpm --dir "$HOME\.dsh\profiles\web" add D:\deepseekherness\session-search-plugin
```

`cordis.patch.yml` 需包含（已配好）：

```yaml
- insert:
    - id: ui-session-search
      name: 'dsh-client-ui-session-search'
```

**每次修改 `lib/client.js` 后需要重启 `dsh web` 才生效**（bundle rev 在启动时哈希进 boot 图）。

## 卸载

```powershell
pnpm --dir "$HOME\.dsh\profiles\web" remove dsh-client-ui-session-search
# 删掉 cordis.patch.yml 的 ui-session-search 行，重启
```

## 贡献

欢迎提交 PR！请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

- 本仓库目前没有自动化测试，欢迎补充（可参考 `dsh-model-switcher` 的 `test/client.test.cjs`）
- 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/)

## 参考

- 槽位契约：`dsh-client-ui-conversation/lib/types/client/contract/slots.d.ts`
- 快照模型：`dsh-client-runtime/lib/types/client/sessions/conversation.d.ts`
- 渲染锚点：`dsh-client-ui-conversation/lib/client.js` 的 `ChatNodeSeat`（data-chat-anchor-key）
