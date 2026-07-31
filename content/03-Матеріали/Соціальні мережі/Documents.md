# Documents

### 
Ознайомитися 


https://christina-lekati.medium.com/osint-techniques-for-sensitive-documents-that-have-escaped-into-the-clear-web-6659f29e6010



***

### **Google Operators**

**Приклади використання Google Operators для пошуку різних типів документів.** Ці методи також працюють на Bing, Yandex та інших пошукових системах. 

#### **Приклади запитів:**

- **Пошук за типом файлу:**makefile
CopyEditfiletype:pdf keyword
filetype:doc keyword
filetype:xlsx keyword
filetype:ppt keyword

- **Пошук на конкретному сайті:**makefile
CopyEditsite:irongeek.com filetype:pdf
site:irongeek.com filetype:ppt
site:irongeek.com filetype:pptx

- **Пошук FTP-серверів:**makefile
CopyEditinurl:ftp -inurl:(http|https) “confidential”
inurl:ftp -inurl:(http|https) “cisco” filetype:pdf

- **Академічний пошук/Резюме:**vbnet
CopyEdit“John Doe” “Resume”
“John Doe” “Curriculum Vitae”
“John Doe” “CV”
“John Doe” “Resume” filetype:doc
“John Doe” “Resume” filetype:pdf
“John Doe” “Resume” site:docs.google.com

- **Розширений OSINT-пошук:**arduino
CopyEdithttps://google.com “OSINT” filetype:pdf OR filetype:doc OR filetype:xls OR filetype:xlsx OR filetype:docx OR filetype:ppt OR filetype:pptx OR filetype:wpd OR filetype:txt


***

### **Third-Party Document Search**

Використовуйте ці платформи для пошуку документів, презентацій та наукових матеріалів:

1. **[Scribd](https://www.scribd.com/):** Платформа для електронних книг, документів та журналів.
2. **[FindPDFDoc](http://www.findpdfdoc.com/):** Пошукова система PDF, DOC, PPT файлів.
3. **[BASE Search](https://www.base-search.net/):** Академічна пошукова система.
4. **[Awesome OSINT](https://github.com/jivoi/awesome-osint):** Добірка найкращих OSINT-інструментів.
5. **[FreeFullPDF](http://www.freefullpdf.com/#gsc.tab=0):** Безкоштовні наукові публікації.
6. **[Offshore Leaks Database](https://offshoreleaks.icij.org/):** База даних офшорних документів.
7. **[AuthorStream](http://www.authorstream.com/):** Пошук та обмін презентаціями.
8. **[PasteLert](https://andrewmohawk.com/pasteLert/index.php):** Сповіщення про дані з Pastebin.
9. **[Cryptome](http://cryptome.org/):** Документи про конфіденційність.
10. **[Wikileaks](https://wikileaks.org/plusd/):** Пошук повнотекстових документів.

***

### **Пошук презентацій та слайдшоу**

- **Популярні платформи для презентацій:**
    1. **[Slideshare](https://www.slideshare.net/):** Презентації від LinkedIn.
    2. **[SlideBean](https://slidebean.com/):** Онлайн-платформа для створення слайдів.
    3. **[Issuu](https://issuu.com/):** Публікація цифрових матеріалів.
    4. **[Prezi](https://prezi.com/):** Безкоштовні акаунти мають публічні слайди.
    5. **[AuthorStream](http://www.authorstream.com/):** Завантаження та обмін слайдами.

***

### **Pastes**

1. **[Pastebin](https://pastebin.com/):** Пошук текстових фрагментів або ключових слів.arduino
CopyEdithttps://pastebin.com/search?q=osint

2. **[Programmable Search Engine](https://cse.google.com/cse?cx=012608673527785967081:zdn8qqtfibe):** Налаштований пошук у Pastebin.

***

### **Типи файлів**

**Популярні формати файлів для OSINT:**

- **Документи:** DOC, DOCX, PDF, TXT, RTF
- **Зображення:** JPG, PNG, GIF, BMP
- **Презентації:** PPT, PPTX, ODP
- **Таблиці:** XLS, XLSX, ODS
- **Стислі файли:** ZIP, RAR, 7Z

***

### **Метадані документів**

**Корисні інструменти для аналізу метаданих:**

1. **[Extract Metadata](https://extractmetadata.com/):** Витягування метаданих із файлів.
2. **[ExifInfo](https://exifinfo.org/):** Аналіз метаданих зображень.
3. **[Get Metadata](http://www.get-metadata.com/):** Інструмент для вилучення метаданих.
4. **[MetaGooFil](https://github.com/opsdisk/metagoofil.git):** Скрипт для вилучення метаданих у Linux.
5. **[Free OCR](https://free-ocr.com/):** Оптичне розпізнавання тексту.







### 

**Методологія вилучення метаданих з прикладами даних, кодом та інструментами**




#### **Крок 1: Підготовка та розуміння метаданих**

**Що таке метадані?**

- **Автор:** John Doe
- **Дата створення:** 2023-10-15
- **Дата останньої зміни:** 2023-11-01
- **Ключові слова:** "OSINT, investigation, metadata"
- **Розмір файлу:** 1.2 МБ
- **Формат файлу:** PDF

**Роль метаданих:**

- Виявлення джерел документа.
- Перевірка зв’язків між файлами (наприклад, якщо автор однаковий).
- Ідентифікація змін або підробок.




#### **Крок 2: Вибір інструментів**

1. **ExifTool**
    - Офіційний сайт: [ExifTool](https://exiftool.org/)
    - **Приклад використання:**bash
CopyEditexiftool example.pdf

2. **PyPDF2** (Python бібліотека)
    - Офіційна документація: [PyPDF2](https://pypdf2.readthedocs.io/)
    - **Код для PDF-файлів:**python
CopyEditfrom PyPDF2 import PdfReader

reader = PdfReader("example.pdf")
metadata = reader.metadata

for key, value in metadata.items():
    print(f"{key}: {value}")

3. **Bulk Metadata Extractor**
    - Інструмент для масового вилучення метаданих: [Bulk Metadata Extractor]()
4. **Tesseract OCR** (для зображень)
    - Офіційна документація: [Tesseract](https://github.com/tesseract-ocr/tesseract)
    - **Команда для вилучення тексту та метаданих:**bash
CopyEdittesseract image.png output --psm 3

5. **MetaExtractor**
    - GUI-інструмент для аналізу метаданих: [MetaExtractor](https://www.metaextractor.com/)




#### **Крок 3: Технічний процес**

1. **Ручна перевірка:**
    - PDF: Відкрийте файл → "Властивості" → Перевірте вкладку "Деталі".
2. **Автоматизація вилучення метаданих за допомогою Python:**python
CopyEditfrom PyPDF2 import PdfReader

# Завантаження документа
reader = PdfReader("example.pdf")
metadata = reader.metadata

# Аналіз метаданих
for key, value in metadata.items():
    print(f"{key}: {value}")

3. **Збереження результатів у CSV:**python
CopyEditimport csv

metadata = {"Author": "John Doe", "CreationDate": "2023-10-15"}

with open("metadata_results.csv", "w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["Key", "Value"])
    for key, value in metadata.items():
        writer.writerow([key, value])

4. **Аналіз текстових документів з `python-docx`:**python
CopyEditfrom docx import Document

doc = Document("example.docx")
properties = doc.core_properties

print(f"Автор: {properties.author}")
print(f"Дата створення: {properties.created}")





#### **Крок 4: Етичні аспекти**

- Завжди перевіряйте законність вилучення метаданих.
- Наприклад, вилучення з файлів, що належать іншій особі без її дозволу, може порушувати закони про конфіденційність.




#### **Крок 5: Кращі практики**

- Використовуйте надійні інструменти, такі як ExifTool.
- Зберігайте результати для подальшого аналізу.
- Постійно актуалізуйте свої знання.




### **Кейс: Аналіз документа PDF**

#### **Сценарій**

Вам передали PDF-документ із підозрілою інформацією, і потрібно перевірити, чи не є він підробкою.

1. **Вхідні дані:** Файл: `suspicious_report.pdf`
2. **Дії:**
    - Вилучіть метадані:bash
CopyEditexiftool suspicious_report.pdf
**Результат:**yaml
CopyEditAuthor: Jane Smith
Creation Date: 2025:01:10
Modification Date: 2025:01:15
Keywords: confidential, internal

    - Автоматизуйте аналіз:python
CopyEditfrom PyPDF2 import PdfReader

reader = PdfReader("suspicious_report.pdf")
metadata = reader.metadata

for key, value in metadata.items():
    print(f"{key}: {value}")

    - Перевірте ключові слова:python
CopyEditkeywords = metadata.get("/Keywords", "")
if "confidential" in keywords.lower():
    print("Документ містить конфіденційну інформацію!")

3. **Висновок:**
    - Документ був створений Jane Smith, але остання модифікація виконана іншою особою (припустимо, за підозрілими змінами дати).
    - Ключові слова вказують на конфіденційний характер документа.
    - Рекомендується провести додатковий аналіз файлу.




### **Висновок**

Ця методологія дозволяє ефективно вилучати, аналізувати та документувати метадані з файлів для OSINT-розслідувань. Інтеграція автоматизації з Python робить процес більш продуктивним і масштабованим, а врахування етичних норм забезпечує дотримання законодавства.


