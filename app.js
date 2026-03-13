/* app.js — Docs Site
   Browser-only. DO NOT run with Node.
   Start server: node server.js  →  open http://localhost:3000
*/
"use strict";

/* ══════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════ */
const el = (id) => document.getElementById(id);

function prettify(name) {
  return name
    .replace(/^\d+[-_.\s]+/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
function extractNum(name) {
  const m = name.match(/^(\d+)/);
  return m ? m[1].padStart(2, "0") : null;
}
function countFiles(node) {
  return (
    (node.files || []).length +
    (node.folders || []).reduce((n, f) => n + countFiles(f), 0)
  );
}
function firstFile(node) {
  if (node.files && node.files.length) return node.files[0];
  for (const sub of node.folders || []) {
    const f = firstFile(sub);
    if (f) return f;
  }
  return null;
}
function animateNum(id, target) {
  const e = el(id);
  if (!e) return;
  let cur = 0;
  const step = Math.max(1, Math.ceil(target / 24));
  const iv = setInterval(() => {
    cur = Math.min(cur + step, target);
    e.textContent = cur;
    if (cur >= target) clearInterval(iv);
  }, 35);
}

/* ══════════════════════════════════════════════════════════
   MARKDOWN RENDERER
══════════════════════════════════════════════════════════ */
function renderMarkdown(md) {
  let text = md.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const esc = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const blocks = [];
  text = text.replace(/```(\w*)\n([\s\S]*?)```/gm, (_, lang, code) => {
    const idx = blocks.length;
    const encoded = encodeURIComponent(code.trimEnd());
    blocks.push(
      `<pre><button class="copy-btn" data-code="${encoded}">copy</button><code class="lang-${esc(lang)}">${esc(code.trimEnd())}</code></pre>`,
    );
    return `\x00B${idx}\x00`;
  });
  text = text.replace(/`([^`\n]+)`/g, (_, c) => {
    const idx = blocks.length;
    blocks.push(`<code>${esc(c)}</code>`);
    return `\x00B${idx}\x00`;
  });

  const inline = (s) => {
    s = s.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
    s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/__(.+?)__/g, "<strong>$1</strong>");
    s = s.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
    s = s.replace(/_([^_\n]+)_/g, "<em>$1</em>");
    s = s.replace(/~~(.+?)~~/g, "<del>$1</del>");
    s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
    s = s.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>',
    );
    s = s.replace(/\x00B(\d+)\x00/g, (_, n) => blocks[+n]);
    return s;
  };

  const lines = text.split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^\x00B(\d+)\x00$/.test(line)) {
      out.push(blocks[+line.match(/\x00B(\d+)\x00/)[1]]);
      i++;
      continue;
    }
    if (/^[-*_]{3,}\s*$/.test(line)) {
      out.push("<hr>");
      i++;
      continue;
    }
    const hm = line.match(/^(#{1,6})\s+(.+)/);
    if (hm) {
      const lvl = hm[1].length;
      const raw = hm[2].replace(/\s*#+\s*$/, "");
      const id = raw
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      out.push(`<h${lvl} id="${id}">${inline(esc(raw))}</h${lvl}>`);
      i++;
      continue;
    }
    if (line.startsWith("> ")) {
      const bq = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        bq.push(lines[i].slice(2));
        i++;
      }
      out.push(`<blockquote><p>${inline(esc(bq.join(" ")))}</p></blockquote>`);
      continue;
    }
    if (
      line.includes("|") &&
      lines[i + 1] &&
      /^\|?[\s\-:|]+\|/.test(lines[i + 1])
    ) {
      const headers = line
        .split("|")
        .map((c) => c.trim())
        .filter(Boolean);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].includes("|")) {
        rows.push(
          lines[i]
            .split("|")
            .map((c) => c.trim())
            .filter(Boolean),
        );
        i++;
      }
      let t =
        "<table><thead><tr>" +
        headers.map((h) => `<th>${inline(esc(h))}</th>`).join("") +
        "</tr></thead><tbody>";
      rows.forEach((r) => {
        t +=
          "<tr>" +
          r.map((c) => `<td>${inline(esc(c))}</td>`).join("") +
          "</tr>";
      });
      out.push(t + "</tbody></table>");
      continue;
    }
    if (/^[ \t]*[-*+] /.test(line)) {
      const items = [];
      while (i < lines.length && /^[ \t]*[-*+] /.test(lines[i])) {
        items.push(
          `<li>${inline(esc(lines[i].replace(/^[ \t]*[-*+] /, "")))}</li>`,
        );
        i++;
      }
      out.push("<ul>" + items.join("") + "</ul>");
      continue;
    }
    if (/^\d+\. /.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(`<li>${inline(esc(lines[i].replace(/^\d+\. /, "")))}</li>`);
        i++;
      }
      out.push("<ol>" + items.join("") + "</ol>");
      continue;
    }
    if (line.trim() === "") {
      i++;
      continue;
    }
    const para = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^#{1,6} /.test(lines[i]) &&
      !/^[ \t]*[-*+] /.test(lines[i]) &&
      !/^\d+\. /.test(lines[i]) &&
      !lines[i].startsWith("> ") &&
      !/^[-*_]{3,}\s*$/.test(lines[i]) &&
      !/^\x00B/.test(lines[i]) &&
      !lines[i].includes("|")
    ) {
      para.push(lines[i]);
      i++;
    }
    if (para.length) out.push(`<p>${inline(esc(para.join(" ")))}</p>`);
  }
  return out.join("\n");
}

/* ══════════════════════════════════════════════════════════
   STATE
══════════════════════════════════════════════════════════ */
let TREE = null;
let ALL_FILES = [];
let activeFile = null;
let tocObserver = null;

/* ══════════════════════════════════════════════════════════
   VIEW MANAGER  (defined early so error paths can use it)
══════════════════════════════════════════════════════════ */
function showView(name) {
  ["loading", "error-view", "home-view", "article-view"].forEach((id) => {
    const e = el(id);
    if (!e) return;
    if (id === "loading") e.classList.toggle("visible", name === "loading");
    if (id === "error-view") e.classList.toggle("visible", name === "error");
    if (id === "home-view") e.classList.toggle("visible", name === "home");
    if (id === "article-view")
      e.classList.toggle("visible", name === "article");
  });
}

function showError(title, detail) {
  const mt = el("error-msg-text");
  const ms = el("error-sub-text");
  if (mt) mt.innerHTML = title;
  if (ms) ms.innerHTML = detail || "";
  showView("error");
}

/* ══════════════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════════════ */
let toastTimer = null;
function showToast(msg) {
  const t = el("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ══════════════════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════════════════ */
function openSidebar() {
  el("sidebar").classList.add("open");
  el("sidebar-overlay").classList.add("visible");
  document.body.classList.add("sidebar-open");
}
function closeSidebar() {
  el("sidebar").classList.remove("open");
  el("sidebar-overlay").classList.remove("visible");
  document.body.classList.remove("sidebar-open");
}
function toggleSidebar() {
  el("sidebar").classList.contains("open") ? closeSidebar() : openSidebar();
}

/* ══════════════════════════════════════════════════════════
   COMMAND PALETTE
══════════════════════════════════════════════════════════ */
let paletteSelected = 0;

function openPalette() {
  const po = el("palette-overlay");
  const pi = el("palette-input");
  if (!po || !pi) return;
  po.classList.add("visible");
  pi.value = "";
  updatePalette();
  requestAnimationFrame(() => pi.focus());
}
function closePalette() {
  const po = el("palette-overlay");
  if (po) po.classList.remove("visible");
}

function updatePalette() {
  const pi = el("palette-input");
  const pr = el("palette-results");
  if (!pi || !pr) return;

  const q = pi.value.toLowerCase().trim();
  paletteSelected = 0;

  const matches = q
    ? ALL_FILES.filter(
        (f) =>
          prettify(f.name).toLowerCase().includes(q) ||
          (f.folderDisplay &&
            prettify(f.folderDisplay).toLowerCase().includes(q)),
      ).slice(0, 12)
    : ALL_FILES.slice(0, 10);

  pr.innerHTML = "";
  if (matches.length === 0) {
    pr.innerHTML =
      '<div style="text-align:center;padding:24px;font-family:JetBrains Mono,monospace;font-size:12px;color:var(--fg-faint)">No results</div>';
    return;
  }

  matches.forEach((file, i) => {
    const div = document.createElement("div");
    div.className = "palette-result" + (i === 0 ? " selected" : "");
    div.dataset.idx = String(i);

    const num = extractNum(file.name) || "·";
    const title = prettify(file.name.replace(/\.(md|txt|markdown)$/i, ""));
    const folder = file.folderDisplay ? prettify(file.folderDisplay) : "Root";
    const hl = q
      ? title.replace(
          new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"),
          "<mark>$1</mark>",
        )
      : title;

    div.innerHTML = `
      <div class="palette-result-icon">${num}</div>
      <div class="palette-result-body">
        <div class="palette-result-title">${hl}</div>
        <div class="palette-result-sub">${folder}</div>
      </div>`;

    div.addEventListener("click", () => {
      openFile(file);
      closePalette();
    });
    div.addEventListener("mouseenter", () => selectPaletteItem(i));
    pr.appendChild(div);
  });
}

function selectPaletteItem(idx) {
  paletteSelected = idx;
  const items = el("palette-results")
    ? el("palette-results").querySelectorAll(".palette-result")
    : [];
  items.forEach((r, i) => r.classList.toggle("selected", i === idx));
}

function handlePaletteKeys(e) {
  const pr = el("palette-results");
  if (!pr) return;
  const items = pr.querySelectorAll(".palette-result");
  if (e.key === "ArrowDown") {
    e.preventDefault();
    selectPaletteItem(Math.min(paletteSelected + 1, items.length - 1));
    if (items[paletteSelected])
      items[paletteSelected].scrollIntoView({ block: "nearest" });
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    selectPaletteItem(Math.max(paletteSelected - 1, 0));
    if (items[paletteSelected])
      items[paletteSelected].scrollIntoView({ block: "nearest" });
  } else if (e.key === "Enter") {
    const pi = el("palette-input");
    const q = pi ? pi.value.toLowerCase().trim() : "";
    const matches = q
      ? ALL_FILES.filter(
          (f) =>
            prettify(f.name).toLowerCase().includes(q) ||
            (f.folderDisplay &&
              prettify(f.folderDisplay).toLowerCase().includes(q)),
        )
      : ALL_FILES.slice(0, 10);
    const chosen = matches[paletteSelected];
    if (chosen) {
      openFile(chosen);
      closePalette();
    }
  } else if (e.key === "Escape") {
    closePalette();
  }
}

/* ══════════════════════════════════════════════════════════
   GO HOME
══════════════════════════════════════════════════════════ */
function goHome() {
  if (!TREE) return;
  showView("home");
  activeFile = null;
  document
    .querySelectorAll(".nav-file")
    .forEach((e) => e.classList.remove("active"));
  window.scrollTo({ top: 0 });
}

/* ══════════════════════════════════════════════════════════
   INIT UI
══════════════════════════════════════════════════════════ */
function initUI() {
  // Brand / home
  const brand = document.querySelector(".sidebar-brand");
  if (brand) brand.addEventListener("click", goHome);

  // Burger
  const burger = el("burger");
  if (burger) burger.addEventListener("click", () => toggleSidebar());

  // Overlay click → close sidebar
  const overlay = el("sidebar-overlay");
  if (overlay) overlay.addEventListener("click", () => closeSidebar());

  // Search button → palette
  const searchBtn = el("search-btn");
  if (searchBtn) searchBtn.addEventListener("click", openPalette);

  const topbarSearch = el("topbar-search-btn");
  if (topbarSearch) topbarSearch.addEventListener("click", openPalette);

  // Palette overlay click
  const paletteOverlay = el("palette-overlay");
  if (paletteOverlay) {
    paletteOverlay.addEventListener("click", (e) => {
      if (e.target === paletteOverlay) closePalette();
    });
  }

  const paletteInput = el("palette-input");
  if (paletteInput) {
    paletteInput.addEventListener("input", updatePalette);
    paletteInput.addEventListener("keydown", handlePaletteKeys);
  }

  // Scroll
  window.addEventListener(
    "scroll",
    () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const bar = el("progress-bar");
      if (bar)
        bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    },
    { passive: true },
  );

  // Global keys
  document.addEventListener("keydown", (e) => {
    // Cmd/Ctrl+K → palette
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      openPalette();
      return;
    }
    // Escape
    if (e.key === "Escape") {
      const po = el("palette-overlay");
      if (po && po.classList.contains("visible")) {
        closePalette();
        return;
      }
      closeSidebar();
      return;
    }
    // H → home (when not typing)
    if (e.key === "h" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const tag = document.activeElement ? document.activeElement.tagName : "";
      if (tag !== "INPUT" && tag !== "TEXTAREA") {
        goHome();
        return;
      }
    }
    // Alt+← / → article nav
    if (e.altKey && activeFile) {
      const idx = ALL_FILES.findIndex((f) => f.path === activeFile.path);
      if (e.key === "ArrowLeft" && idx > 0) {
        e.preventDefault();
        openFile(ALL_FILES[idx - 1]);
        showToast(
          "← " +
            prettify(
              ALL_FILES[idx - 1].name.replace(/\.(md|txt|markdown)$/i, ""),
            ),
        );
      }
      if (e.key === "ArrowRight" && idx < ALL_FILES.length - 1) {
        e.preventDefault();
        openFile(ALL_FILES[idx + 1]);
        showToast(
          "→ " +
            prettify(
              ALL_FILES[idx + 1].name.replace(/\.(md|txt|markdown)$/i, ""),
            ),
        );
      }
    }
  });

  // Copy buttons (delegated)
  document.addEventListener("click", (e) => {
    if (e.target.classList && e.target.classList.contains("copy-btn")) {
      const code = decodeURIComponent(e.target.dataset.code || "");
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(code)
          .then(() => {
            e.target.textContent = "copied!";
            e.target.classList.add("copied");
            showToast("Copied to clipboard");
            setTimeout(() => {
              e.target.textContent = "copy";
              e.target.classList.remove("copied");
            }, 2000);
          })
          .catch(() => showToast("Copy failed"));
      }
    }
  });
}

/* ══════════════════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", async () => {
  // Guarantee loading is visible immediately
  const loadEl = el("loading");
  if (loadEl) {
    loadEl.classList.add("visible");
  }

  // Wire up static UI (safe — no TREE needed)
  try {
    initUI();
  } catch (e) {
    console.error("initUI error:", e);
  }

  // Fetch tree
  let treeData;
  try {
    const res = await fetch("/api/tree");
    if (!res.ok) throw new Error(`HTTP ${res.status} — is server.js running?`);
    treeData = await res.json();
  } catch (e) {
    showError(
      "Cannot reach server",
      `Run this first:<br><br><code>node server.js</code><br><br>` +
        `Then open <strong>http://localhost:4000</strong><br><br>` +
        `<small>${e.message}</small>`,
    );
    return;
  }

  // Populate
  try {
    TREE = treeData;
    flattenTree(TREE, ALL_FILES, "");
    buildNav(TREE);
    renderHome();

    const fcl = el("file-count-label");
    const tt = el("topbar-title");
    const st = el("site-title");
    if (fcl)
      fcl.textContent = `${ALL_FILES.length} articles · ${(TREE.folders || []).length} sections`;
    if (tt && st) tt.textContent = st.textContent;

    showView("home"); // removes loading, shows home
  } catch (e) {
    console.error("Populate error:", e);
    showError(
      "Render failed",
      `${e.message}<br><br>Check console (F12) for details.`,
    );
  } finally {
    // Safety net: loading screen must never stay visible after tree loads
    const loadEl = el("loading");
    if (loadEl) loadEl.classList.remove("visible");
  }
});

/* ══════════════════════════════════════════════════════════
   FLATTEN TREE
══════════════════════════════════════════════════════════ */
function flattenTree(node, out, folderName) {
  (node.files || []).forEach((f) =>
    out.push({ ...f, folderDisplay: folderName }),
  );
  (node.folders || []).forEach((folder) =>
    flattenTree(folder, out, folder.name),
  );
}

/* ══════════════════════════════════════════════════════════
   BUILD NAV
══════════════════════════════════════════════════════════ */
function buildNav(tree) {
  const navTree = el("nav-tree");
  if (!navTree) return;
  navTree.innerHTML = "";
  (tree.files || []).forEach((f) => navTree.appendChild(makeFileEl(f, true)));
  (tree.folders || []).forEach((folder) =>
    navTree.appendChild(makeFolderEl(folder)),
  );
  navTree.querySelectorAll(".nav-file").forEach((e, i) => {
    e.style.animationDelay = `${i * 28}ms`;
  });
}

function makeFolderEl(folder) {
  const wrap = document.createElement("div");
  const label = document.createElement("div");
  const children = document.createElement("div");

  label.className = "nav-folder-label open";
  label.dataset.folder = folder.path;
  label.innerHTML = `<span>${prettify(folder.name)}</span>
    <small class="fold-count">${countFiles(folder)}</small>
    <i class="chevron">▶</i>`;
  label.addEventListener("click", () => {
    label.classList.toggle("open");
    children.classList.toggle("open");
  });

  children.className = "nav-folder-children open";
  (folder.files || []).forEach((f) =>
    children.appendChild(makeFileEl(f, false)),
  );
  (folder.folders || []).forEach((sub) =>
    children.appendChild(makeFolderEl(sub)),
  );

  wrap.appendChild(label);
  wrap.appendChild(children);
  return wrap;
}

function makeFileEl(file, isRoot) {
  const div = document.createElement("div");
  const num = extractNum(file.name);
  div.className = "nav-file" + (isRoot ? " root-file" : "");
  div.dataset.path = file.path;
  div.innerHTML = `<span class="nav-file-num">${num || "·"}</span><span>${prettify(file.name.replace(/\.(md|txt|markdown)$/i, ""))}</span>`;
  div.addEventListener("click", () => {
    openFile(file);
    closeSidebar();
  });
  return div;
}

/* ══════════════════════════════════════════════════════════
   RENDER HOME
══════════════════════════════════════════════════════════ */
function renderHome() {
  const hv = el("home-view");
  if (!hv) return;

  const folderCount = (TREE.folders || []).length;
  const fileCount = ALL_FILES.length;
  const icons = [
    "📁",
    "📂",
    "🗂️",
    "📑",
    "📋",
    "🗒️",
    "📝",
    "📄",
    "📃",
    "🔖",
    "⚡",
    "🎯",
  ];

  hv.innerHTML = `
    <div class="home-hero">
      <span class="hero-bracket tl"></span>
      <span class="hero-bracket tr"></span>
      <span class="hero-bracket br"></span>
      <div class="home-eyebrow">
        <span class="home-eyebrow-line"></span>
        Auto-generated · Always in sync
      </div>
      <h1 class="home-h1" id="home-h1">Everything,<br><span class="gradient-word">navigable.</span></h1>
      <p class="home-desc">Drop .md or .txt files anywhere and refresh — your docs appear automatically.</p>
      <div class="home-stats">
        <div class="stat"><span class="stat-n" id="stat-f">0</span><span class="stat-l">Sections</span></div>
        <div class="stat"><span class="stat-n" id="stat-a">0</span><span class="stat-l">Articles</span></div>
      </div>
    </div>
    <div class="home-cards">
      <div class="home-cards-header">
        <span class="home-cards-label">Browse by section</span>
        <span class="home-cards-line"></span>
      </div>
      <div class="cards-grid" id="folder-cards"></div>
    </div>`;

  animateNum("stat-f", folderCount);
  animateNum("stat-a", fileCount);

  const grid = el("folder-cards");
  if (!grid) return;

  if ((TREE.files || []).length) {
    grid.appendChild(
      makeCard("📄", "Root Files", `${TREE.files.length} file(s)`, () =>
        openFile(TREE.files[0]),
      ),
    );
  }
  (TREE.folders || []).forEach((folder, idx) => {
    const fc = countFiles(folder);
    grid.appendChild(
      makeCard(
        icons[idx % icons.length],
        prettify(folder.name),
        `${fc} article${fc !== 1 ? "s" : ""}`,
        () => {
          const f = firstFile(folder);
          if (f) openFile(f);
        },
      ),
    );
  });

  // Stagger cards in
  grid.querySelectorAll(".folder-card").forEach((card, i) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(14px)";
    card.style.transition = "opacity 0.4s, transform 0.4s";
    setTimeout(
      () => {
        card.style.opacity = "1";
        card.style.transform = "none";
      },
      80 + i * 55,
    );
  });

  // Try README for title
  const readme = (TREE.files || []).find((f) => /^readme/i.test(f.name));
  if (readme) {
    fetch(`/api/file?path=${encodeURIComponent(readme.path)}`)
      .then((r) => r.text())
      .then((md) => {
        const m = md.match(/^#\s+(.+)/m);
        if (m) {
          const words = m[1].trim().split(" ");
          const h = el("home-h1");
          if (h) {
            if (words.length > 1) {
              h.innerHTML =
                words.slice(0, -1).join(" ") +
                '<br><span class="gradient-word">' +
                words.slice(-1) +
                "</span>";
            } else {
              h.innerHTML =
                '<span class="gradient-word">' + words[0] + "</span>";
            }
          }
        }
      })
      .catch(() => {});
  }
}

function makeCard(icon, title, meta, onClick) {
  const d = document.createElement("div");
  d.className = "folder-card";
  d.innerHTML = `<span class="card-icon">${icon}</span>
    <div class="card-folder-name">${title}</div>
    <div class="card-meta">${meta}</div>`;
  d.addEventListener("click", onClick);
  return d;
}

/* ══════════════════════════════════════════════════════════
   OPEN FILE
══════════════════════════════════════════════════════════ */
async function openFile(file) {
  activeFile = file;
  showView("loading");

  // Nav highlight
  document.querySelectorAll(".nav-file").forEach((e) => {
    e.classList.toggle("active", e.dataset.path === file.path);
  });
  // Expand parent folders
  document.querySelectorAll(".nav-folder-label").forEach((label) => {
    if (
      label.dataset.folder &&
      file.path.startsWith(label.dataset.folder + "/")
    ) {
      label.classList.add("open");
      if (label.nextElementSibling)
        label.nextElementSibling.classList.add("open");
    }
  });
  // Scroll active nav item into view
  const activeNav = document.querySelector(".nav-file.active");
  if (activeNav)
    activeNav.scrollIntoView({ block: "nearest", behavior: "smooth" });

  let text;
  try {
    const res = await fetch(`/api/file?path=${encodeURIComponent(file.path)}`);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    text = await res.text();
  } catch (e) {
    showError("Could not load file", e.message);
    return;
  }

  renderArticle(file, text);
  showView("article");
  window.scrollTo({ top: 0, behavior: "instant" });
}

/* ══════════════════════════════════════════════════════════
   RENDER ARTICLE
══════════════════════════════════════════════════════════ */
function renderArticle(file, raw) {
  const ac = el("article-content");
  if (!ac) return;

  const isMarkdown = /\.(md|markdown)$/i.test(file.name);
  const body = isMarkdown
    ? renderMarkdown(raw)
    : `<pre>${raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`;

  const idx = ALL_FILES.findIndex((f) => f.path === file.path);
  const prev = ALL_FILES[idx - 1] || null;
  const next = ALL_FILES[idx + 1] || null;
  const mins = Math.max(1, Math.round(raw.split(/\s+/).length / 200));

  const folderTag = file.folderDisplay
    ? `<span class="meta-tag folder-tag">${prettify(file.folderDisplay)}</span><span class="meta-sep">/</span>`
    : "";

  ac.innerHTML = `
    <div class="article-meta">
      ${folderTag}
      <span class="meta-tag">${file.name}</span>
      <span class="meta-tag" style="margin-left:auto">${mins} min read</span>
    </div>
    <div class="md-body" id="md-body">${body}</div>
    <div class="article-footer">
      ${
        prev
          ? `<div class="foot-btn" data-nav="${prev.path}">
          <div class="foot-dir">← Previous</div>
          <div class="foot-label">${prettify(prev.name.replace(/\.(md|txt|markdown)$/i, ""))}</div>
        </div>`
          : "<div></div>"
      }
      ${
        next
          ? `<div class="foot-btn next" data-nav="${next.path}">
          <div class="foot-dir">Next →</div>
          <div class="foot-label">${prettify(next.name.replace(/\.(md|txt|markdown)$/i, ""))}</div>
        </div>`
          : "<div></div>"
      }
    </div>`;

  ac.querySelectorAll(".foot-btn[data-nav]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = ALL_FILES.find((f) => f.path === btn.dataset.nav);
      if (f) openFile(f);
    });
  });

  buildTOC();
}

/* ══════════════════════════════════════════════════════════
   TABLE OF CONTENTS
══════════════════════════════════════════════════════════ */
function buildTOC() {
  const tocList = el("toc-list");
  const tocPanel = el("toc-panel");
  if (!tocList || !tocPanel) return;
  tocList.innerHTML = "";

  if (tocObserver) {
    tocObserver.disconnect();
    tocObserver = null;
  }

  const body = el("md-body");
  const headings = body ? Array.from(body.querySelectorAll("h2, h3")) : [];

  if (headings.length < 2) {
    tocPanel.style.display = "none";
    return;
  }
  tocPanel.style.display = "";

  headings.forEach((h) => {
    const a = document.createElement("a");
    a.className = "toc-item" + (h.tagName === "H3" ? " toc-h3" : "");
    a.textContent = h.textContent;
    a.href = "#" + h.id;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      h.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    tocList.appendChild(a);
  });

  tocObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          tocList.querySelectorAll(".toc-item").forEach((a) => {
            a.classList.toggle("active", a.getAttribute("href") === "#" + id);
          });
        }
      });
    },
    { rootMargin: "-5% 0px -80% 0px", threshold: 0 },
  );

  headings.forEach((h) => tocObserver.observe(h));
}
