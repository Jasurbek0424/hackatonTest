# FinPilot

**FinPilot** — личное приложение для учёта финансов с поддержкой нескольких счетов, транзакций, переводов и AI-советов на базе Claude (Anthropic).

---

## Содержание

- [Описание](#описание)
- [Технологии](#технологии)
- [Структура проекта](#структура-проекта)
- [Требования](#требования)
- [Установка и запуск](#установка-и-запуск)
- [Функциональность](#функциональность)
- [API](#api)
- [Конфигурация](#конфигурация)

---

## Описание

FinPilot позволяет:

- **Управлять счетами** — карты (Uzcard, Humo), наличные в UZS и USD
- **Учитывать доходы и расходы** — по категориям (еда, транспорт, здоровье, развлечения, счета, образование и др.)
- **Делать переводы** между счетами
- **Смотреть статистику** — общий баланс, доходы/расходы, разбивка по категориям (в т.ч. круговые диаграммы)
- **Получать AI-советы** — краткие рекомендации по финансам на основе ваших транзакций (при наличии API-ключа Anthropic)
- **Автоматически определять категорию** расхода по описанию (AI или эвристики)

При первом запуске бэкенд создаёт демо-данные: счета и примеры транзакций.

---

## Технологии

| Часть      | Стек |
|-----------|------|
| **Backend** | Java 21, Spring Boot 3.2, Spring Data JPA, Spring WebFlux, PostgreSQL, Lombok |
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS, Recharts, Axios, react-hot-toast, react-icons |
| **AI**       | Anthropic API (Claude) — опционально |

---

## Структура проекта

```
├── backend/                    # Spring Boot API
│   ├── src/main/java/com/finapp/
│   │   ├── FinAppApplication.java
│   │   ├── ai/                 # AI-сервис (категоризация, советы)
│   │   ├── config/             # CORS, инициализация данных
│   │   ├── controller/         # REST-контроллеры
│   │   ├── dto/
│   │   ├── entity/             # Account, Transaction, Transfer
│   │   ├── repository/
│   │   └── service/
│   └── src/main/resources/
│       └── application.yml
│
├── frontend/                   # Next.js SPA
│   ├── src/
│   │   ├── app/                # Страницы (dashboard, accounts, add-income, add-expense, transfers)
│   │   ├── components/         # UI-компоненты, формы, графики
│   │   ├── services/           # API-клиент (api.ts)
│   │   └── types/              # TypeScript-типы
│   └── package.json
│
└── README.md
```

---

## Требования

- **Java 21**
- **Maven 3.6+**
- **Node.js 18+** и npm
- **PostgreSQL** (например 14+)

---

## Установка и запуск

### 1. База данных PostgreSQL

Создайте БД и пользователя:

```bash
createdb finpilot
# или в psql:
# CREATE DATABASE finpilot;
```

В `backend/src/main/resources/application.yml` по умолчанию:

- URL: `jdbc:postgresql://localhost:5432/finpilot`
- Логин: `postgres`
- Пароль: `postgres`

При необходимости измените эти параметры или задайте их через переменные окружения/профили Spring.

### 2. Backend

```bash
cd backend
./mvnw spring-boot:run
```

Или через установленный Maven:

```bash
cd backend
mvn spring-boot:run
```

Сервер будет доступен на **http://localhost:8080**. API — по префиксу `/api`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Приложение откроется на **http://localhost:3000**.

### 4. (Опционально) AI-функции

Для категоризации и советов через Claude задайте API-ключ Anthropic:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

Или в `application.yml`:

```yaml
anthropic:
  api-key: ваш_ключ
```

Без ключа категоризация работает по встроенным правилам (по ключевым словам в описании), а кнопка «AI Financial Advice» выдаст сообщение о необходимости задать ключ.

---

## Функциональность

- **Dashboard** — сводка (доходы, расходы, баланс), круговые диаграммы по категориям, последние транзакции, кнопка «AI Financial Advice».
- **Accounts** — список счетов, создание и удаление.
- **Add Expense / Add Income** — добавление расхода/дохода с выбором счёта и категории; при расходах можно использовать AI-категоризацию по описанию.
- **Transfers** — переводы между счетами с обновлением балансов.

Демо-данные при первом запуске включают счета (Uzcard, Humo, Cash, USD Cash) и примеры транзакций.

---

## API

Базовый URL: `http://localhost:8080/api`.

| Метод | Путь | Описание |
|-------|------|----------|
| GET   | `/accounts`        | Список счетов |
| GET   | `/accounts/{id}`   | Счёт по ID |
| POST  | `/accounts`        | Создать счёт |
| DELETE| `/accounts/{id}`   | Удалить счёт |
| GET   | `/transactions`    | Список транзакций (опционально: type, category, from, to) |
| POST  | `/transactions`    | Создать транзакцию |
| DELETE| `/transactions/{id}` | Удалить транзакцию |
| GET   | `/transfers`       | Список переводов |
| POST  | `/transfers`       | Создать перевод |
| GET   | `/stats`           | Агрегированная статистика |
| GET   | `/stats/monthly`   | Статистика по месяцам |
| POST  | `/ai/categorize`   | Определить категорию по описанию (body: `{ "description": "..." }`) |
| POST  | `/ai/advice`       | Получить текстовый AI-совет по транзакциям |

---

## Конфигурация

### Backend (`application.yml`)

- `server.port` — порт (по умолчанию 8080).
- `spring.datasource.*` — параметры подключения к PostgreSQL.
- `spring.jpa.hibernate.ddl-auto` — режим схемы (по умолчанию `update`).
- `anthropic.api-key` — ключ Anthropic (или переменная `ANTHROPIC_API_KEY`).

### Frontend

В `frontend/src/services/api.ts` задан `baseURL: 'http://localhost:8080/api'`. Для другого хоста/порта измените его или вынесите в переменную окружения.

---

## Лицензия

Проект представлен «как есть», без явной лицензии — уточняйте у автора при повторном использовании.
