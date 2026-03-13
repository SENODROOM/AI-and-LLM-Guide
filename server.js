/**
 * docs-site/server.js
 * Run: node server.js
 * Then open: http://localhost:3000
 *
 * This server does two things:
 *   GET /api/tree          → returns the full folder tree as JSON
 *   GET /api/file?path=... → returns the raw text of any .md / .txt file
 *   GET /*                 → serves static files (index.html, style.css, app.js)
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const ROOT = __dirname; // The folder this server lives in
const PORT = 4000; // intentional — open http://localhost:4000

// ── MIME types for static files ──────────────────────────────────────────────
const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

// ── Ignored names ─────────────────────────────────────────────────────────────
const IGNORE = new Set([
  "node_modules",
  ".git",
  ".DS_Store",
  "server.js",
  "app.js",
  "style.css",
  "styles.css",
  "index.html",
  "package.json",
  "package-lock.json",
  ".gitignore",
]);

// ── Build recursive file tree ─────────────────────────────────────────────────
function buildTree(dirPath, relBase = "") {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const folders = [];
  const files = [];

  for (const entry of entries) {
    if (IGNORE.has(entry.name) || entry.name.startsWith(".")) continue;

    const relPath = relBase ? `${relBase}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      const children = buildTree(path.join(dirPath, entry.name), relPath);
      // Only include folder if it has children
      if (children.folders.length > 0 || children.files.length > 0) {
        folders.push({ name: entry.name, path: relPath, ...children });
      }
    } else if (/\.(md|txt|markdown)$/i.test(entry.name)) {
      files.push({ name: entry.name, path: relPath });
    }
  }

  // Natural sort
  folders.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { numeric: true }),
  );
  files.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { numeric: true }),
  );

  return { folders, files };
}

// ── Request handler ───────────────────────────────────────────────────────────
function handler(req, res) {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;

  // CORS headers (so you can also open index.html directly during dev)
  res.setHeader("Access-Control-Allow-Origin", "*");

  // ── API: directory tree ────────────────────────────────────────────────────
  if (pathname === "/api/tree") {
    try {
      const tree = buildTree(ROOT);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(tree));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // ── API: file content ──────────────────────────────────────────────────────
  if (pathname === "/api/file") {
    const filePath = parsed.query.path;
    if (!filePath) {
      res.writeHead(400);
      res.end("Missing path");
      return;
    }

    // Security: resolve and ensure it stays inside ROOT
    const abs = path.resolve(ROOT, filePath);
    if (!abs.startsWith(ROOT)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    try {
      const content = fs.readFileSync(abs, "utf8");
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(content);
    } catch (e) {
      res.writeHead(404);
      res.end("Not found");
    }
    return;
  }

  // ── Static file serving ────────────────────────────────────────────────────
  let filePath = path.join(ROOT, pathname === "/" ? "index.html" : pathname);
  const ext = path.extname(filePath).toLowerCase();

  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const mime = MIME[ext] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": mime });
  fs.createReadStream(filePath).pipe(res);
}

// ── Start ─────────────────────────────────────────────────────────────────────
http.createServer(handler).listen(PORT, () => {
  console.log(`\n  ✦ Docs site running at http://localhost:${PORT}\n`);
  console.log(`  Drop .md or .txt files anywhere in this folder.`);
  console.log(`  Refresh the browser to see them appear automatically.\n`);
});
