# 构建阶段
FROM node:22-alpine AS build

# 设置工作目录
WORKDIR /app

# 安装pnpm
RUN npm install -g pnpm@10.33.4

# 复制项目文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制所有文件
COPY . .

# 构建项目
RUN pnpm build

# 部署阶段
FROM nginx:alpine

# 复制构建好的文件到nginx服务目录
COPY --from=build /app/dist /usr/share/nginx/html

# 复制nginx配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露80端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"] 
