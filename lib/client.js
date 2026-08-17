// dsh-client-ui-session-search — browser half.
// In-session full-text search over the current conversation's Chat node
// store, with kind filters, multi-term AND matching, keyboard navigation,
// copy-to-clipboard, and jump-to-message via data-chat-anchor-key anchors.
// Hand-written ModuleLoader bundle: requires only statically provided
// modules (react, react/jsx-runtime), so no build step is needed.
window.__ModuleLoader__.load({
	id: "dsh-client-ui-session-search",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		const { jsx, jsxs } = react_jsx_runtime;
		//#region dsh-client-ui-session-search/SessionSearch.module.css
		const css = "._ss_root{position:relative}._ss_trigger{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:8px;border:1px solid transparent;background:transparent;color:var(--dsw-alias-label-secondary,#4e5969);cursor:pointer}._ss_trigger:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.06))}._ss_panel{position:fixed;z-index:1000;width:min(440px,calc(100vw - 32px));max-height:min(520px,calc(100vh - 120px));display:flex;flex-direction:column;gap:6px;padding:8px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,#e5e6eb);border-radius:12px;background:var(--dsw-alias-bg-module-platform,#fff);box-shadow:0 8px 24px rgba(0,0,0,.12)}._ss_input{box-sizing:border-box;width:100%;padding:7px 10px;border:1px solid var(--dsw-alias-border-l2,#e5e6eb);border-radius:8px;background:var(--dsw-alias-bg-module-field,#f7f8fa);color:var(--dsw-alias-label-primary,#1f2329);font-size:13px;line-height:20px;outline:none}._ss_input:focus{border-color:var(--dsw-static-brand-blue-600,#3964fe)}._ss_chips{display:flex;flex-wrap:wrap;gap:4px;padding:0 2px}._ss_chip{font-size:12px;line-height:18px;padding:2px 9px;border-radius:999px;border:1px solid var(--dsw-alias-border-l2,#e5e6eb);background:transparent;color:var(--dsw-alias-label-secondary,#4e5969);cursor:pointer}._ss_chip:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.06))}._ss_chipActive{background:var(--dsw-static-brand-blue-600,#3964fe);border-color:var(--dsw-static-brand-blue-600,#3964fe);color:#fff}._ss_count{font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary,#86909c);padding:0 8px}._ss_list{list-style:none;margin:0;padding:0;overflow-y:auto;display:flex;flex-direction:column;gap:2px}._ss_row{position:relative;display:flex;flex-direction:column;gap:2px;padding:6px 44px 6px 8px;border-radius:8px;cursor:pointer}._ss_row:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.06))}._ss_selected{background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.08))}._ss_badge{font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary,#86909c)}._ss_snippet{color:var(--dsw-alias-label-primary,#1f2329);font-size:13px;line-height:20px;white-space:pre-wrap;word-break:break-word}._ss_mark{background:rgba(57,100,254,.18);color:inherit;border-radius:2px}._ss_copy{position:absolute;right:6px;top:6px;font-size:11px;line-height:16px;padding:1px 7px;border-radius:6px;border:1px solid var(--dsw-alias-border-l2,#e5e6eb);background:var(--dsw-alias-bg-module-field,#f7f8fa);color:var(--dsw-alias-label-secondary,#4e5969);cursor:pointer;opacity:0}._ss_row:hover ._ss_copy,._ss_selected ._ss_copy{opacity:1}._ss_copy:hover{color:var(--dsw-alias-label-primary,#1f2329)}._ss_empty{padding:12px 8px;font-size:13px;line-height:20px;color:var(--dsw-alias-label-tertiary,#86909c)}";
		const tagId = "dsh-client-ui-session-search/SessionSearch.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-client-ui-session-search";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var styles = {
			"root": "_ss_root",
			"trigger": "_ss_trigger",
			"panel": "_ss_panel",
			"input": "_ss_input",
			"chips": "_ss_chips",
			"chip": "_ss_chip",
			"chipActive": "_ss_chipActive",
			"count": "_ss_count",
			"list": "_ss_list",
			"row": "_ss_row",
			"selected": "_ss_selected",
			"badge": "_ss_badge",
			"snippet": "_ss_snippet",
			"mark": "_ss_mark",
			"copy": "_ss_copy",
			"empty": "_ss_empty"
		};
		//#endregion
		const CHIPS = [
			["all", "全部"],
			["user", "我"],
			["ai", "AI"],
			["tool", "工具"],
			["cmd", "命令"],
			["err", "错误"],
			["other", "其他"]
		];
		/** Concatenate the text of all text blocks in a ContentBlock[]/AssistantBlock[]. */
		function blocksText(blocks) {
			if (!Array.isArray(blocks)) return "";
			const parts = [];
			for (const block of blocks) {
				if (block && typeof block === "object" && block.type === "text" && typeof block.text === "string") parts.push(block.text);
			}
			return parts.join("\n");
		}
		/** Searchable text of one tool root (running call or settled result). */
		function toolText(root) {
			if (!root) return "";
			const parts = [];
			if (root.kind === "tool-result") {
				if (root.call && root.call.name) parts.push(root.call.name + (root.call.argsRaw ? " " + root.call.argsRaw : ""));
				const content = blocksText(root.content);
				if (content) parts.push(content);
			} else {
				if (root.name) parts.push(root.name + (root.argsRaw ? " " + root.argsRaw : ""));
			}
			return parts.join("\n");
		}
		/** Searchable text of one Chat view node, per registered node kind. */
		function nodeText(node) {
			const data = node.data;
			switch (node.kind) {
				case "user":
				case "steering":
				case "context":
					return blocksText(data.content);
				case "assistant-step": {
					let out = blocksText(data.blocks);
					if (data.finalNode) {
						const final = blocksText(data.finalNode.blocks);
						out = out ? out + "\n" + final : final;
					}
					return out;
				}
				case "tool-call":
					return toolText(data.root);
				case "command":
					return (data.name || "command") + (data.args ? " " + data.args : "");
				case "manual-compaction": {
					let out = "";
					if (data.command) out = (data.command.name || "command") + (data.command.args ? " " + data.command.args : "");
					if (data.compaction && data.compaction.summary) out = out ? out + "\n" + data.compaction.summary : data.compaction.summary;
					return out;
				}
				case "compaction":
					return data.summary || "";
				case "turn-error":
					return data.message || "";
				case "model-retry": {
					const parts = [];
					for (const attempt of data.attempts) {
						if (attempt && (attempt.message || attempt.code)) parts.push(attempt.message || attempt.code);
					}
					return parts.join("\n");
				}
				default:
					return "";
			}
		}
		/** Filter group of one node kind. */
		function kindGroup(kind) {
			switch (kind) {
				case "user":
				case "steering":
					return "user";
				case "assistant-step":
					return "ai";
				case "tool-call":
					return "tool";
				case "command":
				case "manual-compaction":
				case "compaction":
					return "cmd";
				case "turn-error":
				case "model-retry":
				case "turn-max-tokens":
					return "err";
				default:
					return "other";
			}
		}
		function cssEscape(value) {
			if (typeof CSS !== "undefined" && typeof CSS.escape === "function") return CSS.escape(value);
			return String(value).replace(/"/g, "\\\"");
		}
		function kindLabel(kind) {
			switch (kind) {
				case "user": return "我";
				case "assistant-step": return "AI";
				case "steering": return "转向";
				case "context": return "上下文";
				case "tool-call": return "工具";
				case "command": return "命令";
				case "manual-compaction": return "压缩";
				case "compaction": return "压缩";
				case "turn-error": return "错误";
				case "model-retry": return "重试";
				case "turn-max-tokens": return "截断";
				default: return "节点";
			}
		}
		/** Snippet around the first match with every occurrence of the term marked. */
		function highlightAll(text, term) {
			if (!term) return [text.slice(0, 160) + (text.length > 160 ? "…" : "")];
			const q = term.toLowerCase();
			const lower = text.toLowerCase();
			const first = lower.indexOf(q);
			if (first === -1) return [text.slice(0, 160) + (text.length > 160 ? "…" : "")];
			const start = Math.max(0, first - 40);
			const end = Math.min(text.length, first + q.length + 80);
			const windowText = text.slice(start, end);
			const wl = windowText.toLowerCase();
			const nodes = [];
			let from = 0;
			let pos;
			let count = 0;
			while ((pos = wl.indexOf(q, from)) !== -1 && count < 6) {
				if (pos > from) nodes.push(windowText.slice(from, pos));
				nodes.push(jsx("mark", { className: styles.mark, key: "m" + count, children: windowText.slice(pos, pos + q.length) }));
				from = pos + q.length;
				count++;
			}
			if (from < windowText.length) nodes.push(windowText.slice(from));
			if (start > 0) nodes.unshift("…");
			if (end < text.length) nodes.push("…");
			return nodes;
		}
		/**
		 * Session-header action: search trigger + fixed-position panel with kind
		 * filter chips, multi-term matching, keyboard navigation, copy, and jump.
		 */
		function SessionSearchAction({ useSession }) {
			// Defensive: the framework session kit is contractually present for
			// session-scope slots; render nothing if it is ever absent.
			if (!useSession) return null;
			const [open, setOpen] = react.useState(false);
			const [query, setQuery] = react.useState("");
			const [filter, setFilter] = react.useState("all");
			const [selected, setSelected] = react.useState(0);
			const [panelPos, setPanelPos] = react.useState(null);
			const triggerRef = react.useRef(null);
			const rootRef = react.useRef(null);
			const inputRef = react.useRef(null);
			const order = useSession((s) => s.chat.order);
			const store = useSession((s) => s.chat.nodes);
			const entries = react.useMemo(() => {
				const list = [];
				for (const key of order) {
					const node = store.get(key);
					if (!node || node.visibility !== "visible") continue;
					const text = nodeText(node);
					if (text) list.push({ key, kind: node.kind, text });
				}
				return list;
			}, [order, store]);
			const terms = react.useMemo(() => query.trim().toLowerCase().split(/\s+/).filter(Boolean), [query]);
			const queryHits = react.useMemo(() => {
				if (terms.length === 0) return entries;
				return entries.filter((entry) => terms.every((term) => entry.text.toLowerCase().indexOf(term) !== -1));
			}, [entries, terms]);
			const counts = react.useMemo(() => {
				const map = {};
				for (const entry of queryHits) {
					const group = kindGroup(entry.kind);
					map[group] = (map[group] || 0) + 1;
				}
				return map;
			}, [queryHits]);
			const results = react.useMemo(() => {
				if (filter === "all") return queryHits;
				return queryHits.filter((entry) => kindGroup(entry.kind) === filter);
			}, [queryHits, filter]);
			const sel = results.length === 0 ? -1 : Math.min(selected, results.length - 1);
			react.useEffect(() => {
				setSelected(0);
			}, [query, filter]);
			react.useEffect(() => {
				if (!open) return;
				const closeOutside = (event) => {
					if (event.target instanceof Node && !rootRef.current.contains(event.target)) setOpen(false);
				};
				document.addEventListener("pointerdown", closeOutside);
				return () => document.removeEventListener("pointerdown", closeOutside);
			}, [open]);
			react.useEffect(() => {
				if (open && inputRef.current) inputRef.current.focus();
			}, [open]);
			const openPanel = () => {
				const rect = triggerRef.current ? triggerRef.current.getBoundingClientRect() : null;
				setPanelPos(rect ? { top: rect.bottom + 6, right: Math.max(8, window.innerWidth - rect.right) } : { top: 56, right: 24 });
				setOpen(true);
			};
			const jump = (key) => {
				const Q = String.fromCharCode(34);
				let row = null;
				try {
					row = document.querySelector("[data-chat-anchor-key=" + Q + cssEscape(key) + Q + "]");
				} catch (e) { /* selector escape failure: skip jump */ }
				if (row) {
					row.scrollIntoView({ behavior: "smooth", block: "start" });
					const previous = row.style.outline;
					row.style.outline = "2px solid var(--dsw-static-brand-blue-600, #3964fe)";
					row.style.outlineOffset = "-2px";
					setTimeout(() => { row.style.outline = previous; }, 1600);
				}
				setOpen(false);
				setQuery("");
				setFilter("all");
				if (triggerRef.current) triggerRef.current.focus();
			};
			const copy = (text) => {
				if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
					navigator.clipboard.writeText(text).catch(() => {});
				}
			};
			const onInputKeyDown = (event) => {
				if (event.key === "Escape") {
					event.preventDefault();
					setOpen(false);
					if (triggerRef.current) triggerRef.current.focus();
				} else if (event.key === "ArrowDown") {
					event.preventDefault();
					if (results.length > 0) setSelected(sel < results.length - 1 ? sel + 1 : 0);
				} else if (event.key === "ArrowUp") {
					event.preventDefault();
					if (results.length > 0) setSelected(sel <= 0 ? results.length - 1 : sel - 1);
				} else if (event.key === "Enter") {
					event.preventDefault();
					if (sel >= 0) jump(results[sel].key);
				}
			};
			return jsxs("div", {
				ref: rootRef,
				className: styles.root,
				children: [
					jsx("button", {
						ref: triggerRef,
						type: "button",
						className: styles.trigger,
						"aria-label": "搜索当前会话",
						"aria-expanded": open,
						title: "搜索当前会话",
						onClick: openPanel,
						children: jsx("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", children: [
							jsx("circle", { cx: 7, cy: 7, r: 4.5, stroke: "currentColor", strokeWidth: 1.5 }),
							jsx("path", { d: "M10.5 10.5L14 14", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" })
						] })
					}),
					open ? jsx("div", { className: styles.panel, style: panelPos, children: [
						jsx("input", {
							ref: inputRef,
							className: styles.input,
							type: "search",
							placeholder: "搜索当前会话（空格分隔多个关键词）",
							value: query,
							"aria-label": "搜索当前会话",
							onChange: (event) => setQuery(event.target.value),
							onKeyDown: onInputKeyDown
						}),
						jsx("div", { className: styles.chips, children: CHIPS.map((chip) => {
							const group = chip[0];
							const active = filter === group;
							return jsx("button", {
								type: "button",
								className: active ? styles.chip + " " + styles.chipActive : styles.chip,
								"aria-pressed": active,
								onClick: () => setFilter(active ? "all" : group),
								children: chip[1] + " " + (counts[group] || 0)
							}, group);
						})}),
						query.trim() ? jsx("div", { className: styles.count, children: results.length + " 条结果" }) : null,
						results.length > 0
							? jsx("ul", { className: styles.list, children: results.map((result, index) => jsx("li", {
								className: styles.row + (index === sel ? " " + styles.selected : ""),
								onClick: () => jump(result.key),
								children: [
									jsx("span", { className: styles.badge, children: kindLabel(result.kind) }),
									jsx("span", { className: styles.snippet, children: highlightAll(result.text, terms[0] || "") }),
									jsx("button", {
										type: "button",
										className: styles.copy,
										onClick: (event) => { event.stopPropagation(); copy(result.text); },
										children: "复制"
									})
								]
							}, index)) })
							: jsx("div", { className: styles.empty, children: query.trim() ? "没有匹配的内容" : "输入关键词，搜索当前会话的消息、AI 回复、工具调用和命令" })
					] }) : null
			]
		});
		}
		/**
		 * Client plugin body: register the header action into the session
		 * header's additive action row (the jobs list button's seat).
		 * @param ctx - client cordis context.
		 */
		function apply(ctx) {
			ctx.slots.inject("conversation.session.header.actions", () => ctx.slots.register({
				name: "conversation.session.header.actions",
				id: "session-search",
				order: 30
			}, SessionSearchAction));
		}
		exports.apply = apply;
		exports.inject = ["slots"];
		return module.exports;
	}
});
