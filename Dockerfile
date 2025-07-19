# Multi-stage build for Core Banking System
FROM openjdk:17-jdk-slim AS builder

WORKDIR /app

# Copy Maven files
COPY pom.xml .
COPY src ./src

# Build the application
RUN apt-get update && apt-get install -y maven
RUN mvn clean package -DskipTests

# Production stage
FROM openjdk:17-jre-slim

WORKDIR /app

# Create non-root user
RUN groupadd -r banking && useradd -r -g banking banking

# Copy built JAR
COPY --from=builder /app/target/core-banking-system-1.0.0.jar app.jar

# Create logs directory
RUN mkdir -p /var/log/core-banking && chown banking:banking /var/log/core-banking

# Switch to non-root user
USER banking

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/api/public/health || exit 1

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]