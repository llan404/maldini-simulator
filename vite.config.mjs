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
  },
});
