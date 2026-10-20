---
tags:
  - materials
---

<!-- course-nav -->
> **Навігація курсу:** **Категорія:** [[03-Матеріали/Соціальні мережі/Соціальні мережі|SOCMINT]]


## 1. **Platform-Specific OSINT Workflows & Diagrams**

### **Twitter**

- [OSINT Dojo Twitter Diagram](https://www.osintdojo.com/diagrams/twitter)
    
- [Twint (Twitter scraping tool, GitHub)](https://github.com/twintproject/twint)
    
### **Tumblr**

- [OSINT Dojo Tumblr Diagram](https://www.osintdojo.com/diagrams/tumblr)
    

### **Discord**

- [OSINT Dojo Discord Diagram](https://www.osintdojo.com/diagrams/discord)
    

### **Mastodon**

- [OSINT Dojo Mastodon Diagram](https://www.osintdojo.com/diagrams/mastodon)
    

### **YouTube**

- [OSINT Dojo YouTube Diagram](https://www.osintdojo.com/diagrams/youtube)
    
- [Hackers-Arise: Unmasking YouTube with OSINT Tools](https://hackers-arise.com/open-source-intelligence-osint-unmasking-youtube-with-osint-tools/)
    
- [Aware Online: YouTube Search Tool](https://www.aware-online.com/en/osint-tools/youtube-search-tool/)
    
- [Mattw.io: YouTube GeoFind](https://mattw.io/youtube-geofind/location)
    
- [FindYouTubeVideo (TheTechRobo)](https://findyoutubevideo.thetechrobo.ca/)
    

### **Twitch**

- [Untwitch (Download Twitch Videos)](https://untwitch.com/?source=post_page-----7c494fcfe0bc---------------------------------------)
    
- [TwitchTracker (Twitch Channel Stats)](https://twitchtracker.com/?source=post_page-----7c494fcfe0bc---------------------------------------)
    

---

## 2. **General OSINT Methodology, Guides, and Articles**

- [OSINTTeam: Step-by-step OSINT Roadmap for Investigating Videos](https://osintteam.blog/step-by-step-osint-roadmap-for-investigating-videos-6faea52d2e12)
    
- [Bellingcat: Using Livestreams to Monitor Crises (Gaza Example)](https://www.bellingcat.com/resources/2023/11/09/using-livestreams-to-monitor-crises-in-gaza-and-beyond/)
    
- [Bellingcat: Easy AI Zero-Shot AI Image Classification (Smart Image Sorter)](https://www.bellingcat.com/resources/how-tos/2024/08/15/easy-ai-zero-shot-ai-image-classification-smart-image-sorter/)
    

---

## 3. **Data Preservation & Collection Tools**

### **Webpage Archiving & Bookmarking**

- [Memex: Tutorials](https://tutorials.memex.garden/)
    
- [Memex: Save Pages Tutorial](https://tutorials.memex.garden/savepages)
    
- [Memex Chrome Extension (Google Web Store)](https://chromewebstore.google.com/detail/memex/abkfbakhjpmblaafnpgjppbmioombali?hl=en)
## **Розслідування YouTube-каналів**

### 
**1. Загальний підхід**

YouTube є однією з основних платформ, де можна знайти OSINT-дані, особливо щодо осіб, подій або злочинних дій. Ця методологія описує кроки для збору, аналізу та збереження даних.

### **2. Збереження та захист доказів**

#### **Офіційне збереження даних (для правоохоронних органів)**

Якщо необхідно офіційно зберегти дані, варто подати запит на збереження (preservation request) у Google. Це робиться через:

- [Google Law Enforcement Request System (LERS)](https://lers.google.com/signup_v2/landing)
- Офіційна адреса підтримки правоохоронців: **uslawenforcement@google.com**
- Додаткові ресурси:
    - [Список контактів ISP](https://www.search.org/resources/isp-list/)
    - [NW3C Investigative Resources](https://www.nw3c.org/investigative-resources)

**Примітка:** Якщо можливість подати запит відсутня, необхідно самостійно провести захоплення даних для уникнення їхньої втрати.

#### **Самостійне збереження YouTube-каналу та відео**

1. **Збереження сторінок як PDF**
    - Використовуйте вбудовану функцію браузера:mathematica
CopyEditCtrl + P → Save as PDF (Зберегти як PDF)

    - Для масового захоплення сторінок можна використовувати **[SingleFile](https://addons.mozilla.org/en-US/firefox/addon/single-file/)**.
2. **Завантаження відео**
Використовуйте:
    - [youtube-dl](https://ytdl-org.github.io/youtube-dl/index.html) (рекомендований метод)
    - [Video DownloadHelper](https://addons.mozilla.org/en-US/firefox/addon/video-downloadhelper/)
    - [Easy YouTube Video Downloader](https://addons.mozilla.org/en-US/firefox/addon/easy-youtube-video-download/)

**Приклад використання youtube-dl у терміналі:**

```javascript
bash
CopyEdityoutube-dl -f best https://www.youtube.com/watch?v=yOhGkZ4U4lI

```




### **3. Аналіз відео та профілів користувачів**

#### **Збір профільної інформації**

1. **Зберегти URL каналу та ім’я користувача**
2. **Зберегти аватар та опис профілю**
**Приклад команди для збереження аватара:**bash
CopyEditwget https://yt3.ggpht.com/avatar-url.jpg -O avatar.jpg

3. **Переглянути вкладку "Про канал"**
    - Можуть бути зазначені інші соцмережі або контактні дані.
    - Часто містяться посилання на партнерські програми або товари.

#### **Перегляд та аналіз відео**

1. **Відфільтрувати відео за новизною:**bash
CopyEdithttps://www.youtube.com/c/Username/videos?view=0&sort=dd

2. **Перегляд відео на наявність особистих даних**
    - Можливе розташування (GPS-координати, фон у відео).
    - Ідентифікаційні дані (номерні знаки, документи, монологи тощо).
3. **Збереження важливих кадрів**
**Приклад отримання ключових кадрів:**bash
CopyEdithttps://i.ytimg.com/vi/videoID/hqdefault.jpg


#### **Використання реверсного пошуку**

1. **Google Reverse Image Search:**arduino
CopyEdithttps://images.google.com/

2. **Інші сервіси:**
    - [TinEye](https://tineye.com/)
    - [Yandex Images](https://yandex.com/images/)
    - [Bing Visual Search](https://www.bing.com/visualsearch)




### **4. Документування та організація звіту**

1. **Зберегти всі URL-адреси та профілі в текстовому файлі або CSV**
**Приклад створення CSV:**python
CopyEditimport csv

data = [
    ["Канал", "URL"],
    ["Example Channel", "https://www.youtube.com/c/Example"]
]

with open("youtube_data.csv", "w", newline="") as file:
    writer = csv.writer(file)
    writer.writerows(data)

2. **Включити збережені відео у звіт**
    - Найважливіші кадри включаються у додаток.
    - Відеофайли передаються збереженими на локальному сервері або оптичному носії.




## **Методологія 2: Пошук відео на YouTube**

### **1. Використання Google Operators**

1. **Пошук за ключовими словами**vbnet
CopyEditsite:youtube.com "ключові слова"

2. **Фільтрування результатів у YouTube**arduino
CopyEdithttps://www.youtube.com/results?search_query=ключові+слова

3. **Пошук у заголовках та описах відео**vbnet
CopyEditallintitle:"ключові слова" site:youtube.com


### **2. Використання Channel Crawler**

- [Channel Crawler](https://channelcrawler.com/) дозволяє знайти всі відео конкретного автора або за темою.

### **3. Захоплення відео за допомогою сторонніх сервісів**

1. **Перегляд відео у вбудованому режимі**arduino
CopyEdithttps://www.youtube.com/embed/videoID

2. **Обхід вікових обмежень**arduino
CopyEdithttps://hooktube.com/watch?v=videoID

3. **Завантаження субтитрів**
    - [DownSub](https://downsub.com/)

### **4. Автоматичний пошук відео за ескізами**

Кожне відео YouTube має 4 стандартних зображення:

```javascript
ruby
CopyEdithttp://i.ytimg.com/vi/videoID/1.jpg
http://i.ytimg.com/vi/videoID/2.jpg
http://i.ytimg.com/vi/videoID/3.jpg
http://i.ytimg.com/vi/videoID/4.jpg

```

Щоб здійснити реверсний пошук, вставте отримані URL у Google Images.




## **Висновок**

Ця технічна документація описує:

1. **Методи збору та аналізу YouTube-каналів**, включаючи автоматизоване збереження сторінок та відео.
2. **Способи пошуку відео** за допомогою Google Operators та спеціалізованих інструментів.
3. **Методи реверсного пошуку**, включаючи аналіз мініатюр та субтитрів.

Ця методологія може бути використана як для OSINT-розслідувань, так і для документування доказів у кримінальних та юридичних справах.







## **Методологія** 

**1. Загальний підхід**

OSINT-розслідування відео передбачає кілька ключових кроків:

- Завантаження відео з джерела.
- Аналіз відео покадрово.
- Транскрипція аудіо в текст.
- Витяг субтитрів.
- Аналіз метаданих.
- Вилучення аудіо та окремих кадрів.
- Об’єднання розмитих кадрів для відновлення деталей.

Ця методологія описує покроковий процес аналізу відео за допомогою спеціалізованих інструментів.




## **2. Завантаження відео**

Перед аналізом відео його потрібно зберегти локально. Для цього використовуються наступні інструменти:

- **YouTube Downloader**
- **Inflact** – для Facebook, Instagram, Twitter, TikTok.
- **[SaveFrom](https://save-from.net/)** – для різних платформ.
- **[youtube-dl](https://github.com/ytdl-org/youtube-dl)** – CLI-інструмент для завантаження відео.

**Приклад використання youtube-dl для завантаження відео з YouTube:**

```javascript
bash
CopyEdityoutube-dl -f best https://www.youtube.com/watch?v=exampleID

```




## **3. Аналіз відео покадрово**

Щоб знайти приховані деталі або відстежити певні моменти, відео аналізується покадрово.

### **Інструменти для перегляду відео покадрово:**

- **[Veed.io](https://www.veed.io/)**
- **[Kapwing](https://www.kapwing.com/)** – також має функції редагування.

**Як переглядати відео покадрово у VLC Player:**

1. Відкрити відео у **VLC Media Player**.
2. Натиснути `E` для покадрового перегляду.
3. Використовувати `Shift + S` для збереження кадру.

**Приклад вилучення кадру з відео за допомогою FFMpeg:**

```javascript
bash
CopyEditffmpeg -i example.mp4 -vf "select=eq(n\,100)" -vsync vfr frame100.jpg

```

Ця команда зберігає 100-й кадр з відео.




## **4. Перетворення відео в текст (Speech-to-Text)**

Для вилучення діалогів чи ключової інформації з відео необхідно зробити транскрипцію.

### **Інструменти для транскрипції:**

- **[YouTube Transcript](https://youtubetranscript.com/)**
- **Whisper Web** – AI-обробка аудіо.

**Приклад автоматичної транскрипції відео за допомогою Python та OpenAI Whisper:**

```javascript
python
CopyEditimport whisper

model = whisper.load_model("base")
result = model.transcribe("example.mp4")
print(result["text"])

```




## **5. Вилучення субтитрів**

Якщо відео має вбудовані субтитри, їх можна витягти для аналізу.

### **Інструменти для вилучення субтитрів:**

- **[Subtitle Video](https://subtitlevideo.com/)**
- **[DownSub](https://downsub.com/)** – автоматичне завантаження субтитрів з YouTube.

**Витяг субтитрів з YouTube-DL:**

```javascript
bash
CopyEdityoutube-dl --write-auto-sub --sub-lang en --skip-download https://www.youtube.com/watch?v=exampleID

```




## **6. Аналіз метаданих відео**

Метадані можуть містити дату створення, місце зйомки, інформацію про пристрій.

### **Інструменти для аналізу метаданих:**

- **[Metadata2go](https://metadata2go.com/)**
- **[ExifTool](https://exiftool.org/)** – потужний CLI-інструмент.

**Перевірка метаданих у ExifTool:**

```javascript
bash
CopyEditexiftool example.mp4

```

**Вивід може містити:**

```javascript
yaml
CopyEditFile Name: example.mp4
Camera Model: iPhone 12 Pro
Date Taken: 2024-02-01
GPS Coordinates: 40.7128, -74.0060

```

Якщо є GPS-координати, перевіряємо їх на Google Maps.




## **7. Вилучення аудіо та окремих кадрів**

### **Витяг аудіо з відео**

Якщо потрібно отримати аудіофайл, використовуйте FFMpeg.

**Команда для вилучення аудіо у MP3:**

```javascript
bash
CopyEditffmpeg -i example.mp4 -q:a 0 -map a example.mp3

```

### **Вилучення кадрів відео**

Щоб отримати кожен 10-й кадр:

```javascript
bash
CopyEditffmpeg -i example.mp4 -vf "select=not(mod(n\,10))" -vsync vfr frame_%03d.jpg

```




## **8. Об’єднання розмитих кадрів**

Для відновлення розмитих кадрів використовуйте **Focus Stacking**.

### **Інструмент для об’єднання розмитих кадрів:**

- **[Focus Stacking Online](https://focusstackingonline.com/)**

**Приклад об’єднання зображень у Python:**

```javascript
python
CopyEditfrom PIL import Image
import numpy as np

images = [Image.open(f"frame_{i}.jpg") for i in range(1, 4)]
stacked_image = np.mean([np.array(img) for img in images], axis=0)
final_image = Image.fromarray(stacked_image.astype('uint8'))
final_image.save("stacked_result.jpg")

```




## **9. Додаткові можливості**

- **[Use IMAGE OSINT Cheat Sheet](https://github.com/cipher387/cheatsheets)** – для аналізу кожного кадру.
- **[Use REVERSE FACE SEARCH Cheat Sheet](https://github.com/cipher387/cheatsheets)** – для аналізу осіб у відео.




## **Висновок**

Ця методологія дозволяє ефективно проводити OSINT-аналіз відео:

1. **Завантажити відео** з різних джерел.
2. **Переглянути його покадрово** для пошуку прихованих деталей.
3. **Конвертувати аудіо в текст** для виявлення корисної інформації.
4. **Вилучити субтитри** для додаткового аналізу.
5. **Отримати метадані** для встановлення походження відео.
6. **Видобути аудіо або кадри** для подальшої обробки.
7. **Об’єднати розмиті кадри** для покращення якості зображення.

Ця методика допоможе збирати та аналізувати відео, використовуючи як онлайн-інструменти, так і CLI-рішення.




