---
tags:
  - materials
---

> [[03-Матеріали/Соціальні мережі/Соціальні мережі|SOCMINT]]

| Top Resources |

- [Epios](https://epieos.com/)
- [Osint Industries](https://osint.industries/)
- [Lampyre](https://lampyre.io/) 




| Email Resources |

- [Any Mail Finder](https://anymailfinder.com/)
- [Avatar Search](https://avatarapi.com/)
- [Black Kite](https://services.blackkitetech.com/data-breach)
- [Blackbird](https://github.com/p1ngul1n0/blackbird)
- [Castrick](https://castrickclues.com/)
- [Cylect](https://cylect.io/)
- [Dehashed](https://dehashed.com/)
- [DetectDee](https://github.com/piaolin/DetectDee)
- [Digital Footprint Check](https://digitalfootprintcheck.com/free-checker.html)
- [Email Dossier](https://centralops.net/co/emaildossier.aspx)
- [Email Hippo](https://tools.emailhippo.com/)
- [Email Rep](https://emailrep.io/)
- [Epios](https://epieos.com/)
- [Epsy](https://espysys.com/osint-tools-and-api/)
- [Experte](https://www.experte.com/email-finder)
- [Eyes](https://github.com/N0rz3/Eyes)
- [F-Secure](https://f-secure.com/us-en/identity-theft-checker)
- [Flickr](https://flickr.com/search/)
- [GHunt](https://github.com/mxrch/GHunt)
- [GMail OSINT](https://gmail-osint.activetk.jp/)
- [Gravatar](https://en.gravatar.com/site/check/)
- [Haveibeenpwned](https://haveibeenpwned.com/)
- [Hudson Rock Cybercrime Intelligence Tools](https://www.hudsonrock.com/threat-intelligence-cybercrime-tools)
- [Haveibeensold](https://haveibeensold.app/)
- [Hawker](https://github.com/RetrO-M/Hawker)
- [Holehe](https://github.com/megadose/holehe)
- [Hunter.io](https://hunter.io/)
- [Indicator Search](https://indicatorsearch.app/)
- [Leak Check](https://leakcheck.io/)
- [Leak Lookup](https://leak-lookup.com/)
- [Leap](https://www.tryleap.ai/tools/lead-research)
- [Lol Archiver](https://osint.lolarchiver.com/database_lookup)
- [Myth](https://myth.rip/)
- [OCCRP Aleph](https://data.occrp.org/)
- [Omail](https://omail.io/)
- [Osinty](https://osint.ly/)
- [OSINT Quest](https://platform.osintquest.pl/)
- [OSINT-Rocks](https://osint.rocks/)
- [Peek You](https://www.peekyou.com/)
- [Pi-Recon](https://pi-recon.streamlit.app/)
- [Postal](https://github.com/jakecreps/poastal)
- [Predicta Search](https://www.predictasearch.com/)
- [ScamSearch](https://scamsearch.io/)
- [Seon](https://seon.io/)
- [Sherlockeye](https://sherlockeye.io/)
- [Skymem](https://www.skymem.info/)
- [Spytox](https://www.spytox.com/)
- [Synapsint](https://synapsint.com/)
- [That's Them](https://thatsthem.com/)
- [Whoisology](https://whoisology.com/email/)
- [Whoxy](https://www.whoxy.com/)
- [X-OSINT](https://github.com/TermuxHackz/X-osint)
- [Zehef](https://github.com/N0rz3/Zehef)







| Methodology\n |



# 
**Методологія OSINT для аналізу електронної пошти**


### **1. Базовий аналіз структури email**

- **Витяг даних:**
    - **TLD (Top-Level Domain):** Визначення географічного або організаційного контексту (наприклад, `.com`, `.ua`, `.org`).
    - **Домен:** З’ясування приналежності до організації або платформи.
    - **Імена та дати:** Виявлення імені, можливих дат народження (рік, дата створення).
    - **Символи:** Аналіз чисел або символів у адресі (наприклад, дата або рік народження).

**Приклад:**
Email: `john.doe1990@gmail.com`.

- **TLD:** Gmail (популярний поштовий сервіс).
- **Ім'я:** John Doe.
- **Рік:** 1990 (можливий рік народження).

***

### **2. Перевірка реєстрацій на платформах**

- **Інструменти:**
    - **[Holehe](https://github.com/megadose/holehe):** Перевіряє наявність email на популярних платформах (соціальні мережі, сервіси).
    - **[Zehef](https://github.com/NOrz3/Zehef):** Альтернативний інструмент для пошуку реєстрацій.
    - **osint.industries**, **epieos.com** – допоміжні сервіси.

**Приклад:**
Введіть email `example@gmail.com`, і Holehe покаже список платформ, де цей email зареєстрований.

***

### **3. Перевірка в витоках данних**

- **Інструменти:**
    - **[BreachDirectory.org](https://breachdirectory.org/):** Перевірка на участь email в утечках даних.
    - **[Have I Been Pwned](https://haveibeenpwned.com/):** Альтернативний ресурс для перевірки.

**Приклад:**
Email `test@example.com` може бути знайдений у витоках LinkedIn, де розкрилися паролі та адреси.

***

### **4. Пошук PGP-ключів**

- **Інструменти:**
    - **[Keybase.io](https://keybase.io/):** Пошук PGP-ключів, пов’язаних із email.
    - **Public PGP Key Search:** Відкриті сервіси пошуку ключів.

**Приклад:**
Email `crypto.user@example.com` знаходиться в Keybase із криптографічним публічним ключем.

***

### **5. Аналіз заголовків email**

- **Інструменти:**
    - **[WhatMail](https://github.com/z0m31en7/WhatMail):** Аналіз заголовків (ідентифікація серверів та IP-адреси відправника).
    - Інші інструменти для розбору SPF, DKIM, DMARC.

**Приклад:**
Аналіз заголовків email показує, що лист відправлено через сервер у США.

***

### **6. Аватари та соціальні профілі**

- **Інструменти:**
    - **[unavatar.io](https://unavatar.io/):** Витяг аватара за email.
    - **Google Reverse Image Search:** Пошук аватарів у мережі.

**Приклад:**
Email `example@gmail.com` пов’язаний із аватаром, який можна знайти через Google Images.

***

### **7. Пошук у публічних реєстрах та WHOIS**

- **Інструменти:**
    - **[WhoisXML](https://www.whoisxmlapi.com/):** Розширений аналіз реєстрацій домену.
    - **reversewhois.io:** Пошук доменів, зареєстрованих на email.

***

### **8. Аналіз вкладень та посилань**

- **Інструменти:**
    - **[VirusTotal](https://virustotal.com/):** Аналіз файлів і посилань на наявність шкідливого коду.
    - **[Hybrid-Analysis](https://hybrid-analysis.com/):** Глибокий аналіз файлів.

***

### **9. Використання email як імені користувача**

- Пошук email як username на форумах, платформах для розробників (GitHub), ігрових сайтах.

***

### **10. Аналіз .MBOX файлів**

- **Інструмент:**
    - **[MAILTO Analyzer](https://github.com/soxoj/mailto_analyzer):** Аналіз експорту поштових скриньок.

***

### **11. Використання пошукових систем**

- **Пошук:**
    - Використовуйте Google для пошуку по email.
    - Google Images для перевірки зображень.

***

### **12. Символізм та зв’язки**

- Вивчайте числа, символи та можливі патерни у адресі.
- Аналізуйте соціальні зв’язки через **[usersearch.ai](https://usersearch.ai/)**.

***

## **Приклад сценарію аналізу**

### **Email:** `john.doe1990@gmail.com`

1. **Базовий аналіз:**
    - Витягнути імена, можливі дати та домен.
2. **Перевірка реєстрацій:**
    - Використати Holehe, щоб знайти акаунти на соціальних платформах.
3. **Перевірка в утечках:**
    - BreachDirectory.org показує утечки з LinkedIn.
4. **PGP-ключі:**
    - Keybase.io надає публічний ключ.
5. **Заголовки:**
    - WhatMail показує сервери та IP.
6. **Соціальні зв’язки:**
    - Unavatar.io виявляє аватар користувача.
7. **Додатковий аналіз:**
    - Використати VirusTotal для перевірки підозрілих вкладень.

Ця методологія покриває всі ключові аспекти OSINT для email, дозволяючи побудувати детальний профіль і виявити потенційні ризики.