# CTI Кейс: Аналіз фішингової кампанії

> Навчальний кейс для [[Урок-08-Воркшоп]] | Тип: Cyber Threat Intelligence

---

## Сценарій

Отримано сповіщення: фішинговий домен `secure-bank-ua[.]com` імітує інтерфейс банківської системи. Завдання: атрибутувати кампанію, визначити масштаб і рекомендувати заходи.

---

## Методологія CTI-OSINT

### Крок 1: Аналіз домену

```bash
# WHOIS
whois secure-bank-ua.com

# DNS lookup
dig secure-bank-ua.com ANY

# Сертифікати (subdomains!)
curl -s "https://crt.sh/?q=secure-bank-ua.com&output=json" | jq '.[] | .name_value'

# Shodan пошук за IP
bash scripts/exa.sh search "site:shodan.io ip:X.X.X.X"
```

### Крок 2: Зв'язані домени

```bash
# Знайти інфраструктуру що використовує той самий IP
bash scripts/brightdata.sh scrape "https://viewdns.info/reverseip/?host=IP&apiresponse=XML"

# VirusTotal для зв'язаних індикаторів
# ThreatFox для IoC
```

### Крок 3: Attribution OSINT

```bash
# Пошук email з WHOIS у витоках
bash scripts/exa.sh search "whois email атрибуція"

# Пошук нікнейму розробника
python3 scripts/sherlock <nickname_from_registration>
```

---

## Артефакти для розслідування

| IoC | Тип | Значення |
|-----|-----|---------|
| secure-bank-ua[.]com | Домен | Фішинговий |
| [IP буде тут] | IP | C2 сервер |
| [Email буде тут] | Email | Реєстратор |

---

## Граф зв'язків

```
[Фішинговий домен] --реєстрація--> [Email реєстратора]
[Email] --пов'язаний--> [Інші домени?]
[IP] --хостить--> [Інші сайти?]
```

---

## Шаблон для заповнення студентами

1. Знайдіть реальний (або навчальний) фішинговий домен на PhishTank або OpenPhish
2. Застосуйте методологію вище
3. Заповніть [[Шаблон-кейсу]]
4. Визначте Attribution (Grade A/B/C/D)

---

## Корисні ресурси CTI

- [VirusTotal](https://virustotal.com) — аналіз файлів і URL
- [Shodan](https://shodan.io) — пошук пристроїв і серверів
- [crt.sh](https://crt.sh) — certificate transparency log
- [ThreatFox](https://threatfox.abuse.ch) — IoC база
- [PhishTank](https://phishtank.org) — фішингова база
- [ViewDNS](https://viewdns.info) — reverse IP, WHOIS
