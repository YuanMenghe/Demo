# NOAH Markdown 助手（feishu-md-fixer）- 部署说明

本工具为 **Vite + React 单页应用**，构建后为**纯静态文件**（`dist/`），无需 Node 进程常驻，部署方式与 **四象限待办** 相同：由 Nginx 或任意静态服务器托管。

---

## 一、构建产物

在仓库内执行：

```bash
cd feishu-md-fixer
npm ci
npm run build
```

生成目录 **`dist/`**（含 `index.html`、`assets/`、`noah-logo.png` 等）。上线时只需发布 **`dist/` 下的全部内容**，不要发布未构建的源码。

当前 **`vite.config.mts`** 中 `base: './'`，资源为相对路径，适合挂在**任意子路径**（如 `https://example.com/feishu-md-fixer/`）。

---

## 二、云服务器 / Nginx（子路径示例）

```nginx
location /feishu-md-fixer/ {
    alias /path/to/your/dist/;
    index index.html;
    try_files $uri $uri/ /feishu-md-fixer/index.html;
}

# 建议：无尾斜杠时重定向到带尾斜杠，避免相对资源路径异常
location = /feishu-md-fixer {
    return 301 https://$host/feishu-md-fixer/;
}
```

将 `/path/to/your/dist/` 换为服务器上实际存放 **构建产物** 的目录。

---

## 三、与 VibeTools 统一部署（公司 Noah 服务器）

与另外几个工具一起部署时，请按 **[deploy/README.md](../deploy/README.md)** 中「公司 Noah 服务器快速部署」：

- 对外路径：**`https://test.noahai.co/feishu-md-fixer/`**
- 静态目录：宿主机 **`/home/azureuser/feishu-md-fixer`**（内容为 `npm run build` 后的 **`dist/`** 内文件），容器内由 Nginx **`alias`** 到 **`/var/www/feishu-md-fixer/`**（需与 `noah-nginx` 的挂载一致，见 [deploy/ENV_NOAH_SERVER.md](../deploy/ENV_NOAH_SERVER.md)）。
- Nginx 片段：合并 **[deploy/nginx-noah-server.conf](../deploy/nginx-noah-server.conf)** 中 `feishu-md-fixer` 相关 `location`。

首次在 Noah 上启用时，请与运维确认：宿主机目录已创建、且 **noah-nginx** 已增加与「四象限待办」类似的 **volume 挂载**（宿主机目录 → 容器 `/var/www/feishu-md-fixer`）。

---

## 四、其他方式

- **对象存储 / GitHub Pages**：上传 **`dist/`** 全部文件即可。
- **本地预览构建结果**：`npx vite preview`（默认仅用于验证，非生产必需）。

---

## 五、Docker 镜像部署

项目根目录已提供生产镜像配置：

```bash
cd feishu-md-fixer
docker build -t feishu-md-fixer .
docker run --rm -p 8080:80 feishu-md-fixer
```

- 容器内使用 Nginx 托管 `npm run build` 生成的静态文件。
- 健康检查路径：`/health`。
- 可直接访问根路径 `/`，也兼容统一部署路径 `/feishu-md-fixer/`。

---

## 六、文件说明

| 路径 | 说明 |
|------|------|
| `dist/`（构建生成） | 唯一需要部署到 Web 服务器的目录 |
| `public/noah-logo.png` | 构建时复制到 `dist/`，勿单独遗漏 |
| `Dockerfile` | 多阶段构建：Node 构建静态文件，Nginx 运行 |
| `nginx.conf` | 容器内静态站点与 `/health` 配置 |
