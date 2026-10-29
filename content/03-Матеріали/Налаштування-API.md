---
tags:
  - materials
---

# Налаштування API-ключів для AI-OSINT 2026
> [[03-Матеріали/Довідники/index|Довідники]]

> Покроковий гайд для студентів курсу

---

## Загальний принцип

Свої API-ключі зберігайте в змінних середовища на своєму комп’ютері або в облікових даних вашого n8n (**Settings → Credentials**). Не вписуйте їх у скрипти, нотатки чи скріни, які здаєте чи показуєте іншим.

```bash
# Додайте до ~/.bashrc або ~/.zshrc
export PERPLEXITY_API_KEY="pplx-..."
export EXA_API_KEY="exa-..."
export APIFY_API_TOKEN="apify_api_..."
export JINA_API_KEY="jina_..."
export TAVILY_API_KEY="tvly-..."
export PARALLEL_API_KEY="..."
export BRIGHTDATA_MCP_URL="https://mcp.brightdata.com/..."
# Якщо запускаєте OSINT Copilot у своєму n8n — дозволені хости для callback:
# export CALLBACK_URL_ALLOWED_HOSTS="api.example.com"

# Перезавантажити:
source ~/.bashrc
```

### Короткі поради

- Ключі оформлюйте собі самі в кабінетах сервісів (Jina, Apify, Tavily тощо); у матеріалах курсу стоять лише приклади формату (`pplx-...`, `YOUR_…`).
- Після імпорту workflow у свій n8n підставте ключі через Credentials, а не прямо в текст вузлів.
- Не надсилайте ключі в чат курсу, у домашку чи в спільні документи. Якщо ключ уже світився — згенеруйте новий у кабінеті сервісу.

---

## Безкоштовні API (почніть з них)

### Jina AI
**Безкоштовно:** 1M токенів/місяць  
**Отримати:** jina.ai/api-key  
**Можливості:** читання URL у Markdown, пошук, DeepSearch

```bash
# Тест
curl -H "Authorization: Bearer $JINA_API_KEY" \
     "https://r.jina.ai/https://example.com"
```

### Apify
**Безкоштовно:** ~$5 кредитів/місяць  
**Отримати:** console.apify.com → Settings → Integrations  
**Можливості:** 55+ акторів, Instagram, TikTok, YouTube, LinkedIn

```bash
# Тест
bash skills/osint/scripts/diagnose.sh
```

### Parallel AI
**Безкоштовно:** реєстрація на platform.parallel.ai  
**Можливості:** AI-пошук з reasoning і цитатами

---

## Рекомендовані платні (~$5/міс кожен)

### Perplexity API
**Отримати:** perplexity.ai/settings/api  
**Можливості:** Sonar (швидкі AI-відповіді), Deep Research

```bash
# Тест
bash skills/osint/scripts/perplexity.sh sonar "Test query"
```

### Exa AI
**Отримати:** dashboard.exa.ai  
**Можливості:** семантичний пошук, people/company research, crawl

```bash
# Тест
bash skills/osint/scripts/exa.sh search "OSINT tools 2026"
bash skills/osint/scripts/exa.sh people "John Doe"
```

### Tavily
**Отримати:** app.tavily.com  
**Ціна:** $0.005/запит базовий  
**Можливості:** agent-optimized search, extract URL content

```bash
# Тест
bash skills/osint/scripts/tavily.sh search "OSINT 2026"
```

---

## Просунутий рівень

### Bright Data MCP
**Отримати:** brightdata.com/products/web-scraper/mcp  
**Ціна:** від $10/міс  
**Можливості:** CAPTCHA bypass, Facebook, LinkedIn deep, Yandex

```bash
export BRIGHTDATA_MCP_URL="https://mcp.brightdata.com/..."

# Тест
bash skills/osint/scripts/brightdata.sh scrape "https://example.com"
```

---

## Перевірка налаштувань

```bash
# Запустити повну діагностику
bash skills/osint/scripts/diagnose.sh

# Очікуваний результат:
# ✓ curl
# ✓ python3
# ✓ jq
# ✓ node
# ✓ JINA_API_KEY
# ✓ APIFY_API_TOKEN
# ✓ PERPLEXITY_API_KEY (якщо є)
# ✓ EXA_API_KEY (якщо є)
```

---

## Мінімальний стартовий набір

Для проходження курсу достатньо:
1. Jina API (безкоштовно) — читання URL
2. Apify (безкоштовно, $5 кредитів) — соцмережі
3. Google Alerts (безкоштовно) — моніторинг

Решта — за бажанням для глибшого дослідження.
