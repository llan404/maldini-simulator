import { defineConfig } from 'vite';

// 仅用作「本地开发」的静态服务器：直接跑未混淆的源码
// （index.html + 各 classic <script>），可正常调试、看代码。
// 真正的打包/混淆由 build.mjs 负责，不走 vite build。
export default defineConfig({
  root: '.',
  publicDir: false,
  server: {
    port: 5173,
    open: true,
    watch: {
      // Windows 上图片被看图/编辑软件或杀毒占用时，chokidar 监听会抛 EBUSY 并直接崩掉整个 dev server
      // （曾被 Picture_Main/扣子.png 触发）。这些目录都是静态素材，改了也不需要 HMR，直接不监听。
      ignored: [
        '**/Picture_Main/**',
        '**/Picture_Ending/**',
        '**/SVG/**',
        '**/assets/fonts/**',
        '**/fonts-src/**',
        '**/dist/**',
      ],
    },
  },
});
