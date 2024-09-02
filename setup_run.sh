# shellcheck disable=SC2164
# 终止特定端口上的进程
kill_pt 8097
kill_pt 80

# 切换到后端服务目录并启动 Docker Compose
cd ./RunningService
docker-compose up &  # 后台运行 Docker Compose

cd ../frontend
chmod +x setup_run_frontend.sh
./setup_run_frontend.sh &  # 后台运行脚本


# sleep 50
# cd ../Test
# source venv/bin/activate
# pip install selenium webdriver-manager
# #pip install time
# python locustfile.py

