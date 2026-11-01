# NOAH Markdown 助手 - 生产环境镜像
# 技术同事可: docker build -t feishu-md-fixer . && docker run -p 8080:80 feishu-md-fixer

FROM node:20-alpine AS build

WORKDIR /app

# 先复制依赖清单以复用 Docker 构建缓存
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
