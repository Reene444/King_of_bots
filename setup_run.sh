# shellcheck disable=SC2164
cd frontend
chmod +x setup_run_frontend.sh
./setup_run_frontend.sh
# shellcheck disable=SC2164
cd ../RunningService
docker-compose up
