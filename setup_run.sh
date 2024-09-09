# shellcheck disable=SC2164
# kill the specific port in the terminal
kill_pt 8097
kill_pt 80

# Switch to the backend service directory and start Docker Compose
cd ./RunningService
docker-compose up &  # Running scripts in the background Docker Compose

cd ../frontend
chmod +x setup_run_frontend.sh
./setup_run_frontend.sh &  # Running scripts in the background

