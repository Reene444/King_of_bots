# 第一阶段：构建
#!/bin/bash
FROM bellsoft/liberica-openjdk-alpine-musl:17 AS build
WORKDIR /backend
COPY pom.xml mvnw* ./
COPY .mvn .mvn
RUN chmod +x mvnw
RUN ./mvnw dependency:resolve
COPY src ./src
RUN ./mvnw clean package -DskipTests

# 第二阶段：运行
FROM openjdk:17-jdk-slim-buster
WORKDIR /backend
COPY --from=build /backend/target/*.jar ./
EXPOSE 8097
CMD ["java", "-jar", "RunningService-1.jar"]
