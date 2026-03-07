# Деплой FinPilot Backend на сторонние хосты

Что нужно подготовить и какие есть варианты развёртывания.

---

## Что потребуется в любом случае

### 1. База данных PostgreSQL

- **Хостинг БД:** свой сервер, либо управляемый сервис:
  - [Supabase](https://supabase.com) (есть бесплатный tier)
  - [Neon](https://neon.tech)
  - [Railway](https://railway.app)
  - [Render](https://render.com) — PostgreSQL
  - [DigitalOcean Managed Databases](https://www.digitalocean.com/products/managed-databases-postgresql)
  - AWS RDS, Google Cloud SQL и т.п.
- Нужны: **URL** (например `jdbc:postgresql://host:5432/dbname`), **логин**, **пароль**.

### 2. Переменные окружения

На хосте, где крутится приложение, задайте:

| Переменная | Обязательно | Описание |
|------------|-------------|----------|
| `SPRING_DATASOURCE_URL` | да* | URL БД, напр. `jdbc:postgresql://db-host:5432/finpilot` |
| `SPRING_DATASOURCE_USERNAME` | да* | Пользователь PostgreSQL |
| `SPRING_DATASOURCE_PASSWORD` | да* | Пароль PostgreSQL |
| `ANTHROPIC_API_KEY` | для AI | Ключ API Anthropic (категоризация, советы) |
| `SERVER_PORT` | нет | Порт приложения (по умолчанию 8080) |
| `CORS_ALLOWED_ORIGINS` | нет | Разрешённые origins для CORS через запятую (по умолчанию `http://localhost:3000`) |
| `SWAGGER_UI_ENABLED` | нет | Включить Swagger UI, `true`/`false` (по умолчанию `true`) |

\* Для локальной разработки есть значения по умолчанию в `application.yml`.

Spring Boot подхватывает эти переменные автоматически, менять `application.yml` не обязательно.

### 3. Среда выполнения

- **Вариант A:** Java 21 (JRE достаточно) — если запускаете JAR.
- **Вариант B:** Docker — если деплоите образ (рекомендуется на VPS/серверах).

---

## Варианты деплоя

### A. Docker (VPS, свой сервер)

Подходит для: VPS (DigitalOcean, Timeweb, Selectel, любой Linux с Docker).

1. Установите на сервер Docker и Docker Compose.
2. Поднимите PostgreSQL отдельно (или используйте управляемую БД) и получите URL/логин/пароль.
3. Клонируйте репозиторий, в каталоге `backend` создайте `.env` (или задайте переменные в системе):

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://ВАШ_ХОСТ_БД:5432/finpilot
SPRING_DATASOURCE_USERNAME=user
SPRING_DATASOURCE_PASSWORD=password
ANTHROPIC_API_KEY=sk-...
```

4. Запустите только приложение (без контейнера БД) через отдельный compose-файл:

```bash
# .env с переменными SPRING_DATASOURCE_URL, USERNAME, PASSWORD, ANTHROPIC_API_KEY
docker compose -f docker-compose.prod.yml --env-file .env up -d
```

Либо соберите образ и запускайте контейнер вручную, передавая переменные через `-e` или `--env-file`.

### B. JAR на VPS (systemd)

Подходит для: VPS с установленной Java 21.

1. Соберите JAR: `mvn clean package -DskipTests`.
2. Скопируйте `target/finpilot-0.0.1.jar` на сервер.
3. Создайте unit systemd (например `/etc/systemd/system/finpilot.service`):

```ini
[Unit]
Description=FinPilot Backend
After=network.target

[Service]
Type=simple
User=app
WorkingDirectory=/opt/finpilot
Environment="SPRING_DATASOURCE_URL=jdbc:postgresql://..."
Environment="SPRING_DATASOURCE_USERNAME=..."
Environment="SPRING_DATASOURCE_PASSWORD=..."
Environment="ANTHROPIC_API_KEY=..."
ExecStart=/usr/bin/java -jar /opt/finpilot/finpilot-0.0.1.jar
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

4. Включите и запустите: `systemctl enable --now finpilot`.

### C. PaaS (Railway, Render, Fly.io и т.п.)

Подходит для: быстрый деплой без настройки сервера.

- Обычно подключаете репозиторий, указываете корень приложения (`backend`), платформа сама собирает образ или JAR.
- В настройках сервиса добавляете переменные окружения (см. таблицу выше).
- Базу PostgreSQL создаёте в том же PaaS или подключаете внешнюю (Supabase, Neon) и подставляете её URL в `SPRING_DATASOURCE_URL`.

На таких платформах часто нужно явно указать порт приложения (например `PORT` или `SERVER_PORT`), если он отличный от 8080 — смотрите документацию хостинга.

---

## Чек-лист перед деплоем

- [ ] PostgreSQL доступна с хоста, где будет работать приложение (открыт порт, нет блокировки firewall).
- [ ] Заданы `SPRING_DATASOURCE_*` (или в `application.yml` на сборке).
- [ ] Пароли и ключи заданы через переменные окружения, не закоммичены в репозиторий.
- [ ] Если перед приложением стоит nginx/другой прокси — настроен проксирование на порт приложения (8080 по умолчанию).
- [ ] Для продакшена: включить HTTPS (сертификат на прокси или через платформу).
- [ ] При необходимости: отключить или ограничить Swagger UI в продакшене (см. раздел ниже).

---

## Опционально: отключить Swagger в продакшене

Если не хотите светить документацию API снаружи, задайте переменную окружения:

```bash
SWAGGER_UI_ENABLED=false
```
