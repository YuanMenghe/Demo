<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# FDA Submission Gap Analyzer

This repository contains everything you need to run the app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `AI_API_KEY` in `.env.local` to your model provider API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

This project supports GitHub Pages deployment from a monorepo subfolder.

1. Keep the project path as `Demo/fda-submission-gap-analyzer`
2. In GitHub repository settings, enable Pages source as **GitHub Actions**
3. Push changes to `main`; the workflow will build and deploy automatically

If your Pages URL uses a subpath, set the build base path with:

`VITE_BASE_PATH=/demo/fda-submission-gap-analyzer/`
