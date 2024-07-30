### Reference Documentation
* this is baseline project for authentication

###  Dependency

* Lombok
* SpringWeb
* h2 database
* jpa database
* validation

### Helper for developer
* 1.link: jwt.io for check plain text jwt
* 2.for cors: as we need client could access our backend, we need to allow all origin request path etc. config `@CrossOrigin(origins = {"*"},maxAge=3600)` on ur controller.
* 3.everytime when we modify the code, we need to rebuild the all package and generate the jar app using `mvn clean package`, and then use `./deploy.sh` auto docker script to push to DockerHub.And then modify the image of GC workflow of kubenute cluster in its config.

### docker helper
  $docker buildx build --platform linux/amd64 --push -t reene44444/react-app:react-tic-game-test8 .

### Deploy
port:8080

[docker repostory:insta_cut](https://hub.docker.com/repository/docker/reene44444/insta_cut/general)

last tage : test_v[version:10]


