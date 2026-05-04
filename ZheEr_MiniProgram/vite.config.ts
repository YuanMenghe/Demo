import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  let base = (env.VITE_BASE_PATH || '/').trim();
  if (base !== '/' && !base.startsWith('/')) base = `/${base}`;
  if (base !== '/' && !base.endsWith('/')) base = `${base}/`;
  return {
    base,
    plugins: [react(), tailwindcss()],
    define: {
      // 构建时注入 NOAH AI 密钥；兼容仍在使用 GEMINI_API_KEY 的本地 .env
      'process.env.NOAH_AI_API_KEY': JSON.stringify(
        env.NOAH_AI_API_KEY ?? env.GEMINI_API_KEY,
      ),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // 在 NOAH AI / 自动化编辑环境中可通过 DISABLE_HMR=true 关闭 HMR，减少文件监听抖动。
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
