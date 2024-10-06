# 使用官方的 node 镜像作为基础镜像
FROM node:14

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 以安装依赖
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制应用程序的源代码到容器中
COPY . .

# 构建 React 应用
RUN npm run build

# 使用 serve 来提供构建后的应用，端口号可以是 3000 或者任何你想要的端口
RUN npm install -g serve

# 暴露端口 3000
EXPOSE 3000

# 启动应用
CMD ["serve", "-s", "build", "-l", "3000"]
