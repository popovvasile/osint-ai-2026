---
tags:
  - materials
---

# Гайд: Docker — MindsDB та ArkhamMirror (Linux / macOS)
<!-- course-nav -->
> **Навігація курсу:** **Категорія:** [[03-Матеріали/Довідники/index|Довідники]]



> Короткий довідник для студентів. Детальніше в контексті курсу: Матеріали-Урок-03-Верифікація · ДЗ: ДЗ-03

---

## Що встановити на машину (один раз)

### Linux

1. **Docker Engine** + плагін **Compose** (v2). Пакети залежать від дистрибутива, наприклад Debian/Ubuntu:
   - офіційна інструкція: [Install Docker Engine](https://docs.docker.com/engine/install/)
2. Переконайся, що твій користувач у групі `docker` (щоб не запускати все від `root`):
   - `sudo usermod -aG docker "$USER"` → вийди з сесії й зайди знову.
3. Перевірка: `docker version` та `docker compose version`.

### macOS

1. **Docker Desktop** для Apple Silicon або Intel: [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/).
2. Увімкни **Rosetta** лише якщо потрібно для старих x86-образів (зазвичай не потрібно для цього гайду).
3. Перевірка: `docker version` у Terminal.

> **Чому Docker:** один і той самий стек на ноутбуці студента й на сервері курсу; не потрібно вручну ставити Python-залежності Arkham на хості.

---

## Частина 1 — MindsDB (окремий контейнер)

### Запуск (мінімальний варіант)

```bash
docker pull mindsdb/mindsdb

docker run -d \
  --name mindsdb \
  -p 47334:47334 \
  mindsdb/mindsdb
```

- **Studio / API:** у браузері відкрий `http://127.0.0.1:47334` (або `http://localhost:47334`).
- Логи: `docker logs -f mindsdb`.

### Зупинка / видалення

```bash
docker stop mindsdb
docker rm mindsdb
```

---

## Частина 2 — ArkhamMirror (SHATTERED)

Репозиторій клонуй у зручну папку, наприклад `~/src/ArkhamMirror`.

```bash
cd /шлях/до/ArkhamMirror

# (опційно) скопіюй .env.example у .env і відредагуй паролі / секрети
docker compose up -d --build
```

За замовчуванням з `docker-compose.yml` проєкту:

| Що | Значення (типово) |
|----|---------------------|
| Мережа Docker | `shattered-network` |
| Контейнер Postgres | `shattered-postgres` |
| Контейнер застосунку | `shattered-app` |
| UI + API застосунку | `http://127.0.0.1:8100` |
| Postgres на хості (проброс порту) | `127.0.0.1:5432` |
| Користувач / БД / пароль | з `.env` або дефолти з compose: `arkham` / `arkhamdb` / `arkhampass` |

Перевірка API: `curl -s http://127.0.0.1:8100/api/health` (або інший порт, якщо змінив `APP_PORT`).

---

## Частина 3 — зробити так, щоб **MindsDB** бачив **Postgres Arkham**

Arkham тримає дані в контейнері **`shattered-postgres`** у мережі **`shattered-network`**. Контейнер MindsDB за замовчуванням у **іншій** мережі — тому з MindsDB ім’я `shattered-postgres` **не резолвиться**, поки ти не підключиш MindsDB до тієї ж мережі.

### Крок 1 — Arkham уже запущений

```bash
docker compose -f /шлях/до/ArkhamMirror/docker-compose.yml ps
```

Має бути `healthy` для `postgres` і `running` для `app`.

### Крок 2 — підключи контейнер MindsDB до мережі Arkham

Ім’я мережі в compose Arkham: **`shattered-network`** (поле `name:` у `networks`).

```bash
docker network connect shattered-network mindsdb
```

Перевірка (з хоста):

```bash
docker exec -it mindsdb ping -c 2 shattered-postgres
```

Якщо `ping` недоступний у образі — достатньо перевірити підключення через SQL у MindsDB (нижче).

### Крок 3 — параметри підключення в MindsDB (важливо)

У SQL MindsDB створюється «інтеграція» до Postgres. **Host** має бути саме **DNS-ім’я контейнера Postgres у спільній мережі**:

- **`host = 'shattered-postgres'`** (рекомендовано після `docker network connect`)
- **`port = 5432`**
- **`user` / `password` / `database`** — як у твоєму `.env` Arkham (не публікуй їх у звіті; у прикладі нижче — плейсхолдери)

Приклад (підстав свої значення):

```sql
CREATE DATABASE arkham_pg
WITH ENGINE = 'postgres'
PARAMETERS = {
  "host": "shattered-postgres",
  "port": "5432",
  "database": "arkhamdb",
  "user": "arkham",
  "password": "ТВІЙ_ПАРОЛЬ_З_ENV"
};
```

Потім:

```sql
SHOW DATABASES;
```

Тестовий запит (схеми можуть відрізнятися за версією; якщо помилка — спочатку подивись таблиці в `information_schema`):

```sql
SELECT * FROM arkham_pg.arkham_ingest.jobs LIMIT 10;
```

### Альтернатива (без `docker network connect`)

Якщо Postgres Arkham проброшений на хост **`127.0.0.1:5432`**, можна запустити MindsDB з **`--add-host=host.docker.internal:host-gateway`** (Linux) або використати `host.docker.internal` (macOS Docker Desktop) і в `CREATE DATABASE` вказати **`host: 'host.docker.internal'`**. Це менш надійно при конфліктах портів і кількох інстансах Postgres — для курсу краще **спільна Docker-мережа**.

---

## Частина 4 — LLM для агента MindsDB (опційно)

Щоб у MindsDB працював **AI Agent / чат по даним**, потрібен доступ до LLM API (OpenAI, Anthropic тощо) — ключі задаються в інтерфейсі MindsDB або через змінні середовища згідно [документації MindsDB](https://docs.mindsdb.com/). У навчальному звіті **не вставляй** реальні ключі.

---

## Типові проблеми

| Симптом | Що перевірити |
|---------|----------------|
| `could not translate host name shattered-postgres` | Чи виконано `docker network connect shattered-network mindsdb` |
| `Connection refused` до Postgres | Чи healthy контейнер `shattered-postgres`; чи порт 5432 всередині мережі |
| Два Postgres на 5432 хоста | Конфлікт портів — зміни проброс у compose Arkham або зупини другий Postgres |
| Arkham UI не відкривається | `docker compose logs -f app`; чи порт `8100` вільний |

---

*Оновлено: 2026-04-16*
