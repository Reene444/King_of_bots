# 使用官方的 node 镜像作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 以安装依赖
COPY package*.json ./
COPY public/ ./public
COPY src/  ./src
# 设置环境变量为生产模式
ENV NODE_ENV=production

# 安装项目依赖
RUN npm ci --force
# 暴露端口 3000
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]


