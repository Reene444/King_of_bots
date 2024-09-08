
<h1 align="center">Multiplayer snake game</h1>


#### This is a snake online game for multiple players 
#### keep improving the engine performance

## :wrench: Improvement
- Change the rabbitmq to Kafka Stream

## :sparkles: Skills
- `Springboot`
- `Mongodb`
- `Kafka Stream`
- `Redis`
- `React.js`


## :book: How to use
To clone and run this application
```
# Clone this repository
$ git clone https://github.com/Reene444/King_of_bots/tree/main_v2
 
# Go into the each backend modules and combine the commands as third point.
$ cd RunningService
$ cd RecordingService

#Each backend modules run commands as follows:
# Install dependencies
$ mvn clean package

# Run the app
$ java -jar target/RunningService-1.jar
$ java -jar target/RecordingService-1.jar

# Go into the repository
$ cd frontend_web

# Run the app
$ npm start

# if the `npm start` doesn't work then:
$ ./setup_run_frontend.sh

```
## :wrench: Functions
-  Process:
1. [x] Pk
2. [x] LeaderBoard
3. [x] Recording function
4. [x] PlaybackPage function


![image-5-camera.png](image-5-camera.png)