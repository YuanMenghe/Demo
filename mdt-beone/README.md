# MDT_Beone

基于 React + TypeScript + Vite + Tailwind 的临床决策支持（CDSS）演示项目，由原 PLM（Patient Like Me / 数字孪生）项目抽取关键代码与配置改名而来。

## 功能概览

- 三栏工作区：患者信息录入（左）/ 诊疗方案主视图（中）/ 证据与引用详情（右）
- 阶段自动切换：`input → analyzing → results → citation`，三栏宽度按阶段平滑过渡（framer-motion 弹簧动画）
- 多 Tab 主视图：整合视图、指南推荐、循证证据、药品说明书、用户知识库
- 引用角标 `[n]` 联动右侧证据卡，支持 hover 高亮与指南章节定位
- RWD 流程图（`RWDFlowChart`）
- 隐私信息（手机号 / 身份证）检测与自动遮罩
- 4 个内置演示案例（DLBCL 初治 / 合并心衰 / 待确诊 / 复发难治）

## 技术栈

- React 19 + TypeScript 5.8
- Vite 6
- Tailwind CSS 4（`@tailwindcss/vite`）
- framer-motion、lucide-react、@radix-ui/react-tooltip
- Vitest + Testing Library（jsdom 环境）

## 目录结构

```
MDT_Beone/
├── docs/
│   └── TEST_PLAN.md
├── src/
│   ├── components/         # LeftPanel / CenterPanel / RightPanel / RWDFlowChart / SettingsPage / ActionBar
│   ├── hooks/
│   │   └── useCDSSLogic.ts # 业务核心：mock 响应、PII、概念确认、缺失项更新
│   ├── lib/utils.ts        # cn(...) 等工具
│   ├── test/setup.ts       # vitest setup（jest-dom）
│   ├── App.tsx             # 三栏 + 阶段调度
│   ├── main.tsx
│   ├── types.ts            # CDSSResponse / Citation / Treatment / Guideline 等
│   ├── mockData.ts         # SCENARIOS 演示案例
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── TEST_PLAN.md
└── README.md
```

## 本地运行

前置：Node.js 18+。

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run preview
npm test           # 运行 vitest 全量
npm run test:watch
```

## 环境变量

复制 `.env.example` 为 `.env.local`，按需填写。

## 备注

业务数据（DLBCL 指南、POLARIX/GOYA 等文献摘要、药品说明书）均为 mock，仅用于演示，不构成临床建议。
