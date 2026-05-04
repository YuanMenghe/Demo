# 淋巴瘤指南查询小程序（NOAH AI）

基于 Vite + React 的演示前端，用于淋巴瘤相关指南与病例流程示意。

## 本地运行

**环境：** Node.js

1. 安装依赖：`npm install`
2. 复制 `.env.example` 为 `.env.local`，配置 `NOAH_AI_API_KEY`（NOAH AI / 模型服务密钥）
3. 启动开发：`npm run dev`

## 构建

```bash
npm run build
```

部署到 GitHub Pages 时，由仓库 CI 注入 `VITE_BASE_PATH`，无需在本地填写。
