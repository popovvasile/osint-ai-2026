# Автоматизація OSINT за допомогою n8n: практичний посібник

**Курс: AI в OSINT**
**Дата: квітень 2026**
Посилання на мій воркфлоу- https://drive.proton.me/urls/WV8D8VTCZG#gCV0M4UCyRPr 
---

## Зміст

1. [Що таке n8n?](#що-таке-n8n)
2. [Встановлення та запуск n8n](#встановлення-та-запуск-n8n)
3. [Огляд workflow](#огляд-workflow)
4. [Workflow 1 — Конвеєр збагачення даних про сутності («My workflow 4»)](#workflow-1--конвеєр-збагачення-даних-про-сутності)
5. [Workflow 2 — OSINT Copilot Production (головний оркестратор)](#workflow-2--osint-copilot-production)
6. [Workflow 3 — Reputation Check Agent (мультисутнісний)](#workflow-3--reputation-check-agent)
7. [Як workflow взаємодіють між собою](#як-workflow-взаємодіють-між-собою)
8. [Сучасні альтернативи: агенти Claude та Hermes](#сучасні-альтернативи-агенти-claude-та-hermes)
9. [Вправи](#вправи)

---

## Що таке n8n?

n8n (вимовляється «nodemation») — це опенсорсна платформа автоматизації workflow з можливістю селфхостингу. За концепцією схожа на Zapier чи Make (раніше Integromat), але створена для розробників, які хочуть мати повний контроль над своїми даними та інфраструктурою.

**Ключові поняття, які потрібно розуміти:**

| Поняття | Значення |
|---|---|
| **Node (вузол)** | Один крок обробки (HTTP-запит, блок коду, виклик AI, умовна гілка тощо) |
| **Workflow** | Орієнтований граф з'єднаних вузлів |
| **Trigger (тригер)** | Вузол, який запускає workflow (webhook, розклад, ручний запуск, інший workflow) |
| **Item (елемент)** | Одна одиниця даних, що проходить конвеєром (аналог рядка або події) |
| **Expression (вираз)** | Динамічні значення всередині параметрів вузла, записуються як `={{ $json.field }}` |
| **Sub-workflow (підробочий процес)** | Один workflow викликає інший workflow як крок |
| **Tool node (вузол-інструмент)** | Вузол, який AI-агент може викликати як інструмент (у стилі LangChain) |

n8n запускає workflow візуально: вузли — це прямокутники на полотні, а з'єднання між ними — стрілки. Дані течуть зліва направо. Кожен вузол отримує елементи, обробляє їх та передає вихідні елементи наступному вузлу.

---

## Встановлення та запуск n8n

### Варіант 1 — Docker (рекомендовано для студентів)

```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

Потім відкрийте **http://localhost:5678** у браузері.

### Варіант 2 — npm

```bash
npm install -g n8n
n8n start
```

### Варіант 3 — n8n Cloud

Зареєструйтеся на **https://app.n8n.cloud** для безкоштовного пробного періоду. Встановлення не потрібне. Добре підходить для швидких експериментів.

### Імпорт workflow

1. Відкрийте n8n у браузері.
2. Натисніть кнопку **+** (праворуч угорі), щоб створити новий workflow.
3. Натисніть меню з трьох крапок → **Import from file** (або вставте JSON).
4. Збережіть workflow через `Ctrl+S`.

### Налаштування облікових даних

Більшість вузлів у цих workflow потребують API-ключів. Перед їх запуском зайдіть у **Settings → Credentials** та додайте:

- **OpenAI API** — для всіх GPT-вузлів
- **Tavily API** — для вузлів вебпошуку
- **Aleph API key** — для пошуку в OCCRP Aleph
- **OpenSanctions API key** — для запитів до бази санкцій

Щоб активувати workflow (аби webhook відповідав на запити), натисніть перемикач **Inactive** у правому верхньому куті.

### Перегляд логів виконання

Після запуску клацніть **Executions** у лівій бічній панелі, щоб побачити кожне виконання, перевірити проміжні дані на кожному вузлі та дебажити помилки.

---

## Огляд workflow

Ці три workflow разом формують повноцінну систему OSINT-дью-ділідженсу:

```
[OSINT Copilot Production]  ←  User query (chat interface)
        │
        ├── calls [My workflow 4]  ← structured database lookup sub-workflow
        │
        └── produces comprehensive OSINT report

[Reputation Check Agent]  ←  List of entity names (independent API)
        └── produces HTML risk report
```

---

## Workflow 1 — Конвеєр збагачення даних про сутності

**Файл:** `My workflow 4.json`
**Роль:** Sub-workflow / перевикористовуваний інструмент

### Що він робить

Отримавши одну цільову сутність (ім'я, тип, країну), цей workflow паралельно запитує чотири структуровані бази даних, нормалізує всі результати та повертає вичерпний профіль сутності у форматі [FollowTheMoney](https://followthemoney.tech/) (FtM).

FollowTheMoney — це стандарт даних, який використовують ICIJ (Panama Papers) та OCCRP для представлення людей, компаній та відносин у розслідуваннях.

### Джерела даних

| Джерело | Що надає |
|---|---|
| **Aleph (OCCRP)** | Злиті датасети, судові записи, бенефіціарні власники, списки PEP. API за адресою `aleph.occrp.org` |
| **OpenSanctions** | Консолідовані санкційні списки (ООН, ЄС, OFAC тощо) з зіставленням сутностей. API за адресою `api.opensanctions.org` |
| **OpenCorporates** | Глобальні дані корпоративного реєстру (реєстраційні номери, директори, статус). |
| **NorthData** | Німецький/європейський бізнес-реєстр з відносинами акціонерів та корпоративними мережами. |

### Покроковий конвеєр

```
[When Executed by Another Workflow]  ← receives: target_name, entity_type, country
        │
[Prepare Data]  ← normalizes entity_type to "Person" or "Company"
        │
        ├──► [Aleph Search]  ──► [Filter Aleph]
        │
        ├──► [OpenSanctions Match]  ──► [Extract OpenSanctions]
        │         └── if match found ──► [OpenSanctions Details]  ──► [Format OpenSanctions]
        │
        ├──► [OpenCorporates API]
        │
        └──► [NorthData API]
                │
[Merge1]  ← waits for all 4 sources
        │
[Split Properties1]  ← JS function that organizes raw data into 4 buckets:
        │                 split_general_info_entities
        │                 split_sanctions_entities
        │                 split_urls_entities
        │                 split_relationships_entities
        │
[Code]  ← deduplication, country normalization, array capping for LLM context
        │
        ├──► [General info]   GPT-4.1-mini  → FtM JSON
        ├──► [Sanctions]      GPT-4.1       → FtM JSON
        ├──► [URLs]           GPT-4.1       → FtM JSON
        └──► [Relationships]  GPT-4.1       → FtM JSON
                │
[Merge]  ← waits for all 4 GPT outputs
        │
[Code4]  ← constructs prompt with Person/Company schema
        │
[Relationships1]  GPT-5.2  ← final merge into single FtM entity object
        │
[Code2]  ← robust JSON parser (handles backslashes, control characters, BOM)
        │
[If]  ← checks if relationships section is non-empty
        │
OUTPUT: complete FtM-formatted entity JSON
```

### Ключові патерни дизайну, на які варто звернути увагу

**Паралельний fan-out:** Workflow одночасно надсилає всі чотири запити до баз даних. n8n зводить їх назад через вузол Merge, налаштований на очікування N входів.

**Умовні гілки:** Шлях OpenSanctions викликає endpoint з деталями лише тоді, коли початкове зіставлення було успішним (`opensanctions_data: true`). Це уникає зайвих API-викликів.

**GPT як форматер даних:** Сирі API-відповіді мають неузгоджені схеми між джерелами. Замість написання складного коду нормалізації workflow подає кожен сегмент даних у модель GPT зі строгим промптом схеми та просить повернути валідний JSON. Це прагматичний патерн для гетерогенних даних.

**Захисний парсинг JSON (вузол Code2):** Кастомна функція `deepParse()` обробляє кілька крайніх випадків: символи BOM, сирі керуючі символи в рядках, Windows-стиль зворотних слешів у шляхах файлів та подвійно-серіалізований JSON. Ця надійність необхідна, коли в ланцюжку є LLM.

---

## Workflow 2 — OSINT Copilot Production

**Файл:** `OSINT Copilot Production.json`
**Роль:** Головний оркестратор, чат-сумісний API

### Що він робить

Це workflow розслідування верхнього рівня. Він приймає запити природною мовою (будь-якою мовою, включно з кирилицею, арабською, китайською), планує дослідження, виконує паралельні вебпошуки та запити до баз даних і створює багатосекційний OSINT-звіт.

### Точка входу

Workflow виставляє HTTP-webhook за адресою:
```
POST /webhook/ddc256e2-69f1-41ab-a369-b0d8ac6df098/chat/completions
```

Шлях, що закінчується на `/chat/completions`, обрано навмисно: він імітує формат OpenAI Chat API, тому будь-який OpenAI-сумісний клієнт (LLM-проксі, кастомні фронтенди) може викликати його без модифікацій.

### Звітування про прогрес

Протягом виконання workflow надсилає оновлення прогресу на `callback_url`, наданий у запиті. Кожен callback виглядає так:
```json
{ "job_id": "...", "type": "progress", "message": "Analyzing user query", "percent": 10 }
```

Це дозволяє асинхронний UX — фронтенд може показувати прогрес-бар, поки конвеєр працює.

### Повний конвеєр

```
[Webhook1]  ← POST /chat/completions
        │
[RemapInput]  ← parses OpenAI message format, extracts:
        │         chatInput (last user message)
        │         userId, job_id, callback_url, filename
        │
[HTTP Callback 10%]  ← notifies client: "Analyzing query"
        │
[Plan the research]  ← GPT agent with "AI Agent Tool" (Tavily web search)
        │               Extracts entity pairs from the query
        │               Supports all scripts (Cyrillic, Arabic, Chinese, Latin)
        │               Returns JSON: [{entity1, entity1_type, entity2, entity2_type, relationship}]
        │
[Structured Output Parser1]  ← validates/auto-fixes GPT JSON output
        │
[Code4]  ← expands entity pairs into individual items,
        │   deduplicates, attaches userId + country
        │
[HTTP Callback 20%]  ← "Generating tasks for further investigation"
        │
[HTTP Request3]  ← Tavily web search per entity (parallel)
        │
[Code2]  ← collapses to single main_relationship item
        │
[HTTP Callback 30%]  ← "Web-searching and scraping"
        │
[More Tavily searches]  ← per search_queries array
        │
[Code5]  ← formats all search results into a single string
        │
[HTTP Callback 40%]  ← "Analyzing found data"
        │
        ├──► [Message a model1]  GPT-4o-search-preview  ← structured web analysis JSON
        │
        └──► [Research agent]  ← GPT agent with API_Converter1 tool
                │                   API_Converter1 calls "My workflow 4" sub-workflow
                │                   Returns FtM entity profile from structured databases
                │
[HTTP Callback 50%]  ← "Checking for sanctions, PEP and red flags"
        │
[Merge1]  ← combines web analysis + sanctions data
        │
[Code9]  ← merges into {query, web_data, sanc_data}
        │
[Analytics Agent]  ← GPT-5.2 with AI_Tool
        │               Writes final multi-section report:
        │               Sanctions, Background, Media, Risks, Biography, Activity
        │               Suggestions section extracted via AI_Tool
        │
[HTTP Callback — completed]  ← posts full report to callback_url
```

### Агент «Plan the research» — багатомовне вилучення сутностей

Цей агент заслуговує на особливу увагу. Його системний промпт ретельно сконструйовано для обробки OSINT-запитів будь-якою мовою:

- Він зберігає оригінальні скрипти: `Владимир Путин` залишається кирилицею, не транслітерується
- Він обробляє ідентифікатори: номер ІПН `7736050003` трактується як сутність
- Він завжди повертає принаймні одну сутність (запити з однією сутністю використовують `SELF_INVESTIGATION` як тип відносин)
- Він викликає `AI Agent Tool` (вебпошук Tavily), щоб доповнити вилучення сутностей вебконтекстом

### Агент «Research Agent» + інструмент API_Converter1

Research Agent отримує системний промпт, який інструктує його викликати `API_Converter1` щоразу. `API_Converter1` налаштовано як **tool node**, який внутрішньо викликає «My workflow 4» як підробочий процес. Саме так n8n дозволяє агентам викликати структуровані workflow як інструменти — агент сам вирішує, коли та як часто це робити.

---

## Workflow 3 — Reputation Check Agent

**Файл:** `Reputation Check Agent — Multi-Entity.json`
**Роль:** Окремий API перевірки репутаційного ризику з виведенням HTML-звіту

### Що він робить

Отримавши список сутностей (імена + типи), цей workflow оцінює репутаційний ризик для кожної, агрегує оцінки, генерує професійний HTML-звіт, публікує його в GitHub Pages через Vercel і надсилає сповіщення в Telegram.

### Точка входу

```
POST /webhook/reputation-check
Body: { "entities": [{ "name": "Company X", "type": "company" }, ...] }
```

### Конвеєр

```
[Webhook]  ← POST /reputation-check
        │
[Init Variables]  ← extracts entities array, sets timestamp
        │
[Split Entities]  ← converts array into individual n8n items (one per entity)
        │
        (loop over each entity)
        │
[Search]  ← Tavily search: "{entity name} reviews reputation complaints news"
        │
[Prepare Entity Data]  ← combines entity metadata + search results
        │
[Analyze entity]  GPT-4.1-mini agent
        │               Scores 0-100, assigns riskLevel (green/yellow/red)
        │               Returns structured JSON:
        │               { entity, riskLevel, riskScore, summary, mentions, risks, recommendation }
        │
[Aggregate Results]  ← collects all entity analyses,
        │               computes average score → overall riskLevel
        │
[Generate Report HTML]  GPT-5-codex agent
        │               Produces complete standalone HTML page with:
        │               - Color theme by risk level (green/yellow/red)
        │               - Header with overall risk badge
        │               - Entity cards with mentions table + risk list
        │               - No external dependencies (fully self-contained HTML)
        │
[Prepare Deploy]  ← generates URL slug, base64-encodes HTML
        │
[GitHub - Push Report]  ← PUT to GitHub API to commit HTML file
        │                   Repository: buzzler0109/reputation-reports
        │
[Wait for Deploy]  ← 30-second pause for Vercel CI/CD to deploy
        │
[Telegram - Notify]  ← sends message with report URL + risk level
        │
[Respond to Webhook]  ← returns: { status: "ok", reportUrl, overallRisk }
```

### Логіка оцінювання ризику

| Діапазон оцінки | Рівень | Значення |
|---|---|---|
| 0–30 | 🟢 Зелений | Немає суттєвих негативних згадок |
| 31–60 | 🟡 Жовтий | Змішані відгуки, незначні занепокоєння |
| 61–100 | 🔴 Червоний | Серйозні скарги, правові питання, звинувачення в шахрайстві |

Загальний ризик — це **середнє** значення оцінок окремих сутностей.

---

## Як workflow взаємодіють між собою

```
User / Frontend
      │
      │  POST /chat/completions
      ▼
┌─────────────────────────────────────┐
│  OSINT Copilot Production           │
│                                     │
│  Plan the research (GPT)            │
│       │                             │
│       ▼                             │
│  Research agent (GPT)               │
│       │ calls tool                  │
│       ▼                             │
│  API_Converter1 ─────────────────► │ ──► My workflow 4
│       │              sub-workflow   │     (Aleph, OpenSanctions,
│       ▼              call           │      OpenCorporates, NorthData)
│  Analytics Agent (GPT)             │
│       │                             │
│       ▼                             │
│  HTTP Callback → final report       │
└─────────────────────────────────────┘

Separately:
User / Frontend
      │
      │  POST /reputation-check
      ▼
┌─────────────────────────────────────┐
│  Reputation Check Agent             │
│  (independent, no sub-workflow)     │
└─────────────────────────────────────┘
```

**Критична точка інтеграції:** Всередині OSINT Copilot Production вузол `API_Converter1` має тип `toolWorkflow`. Це каже LangChain-інтеграції n8n виставити «My workflow 4» як викликний інструмент для Research Agent. Агент бачить його як функцію, яку він може викликати з аргументами `(target_name, entity_type, country)` і отримати у відповідь структуровані дані про сутність. Саме так конвеєр даних стає інструментом в агентній системі.

---

## Сучасні альтернативи: агенти Claude та Hermes

n8n — це потужний візуальний інструмент, але станом на 2025–2026 рік ті самі конвеєри можна будувати безпосередньо в коді за допомогою фреймворків AI-агентів. Ось як виглядає еквівалентна система з **Claude (Anthropic)** та **Hermes** (популярною open-weight моделлю з підтримкою інструкцій).

### Навіщо виходити за межі n8n?

| n8n | Агенти на коді |
|---|---|
| Візуальний, low-code, швидке прототипування | Повністю програмований, легше контролювати версії та тестувати |
| Обмежена логіка розгалужень/циклів | Повний контроль потоку на Python/JS |
| Складно юніт-тестувати окремі вузли | Стандартні фреймворки тестування |
| Добре для стабільних інтеграцій | Краще для складних динамічних конвеєрів |
| Потребує селфхостингу або хмарної підписки | Працює всюди, де працює Python |

Обидва підходи валідні. Для продакшн OSINT-систем поширений гібридний підхід: n8n відповідає за інтеграції та планування; агент на коді — за складні міркування.

---

### Побудова того самого конвеєра з Claude

Вищезазначені workflow природно відображаються на API **tool use** Claude. Ось ескіз архітектури:

```python
import anthropic

client = anthropic.Anthropic()

# Define OSINT tools (equivalent to n8n HTTP Request nodes)
tools = [
    {
        "name": "search_aleph",
        "description": "Search OCCRP Aleph for entities in leaked datasets and PEP lists",
        "input_schema": {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "country": {"type": "string"},
                "entity_type": {"type": "string", "enum": ["Person", "Company"]}
            },
            "required": ["name"]
        }
    },
    {
        "name": "match_opensanctions",
        "description": "Check entity against consolidated sanctions lists (UN, EU, OFAC)",
        "input_schema": {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "country": {"type": "string"},
                "schema": {"type": "string"}
            },
            "required": ["name"]
        }
    },
    {
        "name": "web_search",
        "description": "Search the web via Tavily for news, media, and public records",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string"},
                "max_results": {"type": "integer", "default": 5}
            },
            "required": ["query"]
        }
    }
]

# Tool dispatcher — equivalent to n8n's HTTP Request nodes
def dispatch_tool(tool_name: str, tool_input: dict) -> str:
    if tool_name == "search_aleph":
        return search_aleph(**tool_input)
    elif tool_name == "match_opensanctions":
        return match_opensanctions(**tool_input)
    elif tool_name == "web_search":
        return tavily_search(**tool_input)
    raise ValueError(f"Unknown tool: {tool_name}")

# Agentic loop — equivalent to the "Research agent" node in n8n
def run_osint_investigation(query: str) -> str:
    messages = [{"role": "user", "content": query}]
    
    system_prompt = """You are an OSINT investigator. For any person or company query:
    1. Search structured databases (Aleph, OpenSanctions)
    2. Search the web for news and media coverage
    3. Synthesize findings into a report covering: sanctions, background, risks, relationships
    Always call tools before writing the report. Include source URLs."""

    while True:
        response = client.messages.create(
            model="claude-opus-4-7",  # most capable for complex reasoning
            max_tokens=8096,
            system=system_prompt,
            tools=tools,
            messages=messages
        )
        
        # If Claude wants to use tools, dispatch them
        if response.stop_reason == "tool_use":
            messages.append({"role": "assistant", "content": response.content})
            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    result = dispatch_tool(block.name, block.input)
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result
                    })
            messages.append({"role": "user", "content": tool_results})
        
        # Claude has finished — extract final report
        elif response.stop_reason == "end_turn":
            for block in response.content:
                if hasattr(block, "text"):
                    return block.text
            break
    
    return "Investigation complete."
```

**Що це замінює в n8n:**
- Вузол `Research agent` → агентний цикл `while True`
- Усі вузли `HTTP Request` → функція `dispatch_tool`
- Вузли `Merge` → Claude природно інтегрує результати інструментів у контекст
- Вузли нормалізації `Code` → Claude обробляє гетерогенні формати даних у контексті

### Використання кешування промптів для великих OSINT-контекстів

OSINT-розслідування передбачають великі системні промпти та довгі відповіді інструментів. Кешування промптів Claude суттєво зменшує вартість та затримку:

```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=8096,
    system=[
        {
            "type": "text",
            "text": long_system_prompt,
            "cache_control": {"type": "ephemeral"}  # cache this for 5 minutes
        }
    ],
    tools=tools,
    messages=messages
)
```

---

### Побудова з Hermes (open-weight альтернатива)

[Hermes](https://huggingface.co/NousResearch/Hermes-3-Llama-3.1-70B) (NousResearch Hermes 3, на базі LLaMA 3) — це open-weight модель, донавчена для виконання інструкцій та використання інструментів. Вона працює локально через Ollama або llama.cpp, тобто без API-витрат і без того, щоб дані залишали вашу машину — важливо для чутливих розслідувань.

```python
import ollama

# Pull the model first: ollama pull hermes3:70b
# (smaller option: ollama pull hermes3:8b)

tools = [
    {
        "type": "function",
        "function": {
            "name": "search_aleph",
            "description": "Search OCCRP Aleph database",
            "parameters": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "country": {"type": "string"}
                },
                "required": ["name"]
            }
        }
    },
    # ... same tools as above
]

def run_hermes_investigation(query: str) -> str:
    messages = [
        {
            "role": "system",
            "content": "You are an OSINT investigator. Use your tools to investigate entities thoroughly."
        },
        {
            "role": "user",
            "content": query
        }
    ]

    while True:
        response = ollama.chat(
            model="hermes3:70b",
            messages=messages,
            tools=tools
        )
        
        msg = response["message"]
        messages.append(msg)
        
        if msg.get("tool_calls"):
            for call in msg["tool_calls"]:
                fn = call["function"]
                result = dispatch_tool(fn["name"], fn["arguments"])
                messages.append({
                    "role": "tool",
                    "content": result
                })
        else:
            return msg["content"]
```

**Компроміси Hermes vs Claude:**

| | Hermes (локально) | Claude (API) |
|---|---|---|
| Вартість | Безкоштовно після купівлі обладнання | Оплата за токен |
| Приватність | Дані залишаються локально | Дані передаються до Anthropic |
| Швидкість | Залежить від вашого GPU | Дуже швидко |
| Якість | Сильна, близька до фронтиру | Найкраща у своєму класі |
| Контекстне вікно | 128k токенів | 200k токенів |
| Багатомовність | Добре | Відмінно (усі скрипти) |

Для навчальних занять Hermes 8B на ноутбуці достатньо для навчання. Для продакшн OSINT рекомендується Claude Opus.

---

### Відтворення архітектури повного конвеєра

Ось як трьохворкфлоу-система n8n відображається в кодову архітектуру:

```
n8n Workflow                    →  Code Equivalent
────────────────────────────────────────────────────────────
RemapInput (code node)          →  request parsing function
Plan the research (GPT agent)   →  entity_extractor(query) → list[Entity]
API_Converter1 (sub-workflow)   →  tool function: enrich_entity(name, type, country)
Research agent (GPT agent)      →  research_agent.run(entity)
Analytics Agent (GPT agent)     →  report_writer.run(web_data, sanc_data)
HTTP Callback nodes             →  asyncio events / webhook POSTs
Merge nodes                     →  asyncio.gather() or Promise.all()
Code nodes                      →  plain Python/JS functions
Structured Output Parser        →  Pydantic model validation
```

Продакшн-реалізація на Python виглядатиме так:

```python
import asyncio
from dataclasses import dataclass

@dataclass
class Entity:
    name: str
    entity_type: str  # "Person" or "Company"
    country: str

async def run_investigation(query: str, callback_fn=None) -> str:
    # Phase 1: Extract entities
    if callback_fn: await callback_fn(10, "Analyzing query")
    entities = await extract_entities(query)  # LLM call
    
    # Phase 2: Parallel web search + database enrichment
    if callback_fn: await callback_fn(30, "Searching databases and web")
    web_results, db_results = await asyncio.gather(
        web_search_all(entities),
        asyncio.gather(*[enrich_entity(e) for e in entities])
    )
    
    # Phase 3: Generate report
    if callback_fn: await callback_fn(70, "Writing report")
    report = await write_report(query, web_results, db_results)
    
    if callback_fn: await callback_fn(100, "Complete")
    return report
```

Патерн `asyncio.gather()` точно відтворює патерн fan-out/merge з паралельних гілок n8n.

---

## Вправи

### Вправа 1 — Імпорт та вивчення
Імпортуйте `Reputation Check Agent — Multi-Entity.json` у свій локальний n8n. Замініть API-ключ Tavily та API-ключ OpenAI на свої власні облікові дані. Надішліть тестовий запит:
```bash
curl -X POST http://localhost:5678/webhook/reputation-check \
  -H "Content-Type: application/json" \
  -d '{"entities": [{"name": "Binance", "type": "company"}]}'
```
Перевірте вивід кожного вузла в логах виконання.

### Вправа 2 — Простежте потік даних
Відкрийте `My workflow 4.json` та простежте, що відбувається з однією сутністю:
1. Що повертає API Aleph?
2. Що з цього витягує `Split Properties1`?
3. Як виклик GPT у `General info` це трансформує?
4. Як виглядає фінальний FtM JSON?

### Вправа 3 — Створіть мінімальний Claude tool-use розслідувач
Використовуючи приклад коду з розділу про Claude вище, реалізуйте `search_aleph()` як реальний HTTP-виклик до `https://aleph.occrp.org/api/2/entities`. Виконайте запит: `"Investigate Gazprom"`. Порівняйте вивід з тим, що згенерував би workflow n8n.

### Вправа 4 — Hermes локально
Встановіть Ollama (`curl -fsSL https://ollama.com/install.sh | sh`), завантажте `hermes3:8b` та запустіть скрипт розслідування Hermes для публічної персони. Як якість порівнюється з Claude?

### Вправа 5 — Дизайн архітектури
Workflow OSINT Copilot Production не має пам'яті між сесіями. Спроєктуйте (у псевдокоді чи діаграмі), як би ви додали сесійну пам'ять, щоб система пам'ятала попередні розслідування тієї ж сутності. Подумайте: де б ви її зберігали, як би інжектували та які в цього наслідки для приватності?
