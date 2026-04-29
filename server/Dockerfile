FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY target/bloom-flowers-1.0.0-runner.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]