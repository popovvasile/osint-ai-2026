---
tags:
  - materials
---

> [[03-Матеріали/Соціальні мережі/Соціальні мережі|SOCMINT]]

| Phone Resources |

- [Cylect](https://cylect.io/)
- Search tool that helps people find specific information across many websites, search engines, and data collectors
- [DetectDee](https://github.com/piaolin/DetectDee)
- Hunt down social media accounts by username, email or phone across social networks.
- [Epsy](https://espysys.com/osint-tools-and-api/)
- Offers a free trial, OSINT Search Tools and API’s
- [Eyecon-app](https://www.eyecon-app.com/)
- Similar to Truecaller. See who’s calling you anytime, anywhere, caller ID and Spam blocking.
- [Get Contact](https://getcontact.com/en/)
- More than 700 million of users all over the world, always know who's calling.
- [GSM Arena](https://www.gsmarena.com/search.php3?)
- Find out what you need to know about a mobile phone of interest or mobile coverage.
- [Have I Been Zuckered](https://haveibeenzuckered.com/)
- Check if your telephone number is present within the Facebook data breach.
- [Indicator Search](https://indicatorsearch.app/)
- Research a number using various sources and API calls.
- [Ignorant](https://github.com/megadose/ignorant)
- Ignorant allows you to check if a phone number is used on different sites like Amazon & Instagram.
- [NumLookup](https://www.numlookup.com/)
- NumLookup can be used to perform a completely free reverse phone lookup for any phone number in the US.
- [PhoneIntel](https://github.com/phoneintel)
- Open-source solution for harnessing the power of phone number intelligence.
- [PhoneValidator](https://www.phonevalidator.com/)
- Validate phone numbers, to assess if they are a landline, mobile or a fake.
- [Phunter](https://github.com/N0rz3/Phunter)
- Phunter is an Osint tool allowing you to find various information via a phone number.
- [Pi-Recon](https://pi-recon.streamlit.app/)
- Use numerous GiTHub tools to present searches in a GUI.
- [Predicta Search](https://www.predictasearch.com/)
- Reverse Phone Lookup.
- [ScamSearch](https://scamsearch.io/)
- Global scam database.
- [Seon](https://seon.io/)
- Seon is a fraud prevention tool that allows you to check an emails, IP or telephone number.
- [This Number](https://www.thisnumber.com/)
- Reverse Phone Lookup.
- [Truecaller](https://www.truecaller.com/)
- Caller ID and Spam Blocking App.









| Methodology |


## 











**1. Початковий аналіз телефонного номера**

Перш ніж використовувати спеціалізовані інструменти, варто провести базовий аналіз номера:

- **Код країни (Country Code):** Визначте країну, до якої належить номер.
- **Код регіону (Area Code):** Визначте регіон або місто.
- **Тип номера:**
    - Стаціонарний (Landline)
    - Мобільний (Mobile)
    - VoIP
- **Провайдер:** Визначте оператора зв'язку.

**Приклад:**
Номер `+1-212-555-1234` вказує на:

- Країну: США (+1)
- Регіон: Нью-Йорк (212)
- Тип: Мобільний

***

## **2. Пошук за допомогою Google Dorks**

Використовуйте спеціальні пошукові запити для точного знаходження інформації:

- `"79521020220"` — пошук точних збігів номера в Інтернеті.
- `"79521020220" site:example.com` — пошук номера на конкретному сайті.
- `"79521020220" site:*.ru` — пошук номера на російських сайтах (або змініть домен для іншої країни).

***

## **3. Інструменти для зворотного пошуку номерів**

### **Онлайн-сервіси:**

- **[Spy Dialer](https://www.spydialer.com/):** Безкоштовний інструмент для визначення власника номера, а також роботи з електронними адресами та фізичними адресами.
- **[Get Contact](https://getcontact.com/):** Дозволяє побачити, як номер записаний у телефонних книгах інших користувачів, а також блокує спам-дзвінки.
- **[Truecaller](https://www.truecaller.com/):** Визначає власника номера та надає профільну інформацію, включаючи фотографію.
- **[Sync.me](https://sync.me/):** Використовується для ідентифікації невідомих дзвінків та блокування небажаних спам-дзвінків.
- **[SEON](https://seon.io/):** Показує технічну інформацію про номер, його тип (мобільний чи стаціонарний), оператора та перевіряє наявність номера в популярних соціальних мережах або месенджерах.
- **[Thatsthem](https://thatsthem.com/):** Пошукова система, яка дозволяє знаходити контактну інформацію, включаючи номери телефонів, адреси та електронні адреси.

### **Інструменти командного рядка (CLI):**

- **PhoneInfoga:** Аналізує номери, визначає провайдера, тип та країну.
- **DetectDee:** Шукає номер у соціальних мережах за username або email.

***

## **4. Пошук у базах даних витоків**

- **[Have I Been Pwned](https://haveibeenpwned.com/):** Перевіряє, чи був номер у витоках даних.
- **[Dehashed](https://dehashed.com/):** Шукає компрометовану інформацію, включаючи номери телефонів, електронні адреси та паролі.
- **[Intelligence X](https://intelx.io/):** Архів витоків даних, який включає телефони, електронні адреси та інше.

***

## **5. Використання функцій відновлення пароля**

Багато сервісів під час відновлення пароля показують частину номера телефону, пов'язаного з обліковим записом. Це може допомогти у визначенні номера, якщо відомий лише email.

**Приклади:**

- **eBay:** Показує перші три та останні дві цифри номера.
- **PayPal:** Показує перші та останні чотири цифри.
- **Yahoo:** Показує перші та останні дві цифри.
- **LastPass:** Показує останні чотири цифри.
- **Google, Facebook, Twitter, Hotmail, Steam:** Показують останні дві цифри.

***

## **6. Автоматизовані інструменти**

- **Lampyre**
- OSINT INDUSTRIES

### **7. Пошук пов'язаних акаунтів і доменів**

Використовуйте телефонний номер для аналізу, чи пов'язаний він із акаунтами на різних платформах або зареєстрованими доменами.

#### **Інструменти:**

- **Whois:** Аналіз доменів, зареєстрованих на номер телефону.
- **Hunter.io:** Пошук email-адрес, пов'язаних із номером телефону.
- **Netlas:** Використовуйте запити типу `domain:*number*`, щоб знайти домени, зареєстровані на номер.

#### **Порада:**

Якщо телефонний номер використовується як ім'я користувача (username), шукайте його через такі сервіси:

- **Sherlock**
- **WhatsMyName**
- **osint.rocks**

***

### **8. Використання соціальних мереж**

Багато соціальних платформ дозволяють шукати облікові записи за телефонним номером. Використовуйте функції пошуку таких платформ, як:

- Facebook
- Instagram
- Twitter
- LinkedIn

#### **Інструменти для аналізу:**

- **Get Contact:** Показує, як номер записаний у контактах інших користувачів.
- **Truecaller:** Надає інформацію про категорію номера (бізнес, особистий тощо).

***

### **9. Використання функцій відновлення пароля**

Спробуйте відновити пароль на популярних сервісах, щоб отримати часткову інформацію про номер.

#### **Приклади:**

- **eBay:** Показує перші три та останні дві цифри номера.
- **PayPal:** Показує перші та останні чотири цифри.
- **Google, Facebook, Twitter:** Показують останні дві цифри.

***

### **10. Використання Telegram-ботів**

Telegram-боти є потужним інструментом для OSINT-аналізу.

#### **Корисні боти:(можуть відпадати - треба завжди актуалізувати)**

1. **@UniversalSearchBot:** Пошук людей за телефоном.
2. **@HowToFindRu_Robot:** Пошук у базах даних витоків.
3. **@SocialSearchBot:** Аналіз акаунтів у соціальних мережах.
4. **@HinterSearch_2bot:** Виявлення імен, адрес та іншої інформації, пов'язаної з номером.

***

### **11.Аналіз у базах даних витоків**

#### **Інструменти:**

1. **[Have I Been Pwned](https://haveibeenpwned.com/):** Шукає, чи потрапляв номер у витоки.
2. **[Dehashed](https://dehashed.com/):** Пошук номерів у компрометованих базах.
3. **[Intelligence X](https://intelx.io/):** Включає дані з витоків, номерів, email і Dark Web.

***

### **12. Автоматизовані інструменти**

#### **Інструменти:**

1. **[Spiderfoot](https://www.spiderfoot.net/):** Автоматизований OSINT-аналіз для збору даних про номер.
2. **[Maltego](https://www.maltego.com/):** Побудова зв'язків між номером і пов'язаними об'єктами (email, IP, домени тощо).

***

### **13. Пошук сусідніх номерів**

Перевіряйте номери-сусіди, змінюючи останні кілька цифр (наприклад, +1234567890 → +1234567891). Це може допомогти виявити додаткові пов'язані акаунти чи користувачів.

***

### 
**14. Локальні бази даних**

Використовуйте місцеві онлайн-довідники для пошуку телефонних номерів. Наприклад:

- **Whitepages**
- **Yellowpages**
- Локальні каталоги компаній та довідники.

***

### **Приклад сценарію аналізу**

**Телефонний номер:** `+44-20-7946-0958`

1. **Контент-аналіз:**
    - Країна: Велика Британія (+44).
    - Регіон: Лондон (20).
2. **Google Dorks:**
    - Запит: `"7946-0958" site:uk` виявив згадки номера у місцевих новинах.
3. **Зворотний пошук:**
    - Використано Thatsthem: виявлено адреси, пов'язані з номером.
4. **Telegram-боти:**
    - UniversalSearchBot виявив акаунти в соціальних мережах.
5. **Аналіз у витоках:**
    - Have I Been Pwned підтвердив, що номер потрапляв у витоки даних.

***

Ця розширена інструкція охоплює всі ключові аспекти OSINT-аналізу телефонних номерів. Використовуйте зазначені інструменти та методи для отримання максимально повної інформації!