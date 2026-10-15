

| Top Resources |

- [WhatsMyName](https://whatsmyname.app/)
- [osint.rocks](https://osint.rocks/)
- [Analyze.id](https://analyze.id/)
- [Social Analyzer](https://github.com/qeeqbox/social-analyzer)
- [Sherlock](https://github.com/sherlock-project/sherlock)
- [Maigret](https://github.com/soxoj/maigret)




| Username Resources |

- [Blackbird](https://github.com/p1ngul1n0/blackbird)
- [Castrick](https://castrickclues.com/)
- [Checkuser](https://checkuser.org/)
- [Checkusernames](https://checkusernames.com/)
- [CupidCr4wl](https://github.com/OSINTI4L/cupidcr4wl)
- [Cylect](https://cylect.io/)
- [DetectDee](https://github.com/piaolin/DetectDee)
- [Dr Watson](https://github.com/tingirifistik/Watson)
- [Knowem](https://knowem.com/)
- [Inteltechniques](https://inteltechniques.com/tools/Username.html)
- [Legaue of Legends Archiver](https://lolarchiver.com/)
- [Maigret](https://github.com/soxoj/maigret/blob/main/README.md)
- [Myth](https://myth.rip/)
- [Namechk](https://namechk.com/)
- [Namecheckr](https://namecheckr.com/)
- [Nameit](https://seintpl.github.io/NAMINT/)
- [NameMC](https://namemc.com/)
- [Namevine](https://namevine.com/)
- [Nexfil](https://github.com/thewhiteh4t/nexfil)
- [OSINT Quest](https://platform.osintquest.pl/)
- [OSINT-Rocks](https://osint.rocks/)
- [Peek You](https://www.peekyou.com/)
- [Pi-Recon](https://pi-recon.streamlit.app/)
- [Search 0t Rocks](https://search.0t.rocks/)  Currently Down
- [Sherlock](https://github.com/sherlock-project/sherlock)
- [Sherlockeye](https://sherlockeye.io/)
- [Social Searcher](https://www.social-searcher.com/)
- [Tookie-OSINT](https://github.com/Alfredredbird/tookie-osint)
- [UnAvatar](https://unavatar.io/#/)
- [Usersearch](https://usersearch.org/)
- [User Searcher](https://www.user-searcher.com/)
- [WhatsMyName](https://whatsmyname.app/)
- [WhatsMyName Python](https://github.com/C3n7ral051nt4g3ncy/WhatsMyName-Python)

















| Methodology\n |

# **Методологія OSINT для аналізу імен користувачів**




## **1. Початковий аналіз імені користувача**

Перед початком використання інструментів проведіть базовий аналіз імені користувача:

### **Змістовний аналіз (Content Analysis):**

- **Важливі дати:** чи містить ім’я користувача рік або дату, що може вказувати на рік народження чи іншу важливу подію (наприклад, `john1985`).
- **Символіка:** перевірте наявність символів, які можуть мати особливе значення.
- **Номери:** виявлення цифрових значень.
- **Мова та вимова:** чи відповідає ім’я певній мові або має специфічну транскрипцію.
- **Гра слів:** чи можливо змінити/переставити символи, щоб утворити інші значення (наприклад, `l33t` для “leet”).

**Приклад:**
Ім’я користувача: `john_doe1990`.

- Ім’я: John Doe.
- Рік народження: 1990.
- Використаний роздільник: підкреслення (`_`).




## **2. Інструменти для пошуку імен користувачів**

### **Web-додатки:**

1. [WhatsMyName](https://whatsmyname.app/) — пошук акаунтів на 669 сайтах.
2. [UserSearch](https://usersearch.org/) — пошук акаунтів та соціальних зв’язків.

### **Інструменти командного рядка (CLI):**

1. [Sherlock](https://github.com/sherlock-project/sherlock) — аналіз акаунтів на 400+ платформах.
2. [Maigret](https://github.com/soxoj/maigret) — перевірка понад 3000 сайтів.
3. [WhatsMyName CLI](https://github.com/WebBreacher/WhatsMyName) — альтернатива для командного рядка.




## **3. Генерація варіантів імені користувача**

### **Інструменти:**

1. **NAMINT:** автоматична генерація варіантів імені користувача на основі імені, прізвища чи інших параметрів.(https://seintpl.github.io/NAMINT/)
2. **[Username Generation Guide](https://github.com/soxoj/username-generation-guide):** керівництво для створення можливих варіантів імен.





## **4. Пошук імені в IP-пошукових системах**

### **Приклади запитів у Shodan:**

- `http.html:username` — пошук у HTML-коді.
- `http.title:username` — пошук у заголовках сторінок.

### **Приклади запитів у Netlas:**

- `http.title:username`
- `http.body:username`
- `http.meta:username`
- `uri:*username*`

**Примітка:** подібні запити можна використовувати у Censys, ZoomEye, Onyphe, Fofa.




## **5. Пошук у Google**

### **Приклади запитів:**

- `intitle:username`
- `inurl:username`
- `username filetype:xls` — пошук Excel-файлів.
- `username filetype:xlsx`
- `username filetype:sql` — пошук SQL-файлів.

**Інструмент для автоматизації:**
[Marple](https://github.com/soxoj/marple) — для автоматизації пошуку через Google.




## **6. Аналіз доменів**

### **Інструменти:**

1. [Whois](https://who.is/) — перевірка доменів, зареєстрованих на ім’я користувача.
2. **Netlas:** `domain:*nickname*` — пошук доменів.




## **7. Моніторинг соціальних мереж**

### **Інструменти:**

1. [Social-Searcher](https://social-searcher.com/) — пошук згадок у соціальних мережах.
2. [BrandMentions](https://brandmentions.com/) — аналіз згадок за останні 7 днів (безкоштовно).

**Примітка:** не забудьте використовувати внутрішні пошукові системи соціальних мереж.




## **8. Пошук зображень**

- Використовуйте **Google Images** для зворотного пошуку зображень.
- Перевірте аватари, пов’язані з іменем користувача, у соціальних мережах.




## **9. Аналіз публічних ключів (PGP)**

### **Інструменти:**

1. Пошук публічних ключів через [Keybase](https://keybase.io/).
2. Використання спеціалізованих пошукових систем для PGP.




## **Приклад практичного сценарію**

### **Ім’я користувача:** `jane_doe1985`

1. **Базовий аналіз:**
    - Ім’я: Jane Doe.
    - Рік: 1985.
2. **Пошук акаунтів:**
    - Використати WhatsMyName для перевірки 669 сайтів.
    - Використати Maigret для аналізу на 3000+ платформах.
3. **IP-аналіз:**
    - Shodan: `http.html:jane_doe1985`.
4. **Google-запити:**
    - `intitle:jane_doe1985`.
    - `jane_doe1985 filetype:sql`.
5. **Соціальні мережі:**
    - Social-Searcher для пошуку згадок у Twitter та Facebook.
6. **Додатково:**
    - Пошук аватарів через Google Images.
    - Аналіз публічних ключів у Keybase.




Ця інструкція охоплює ключові аспекти OSINT для аналізу імен користувачів. Використовуйте всі вказані інструменти для отримання детальної інформації!