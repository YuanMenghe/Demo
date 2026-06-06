# GitHub Pages 部署与 Hub 导航说明

本仓库（`YuanMenghe/Demo`）通过 Actions 将多个演示子站统一部署到 GitHub Pages。

## 访问地址（重要）

| 用途 | URL | 说明 |
|------|-----|------|
| **项目聚合导航（Hub）** | **https://yuanmenghe.github.io/Demo/hub/Noah/** | 唯一入口，列出所有子站链接 |
| 站点根路径 | https://yuanmenghe.github.io/Demo/ | 仅显示 404，**不再**展示项目列表 |
| 各子站直链 | `https://yuanmenghe.github.io/Demo/<子项目目录>/` | 可单独分享，无需经过 Hub |

> Hub 路径由仓库 Secret `DEMO_HUB_SLUG`（当前为 `Noah`）决定。修改 Secret 后需重新部署，并同步更新本文档中的链接。

## 新增子站时必须做的事

每次向 Demo 站点**新增**一个可访问的子项目，除构建与拷贝静态资源外，**还必须**在 Hub 导航页增加对应卡片链接，否则用户只能从 Hub 入口找不到新项目。

### 1. 在 workflow 中构建并拷贝子站

编辑 [`.github/workflows/deploy-medical-copilot-pages.yml`](./.github/workflows/deploy-medical-copilot-pages.yml)：

1. 增加 `npm ci && npm run build`（或静态拷贝）步骤，并设置正确的 `BASE_PATH` / `VITE_BASE_PATH`（格式：`/${{ github.event.repository.name }}/<目录名>/`）。
2. 在 `Assemble full site` 中 `mkdir` 目标目录，并将构建产物 `cp` 到 `site/<目录名>/`。

### 2. 在 Hub 导航页添加链接（必做）

在同一 workflow 的 `Assemble full site` 步骤里，找到 **Hub: project navigation at secret path only** 段落，在 `<main class="grid">` 中追加一张卡片，例如：

```html
<a class="card" href="/${REPO_NAME}/your-new-project/">
  <span class="card-title">项目名称</span>
  <span class="card-desc">简短说明</span>
</a>
```

注意：

- 链接必须使用 **以 `/Demo/` 开头的绝对路径**（workflow 中写 `/\${REPO_NAME}/...`），不要用相对路径。
- 不要改 `site/index.html`（根目录 404）；聚合页只维护 `site/hub/${DEMO_HUB_SLUG}/index.html`。

### 3. 推送并验证

1. Push 到 `main`，等待 **Deploy to GitHub Pages** workflow 成功。
2. 打开 https://yuanmenghe.github.io/Demo/hub/Noah/ 确认新卡片出现且可跳转。
3. 直接访问 `https://yuanmenghe.github.io/Demo/<目录名>/` 确认子站本身正常。

## 仅更新已有子站

若只修改某个子项目代码、**没有新增子目录**，通常只需改子项目源码并 push，**不必**改 Hub 卡片（除非要改标题或说明文案）。

## 相关文件

- 部署 workflow：[`.github/workflows/deploy-medical-copilot-pages.yml`](./.github/workflows/deploy-medical-copilot-pages.yml)
- Hub Secret：仓库 **Settings → Secrets and variables → Actions → `DEMO_HUB_SLUG`**
