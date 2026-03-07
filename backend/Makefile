.PHONY: build run clean up down test docker-build docker-up docker-down

# Артефакт Spring Boot
JAR := target/finpilot-0.0.1.jar

build:
	mvn clean package -DskipTests

run: build
	java -jar $(JAR)

run-dev:
	mvn spring-boot:run

clean:
	mvn clean
	rm -f $(JAR)

# Только PostgreSQL в Docker (для локальной разработки)
up:
	docker run -d --name finpilot-db \
		-e POSTGRES_USER=postgres \
		-e POSTGRES_PASSWORD=postgres \
		-e POSTGRES_DB=finpilot \
		-p 5432:5432 \
		postgres:16-alpine
	@echo "PostgreSQL запущен. Подождите 3–5 сек и выполните: make run-dev"

down:
	docker stop finpilot-db 2>/dev/null || true
	docker rm finpilot-db 2>/dev/null || true

# Docker Compose: приложение + PostgreSQL
docker-build:
	docker compose build

docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f app

test:
	mvn test
