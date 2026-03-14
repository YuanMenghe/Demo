<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/9e9a4ea2-dbff-4c7f-bcba-156d9e144c4f

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## 推送到 GitHub 并在 GitHub Pages 打开

1. **在 GitHub 上建一个 demo 仓库**（例如 `medical-copilot-demo`），不要勾选 “Add a README”。

2. **在本地把本文件夹内容推到该仓库：**
   ```bash
   cd medical-copilot
   git init
   git add .
   git commit -m "Initial commit for GitHub Pages demo"
   git branch -M main
   git remote add origin https://github.com/<你的用户名>/<仓库名>.git
   git push -u origin main
   ```

3. **开启 GitHub Pages：**
   - 仓库页 → **Settings** → 左侧 **Pages**
   - **Source** 选 **GitHub Actions**
   - 保存后，每次推送到 `main` 会自动构建并发布

4. **查看在线地址：**  
   构建完成后，在 **Actions** 里看到 “Deploy to GitHub Pages” 成功，然后访问：
   - `https://<你的用户名>.github.io/<仓库名>/`
