// ============================================================
//  构建脚本：把内容与运行时源码按加载顺序拼接 → 混淆 → 产出 dist/
//  用法：npm run build   （本地开发永远跑未混淆源码，此脚本不改动任何源文件）
// ============================================================
import { readFileSync, writeFileSync, rmSync, mkdirSync, cpSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import JavaScriptObfuscator from 'javascript-obfuscator';
import { transform } from 'esbuild';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');

// 源码 JS 的加载顺序（必须与 index.html 中 <script> 顺序一致）
const SOURCES = [
  'terminalContent.js',
  'eventContent.js',
  'mainlineContent.js',
  'endingContent.js',
  'negotiationContent.js',
  'src/game-core.js',
  'src/transfer-system.js',
  'src/event-flow.js',
  'src/europe-system.js',
  'src/management-views.js',
  'src/terminal-system.js',
  'src/persistence-system.js',
];

// 拷贝 dist 时要排除的东西（开发/源码/文档等，不进产物）
const EXCLUDE = new Set([
  '.git', '.claude', '.vscode', 'sim', 'src', '__pycache__', 'node_modules', 'dist',
  'package.json', 'package-lock.json', 'vite.config.mjs', 'build.mjs',
  'subset-fonts.py', 'fonts-src',   // 字体子集化脚本与源字体（产物 assets/fonts/ 照常拷贝）
  'trim-ui-assets.py', 'Picture_Main', // 主界面素材源图与设计稿（线上用的是 assets/ui/ 里的裁边版）
  '.gitignore', 'CODEMAP.md', 'SeasonEvent.md', 'ACM模拟器.docx', '球队消息.docx',
  'index.html',            // 单独处理（重写 <script>）
  'style.css',             // 单独处理（esbuild 压缩、去掉全部注释）
  ...SOURCES,              // 源码不进产物，改由混淆后的 app.min.js 代替
]);

// —— 混淆配置：强保护 + 对回合制游戏基本零性能损耗 ——
// 关闭了两个「重型」选项（controlFlowFlattening / deadCodeInjection），
// 它们才是拖慢运行、撑大体积的元凶；字符串数组化则把中文文案藏起来（grep 不到明文）。
const OBFUSCATE_OPTIONS = {
  target: 'browser',
  compact: true,
  identifierNamesGenerator: 'hexadecimal',
  renameGlobals: false,            // 全局名保持不变，跨「文件」的全局引用绝不会断
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 1,         // 所有字符串（含全部文案）进数组
  stringArrayRotate: true,
  stringArrayShuffle: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  controlFlowFlattening: false,    // 关：最大的性能杀手
  deadCodeInjection: false,        // 关：体积杀手
  selfDefending: false,
  debugProtection: false,
  numbersToExpressions: false,
  transformObjectKeys: false,      // 关：游戏大量按动态 key 取对象，保守起见不动 key
  unicodeEscapeSequence: false,
};

const version = JSON.parse(readFileSync(join(ROOT, 'version.json'), 'utf8')).v;
console.log(`\n[build] 版本 v${version}`);

// 1) 清空并重建 dist
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

// 2) 按顺序拼接源码（\n;\n 分隔，避免跨文件 ASI 边界问题）
const combined = SOURCES
  .map((f) => `\n/* ===== ${f} ===== */\n` + readFileSync(join(ROOT, f), 'utf8'))
  .join('\n;\n');
console.log(`[build] 已拼接 ${SOURCES.length} 个源文件，共 ${(combined.length / 1024).toFixed(0)} KB`);

// 3) 混淆
const obfuscated = JavaScriptObfuscator.obfuscate(combined, OBFUSCATE_OPTIONS).getObfuscatedCode();
writeFileSync(join(DIST, 'app.min.js'), obfuscated, 'utf8');
console.log(`[build] 混淆完成 → dist/app.min.js（${(obfuscated.length / 1024).toFixed(0)} KB）`);

// 4) 拷贝其余静态资源（图片 / SVG/ / CNAME / version.json 等）
for (const entry of readdirSync(ROOT)) {
  if (EXCLUDE.has(entry)) continue;
  cpSync(join(ROOT, entry), join(DIST, entry), { recursive: true });
}
console.log('[build] 已拷贝静态资源');

// 4.5) 压缩 CSS：esbuild 去掉全部注释 + 压缩空白（上线产物不暴露任何样式注释）
const cssSrc = readFileSync(join(ROOT, 'style.css'), 'utf8');
const { code: cssMin } = await transform(cssSrc, { loader: 'css', minify: true });
writeFileSync(join(DIST, 'style.css'), cssMin, 'utf8');
console.log(`[build] CSS 压缩完成 → dist/style.css（${(cssSrc.length / 1024).toFixed(0)} KB → ${(cssMin.length / 1024).toFixed(0)} KB）`);

// 5) 重写 index.html：把源码 <script> 块换成单个混淆后的 app.min.js
let html = readFileSync(join(ROOT, 'index.html'), 'utf8');
const SCRIPT_BLOCK_RE =
  /[ \t]*<!-- app-sources:start[^>]*-->[\s\S]*?<!-- app-sources:end -->/;
if (!SCRIPT_BLOCK_RE.test(html)) {
  throw new Error('[build] 未能在 index.html 中定位到 <script> 块，构建中止（源码结构变了？请检查 SCRIPT_BLOCK_RE）');
}
html = html.replace(SCRIPT_BLOCK_RE, `    <script src="app.min.js?v=${version}"></script>`);
writeFileSync(join(DIST, 'index.html'), html, 'utf8');
console.log('[build] 已重写 dist/index.html（源码脚本块 → app.min.js）');

console.log('\n[build] ✅ 完成。产物在 dist/，部署时只推 dist/ 里的内容。\n');
