# NOAH AI · 医学专家协作平台

面向医学专家的任务协作与结算管理前端演示，涵盖任务大厅、工作区、资质认证、质量计价与 C 端服务展示。

## 功能模块

- **任务大厅** — 浏览与领取专家任务（方案审查、指南问答、数据提取等）
- **我的任务** — 进行中与返修任务管理，进入双栏工作区
- **结算记录** — 收入统计、质量评级与结算明细
- **资质认证** — S1–S5 分级认证流程
- **计价规则** — C×S 基础价表与 Q 质量系数说明
- **C 端服务** — 临床研究与证据评价服务套餐

## 本地运行

**环境要求：** Node.js 18+

```bash
npm install
npm run dev
```

浏览器访问 http://localhost:3000

## 构建与部署

```bash
npm run build
```

GitHub Pages 子路径部署时设置 `BASE_PATH`：

```bash
BASE_PATH=/Demo/medical-expert-collaboration-platform/ npm run build
```

## 技术栈

- React 19 + TypeScript
- Vite 6
- Tailwind CSS v4
- Motion（页面过渡动画）
- Lucide React（图标）
