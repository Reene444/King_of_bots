# syntax=docker/dockerfile:1.3
FROM --platform=linux/amd64 openjdk:17-jdk-alpine
WORKDIR /tmp
COPY target/backend_apis-0.0.1-SNAPSHOT.jar .
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "backend_apis-0.0.1-SNAPSHOT.jar"]