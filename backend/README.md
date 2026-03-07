# FinPilot — Backend

Бэкенд приложения FinPilot на Spring Boot 3.2 с Java 21. REST API для управления счетами, транзакциями, переводами и интеграцией с AI (категоризация и советы).

## Требования

- **Java 21**
- **Maven 3.6+**
- **PostgreSQL 14+**

## Конфигурация

Параметры задаются в `src/main/resources/application.yml`:

| Параметр | Описание | По умолчанию |
|----------|----------|--------------|
| `server.port` | Порт приложения | 8080 |
| `spring.datasource.url` | URL БД PostgreSQL | `jdbc:postgresql://localhost:5432/finpilot` |
| `spring.datasource.username` | Пользователь БД | postgres |
| `spring.datasource.password` | Пароль БД | postgres |
| `ANTHROPIC_API_KEY` | API-ключ Anthropic (для AI) | — |

Для работы AI-функций (категоризация, советы) нужна переменная окружения:

```bash
export ANTHROPIC_API_KEY=your-api-key
```

## Запуск

### Docker Compose (рекомендуется)

Поднимает приложение и PostgreSQL одной командой:

```bash
docker compose up -d
# или через Makefile:
make docker-up
```

API: **http://localhost:8080**. Остановка: `docker compose down` или `make docker-down`.

Для AI-функций передайте ключ: `ANTHROPIC_API_KEY=sk-... docker compose up -d`.

### Через Makefile

```bash
# Сборка
make build

# Запуск приложения (требуется запущенный PostgreSQL)
make run

# Очистка артефактов
make clean

# Только PostgreSQL в Docker (для локальной разработки)
make up
make down

# Docker Compose
make docker-build   # собрать образ приложения
make docker-up     # запустить app + db
make docker-down   # остановить
make docker-logs   # логи приложения
```

### Вручную

1. Создайте БД и пользователя в PostgreSQL:

```sql
CREATE DATABASE finpilot;
-- пользователь postgres с паролем postgres (или настройте application.yml)
```

2. Соберите и запустите:

```bash
mvn clean package -DskipTests
java -jar target/finpilot-0.0.1.jar
```

Или в режиме разработки:

```bash
mvn spring-boot:run
```

## API

- **Счета:** `GET/POST /api/accounts`, `GET/DELETE /api/accounts/{id}`
- **Транзакции:** `GET/POST /api/transactions`, `GET/DELETE /api/transactions/{id}`
- **Переводы:** `GET/POST /api/transfers`, `GET/DELETE /api/transfers/{id}`
- **Статистика:** `GET /api/stats`
- **AI:**  
  - `POST /api/ai/categorize` — категоризация по описанию  
  - `POST /api/ai/advice` — советы по финансам

Приложение по умолчанию доступно по адресу: **http://localhost:8080**.

## Swagger / OpenAPI

После запуска приложения документация и интерактивный UI доступны по адресам:

- **Swagger UI:** http://localhost:8080/swagger-ui.html  
- **OpenAPI JSON:** http://localhost:8080/v3/api-docs
