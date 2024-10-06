# 使用官方的 node 镜像作为基础镜像
FROM node:18

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 以安装依赖
COPY package*.json ./

# 设置环境变量为生产模式
ENV NODE_ENV=production

# 安装项目依赖
RUN npm install

RUN npm install --save-dev @babel/plugin-proposal-private-property-in-object

# 复制应用程序的源代码到容器中
COPY . .

# 构建 React 应用
RUN npm run build


# 暴露端口 3000
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]
