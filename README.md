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

本插件同时支持 **CLI / Web 版**（`web` profile）与 **桌面版**（`desktop` profile）。

推荐用 DSH 自带 CLI 安装：`dsh plugin add` 会把依赖**和** `dsh.profile.bundles` 一起写进该 profile 的 `package.json`，**不需要**再手工改 `cordis.patch.yml`。

```powershell
# CLI / Web 版
dsh plugin --profile web add github:2275803244-cpu/dsh-session-search

# 桌面版（桌面应用自带 CLI，位于 <安装目录>\resources\runtime\cli\bin\dsh.cmd）
& "<桌面版安装目录>\resources\runtime\cli\bin\dsh.cmd" plugin --profile desktop add github:2275803244-cpu/dsh-session-search
```

装完重启对应程序（**bundle rev 在启动时哈希进 boot 图，改了必须重启**）。

<details>
<summary>手工安装（旧方式，仅 web profile）</summary>

```powershell
pnpm --dir "$HOME\.dsh\profiles\web" add D:\deepseekherness\session-search-plugin
```

`cordis.patch.yml` 需包含：

```yaml
- insert:
    - id: ui-session-search
      name: 'dsh-client-ui-session-search'
```

重启 `dsh web`。

</details>

## 0.1.2 更新（桌面版支持）

DSH 桌面版（`@deepseek-ai/dsh-desktop-runtime` **0.2.0-rc.2**）启用了独立的 `desktop` profile，插件默认不在其中。本版本确认插件在桌面版下**无需改动代码**即可工作（纯浏览器侧 bundle，只依赖 `react` / `react/jsx-runtime`，不耦合 DSH 内部包）：

| 核对项 | 桌面版 0.2.0-rc.2 实测结果 |
| --- | --- |
| 槽位 `conversation.session.header.actions` | ✅ 仍由 `dsh-client-ui-conversation` 渲染 |
| 服务 `sessions`（`ctx.get("sessions")`） | ✅ 仍在提供 |
| `sessions.binding(sessionId)` | ✅ 签名一致（`binding(id: SessionId): SessionBinding`） |
| 数据面 `useSession` + `ConversationSnapshot.chat` | ✅ 仍在框架 session kit 中 |
| 组合树 | ✅ 装入 `desktop` profile 后可见 `ui-session-search` 行，无报错 |

> 校验方式：桌面版核心代码打包在 `app.asar` 内，直接解包比对运行时实际代码；`desktop` profile 只能由桌面应用启动，组合树校验用一份副本 profile 跑 `--dump-config`。

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
