# OK和晶晶的伦敦往事 · 私人加密阅读器

第二部。静态站点，无后端。部署路径：

```
https://yuanmenghe.github.io/Demo/ex-partner-london/
```

不加入 Demo Hub，只通过直链访问。解密后的目录底部可以去第一部。

## 内容怎么保护

正文在 `assets/content.bin`，PBKDF2-HMAC-SHA256（310,000 次）加 AES-256-GCM。密码不进仓库。图片没有加密，知道直链就能打开 `assets/img/`。

仓库是公开的。这道锁只挡住打开网页、不输入密码的人。

## 重新生成

构建脚本留在本机任务目录，不进这个仓库。设置环境变量 `SITE_PASSWORD` 后重跑，再提交新的 `assets/content.bin`。不要把明文 HTML 推进来。
