# dsh-session-search

DeepSeek Harness Web GUI 的**会话内全文搜索**客户端插件。

在会话标题栏加一个 🔍 按钮：搜索当前会话全部节点的文本，点结果直接滚动跳转并高亮。

![feature overview](https://img.shields.io/badge/dsh-client--plugin-web-3964fe)

## 功能

- **全文搜索**：用户消息 / AI 回复 / 工具调用（名称、参数、结果）/ 命令 / 压缩摘要 / 错误 / 重试
- **覆盖整个会话**：打开搜索时自动加载尚未拉取的历史分页（带进度提示），不再只搜当前已加载的窗口
- **多关键词 AND**：空格分隔多个词，全部命中才算匹配（如 `插件 搜索`）
- **类型过滤 chips**：全部 / 我 / AI / 工具 / 命令 / 错误 / 其他，带实时计数
- **键盘导航**：↑/↓ 选择结果，Enter 跳转，Esc 关闭
- **一键复制**：每条结果悬停出现「复制」，复制该节点完整文本
- **结果计数**：输入关键词后显示「N 条结果」
- **全命中高亮**：片段内该词的所有出现都标亮
- **跳转定位**：平滑滚动到目标消息 + 蓝色描边 1.6 秒

GUI 自带的侧栏搜索只匹配会话标题和工作区名，服务端全文搜索是默认关闭的 opt-in 能力；
本插件**纯浏览器侧实现**，不改任何服务端配置。

## 安装

从 GitHub 直接装进 web profile：

```powershell
pnpm --dir "$HOME\.dsh\profiles\web" add github:2275803244-cpu/dsh-session-search
```

在 `$HOME\.dsh\profiles\web\cordis.patch.yml` 追加（若文件是 `[]` 则整体替换）：

```yaml
- insert:
    - id: ui-session-search
      name: 'dsh-client-ui-session-search'
```

重启 `dsh web`，打开任意会话，标题栏出现 🔍 按钮。

## 开发

```powershell
# 本地安装（开发时改 lib/client.js 后需重启 dsh web 生效）
pnpm --dir "$HOME\.dsh\profiles\web" add D:\path\to\dsh-session-search
# 语法检查
node --check lib\client.js
```

## 卸载

```powershell
pnpm --dir "$HOME\.dsh\profiles\web" remove dsh-client-ui-session-search
# 删掉 cordis.patch.yml 的 ui-session-search 行，重启
```

## 实现要点

- 槽位：`conversation.session.header.actions`（order=30，与后台任务列表按钮同席）
- 数据：框架 session kit 的 `useSession` 读 `ConversationSnapshot.chat.order` + `chat.nodes`（稳定的按 key 读取器）
- 文本提取按节点 kind 分派（user/steering/context/assistant-step/tool-call/command/manual-compaction/compaction/turn-error/model-retry）
- 跳转锚点：chat view 每一行都带 `data-chat-anchor-key=<节点 key>`
- bundle 为手写 `window.__ModuleLoader__.load({ id, factory })` 格式，只依赖加载器静态提供的模块（react / react/jsx-runtime），无需构建

## 相关文档

- 槽位契约：`dsh-client-ui-conversation/lib/types/client/contract/slots.d.ts`
- 快照模型：`dsh-client-runtime/lib/types/client/sessions/conversation.d.ts`
- 渲染锚点：`dsh-client-ui-conversation/lib/client.js` 的 `ChatNodeSeat`（data-chat-anchor-key）

## License

MIT