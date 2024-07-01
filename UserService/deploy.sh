
# build image
docker system prune -a
docker build --no-cache -t backend-apis:last .

# tag image
docker tag backend-apis:last reene44444/insta_cut:test_v13

#login into Docker Hub
echo "Enter your Docker Hub password:"
docker login -u reene44444

# push image
docker push reene44444/insta_cut:test_v13