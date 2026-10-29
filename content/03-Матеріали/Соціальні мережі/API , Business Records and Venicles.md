---
tags:
  - materials
---

> [[03-Матеріали/Соціальні мережі/Соціальні мережі|SOCMINT]]

## 

**API для OSINT**

📌 **Що таке OSINT API?**
API (Application Programming Interface) – це набір інструментів, який дозволяє автоматизовано отримувати інформацію з різних джерел. У сфері **OSINT (розвідки з відкритих джерел)** API допомагають **збирати, аналізувати та обробляти дані швидше**, ніж це можна зробити вручну.

🔗 **Ресурс**: [GitHub – API's for OSINT](https://github.com/cipher387/API-s-for-OSINT)

💡 **Що можна знайти в цьому репозиторії?**
Це **збірка API**, які корисні для **OSINT-досліджень**, включаючи:
✔ **Пошук інформації про людей** (соцмережі, email, телефонні номери)
✔ **Аналіз компаній** (реєстраційні дані, фінансова інформація)
✔ **Збір даних із соцмереж** (Twitter, Facebook, LinkedIn)
✔ **Перевірка доменів та IP-адрес**
✔ **Пошук витоків даних**
✔ **Кібербезпека та Threat Intelligence**

📌 **Як використовувати?**

- Переглянути список доступних API
- Вибрати потрібні сервіси та підключитися до них
- Використовувати API у своїх OSINT-скриптах для автоматизації збору інформації

**Цей ресурс дуже корисний для фахівців з кібербезпеки, OSINT-аналітиків та всіх, хто працює з відкритими даними.**












https://techjournalism.medium.com/osint-checklist-for-company-investigations-86c3752c095d




**Дослідження компаній та організацій**

Компанії та організації можуть бути чудовим джерелом інформації, особливо коли вони є основним об’єктом розслідування або коли наша ціль працює в одній з них. Часто, аналізуючи роботодавця, ми можемо отримати інформацію, яка інакше була б нам недоступна.




***

### 
**Google-оператори**

Ось кілька прикладів стратегій використання Google-операторів для пошуку інформації про співробітників певної організації:

```javascript

CopyEditsite:company.com filetype:pdf filetype:docx  
site:company.com “phone list”  
site:company.com intitle:“contact us” OR “our staff” OR “team” OR “board” OR “about us”  
site:company.com “commendation” OR “employee of the month” OR “congratulations to”  

```

***

### 
**Сторонні сайти для пошуку інформації про компанії**


|  |  |
| --- | --- |
| [Indeed](https://www.indeed.com/) | База вакансій та профілів співробітників |
| [RocketReach](https://rocketreach.co/) | Пошук контактної інформації працівників |
| [CEO Email](https://ceoemail.com/) | Контактні дані керівників компаній |
| [OCCRP Data](https://data.occrp.org/) | База даних про корупцію та розслідування |
| [Enigma](https://public.enigma.com/browse/collection/corp-watch-company-subsidiaries/) | База компаній та їх підрозділів |
| [AngelList](https://angel.co/) | Інформація про стартапи та їх інвесторів |
| [OpenSanctions](https://www.opensanctions.org/) | База санкційних списків |
| [Corporation Wiki](https://www.corporationwiki.com/) | Пошук компаній у США |
| [Funding Universe](http://www.fundinguniverse.com/company-histories/) | Історії компаній |
| [OpenCorporates](https://opencorporates.com/) | Найбільша відкрита база компаній |
| [ICIJ Offshore Leaks](https://www.google.com/search?q=%22XX%22+AND+site%3Ahttps%3A%2F%2Foffshoreleaks.icij.org) | База офшорних компаній |
| [IOServ](https://ioserv.com/en/jurisdictions/jurisdlist/) | Реєстри офшорних юрисдикцій |
| [LowTax](https://www.lowtax.net/g/jurisdictions/Global) | Довідник про компанії та юрисдикції |
| [Wikipedia: Legal Entity Types](https://en.wikipedia.org/wiki/List_of_legal_entity_types_by_country) | Типи юридичних осіб у різних країнах |
| [FinCEN MSB](https://www.fincen.gov/msb-registrant-search) | База фінансових посередників |
| [NAICS Code Search](https://www.census.gov/cgi-bin/sssd/naics/naicsrch) | Коди галузей NAICS |
| [Fortune 500](http://fortune.com/fortune500/) | Рейтинг найбільших світових компаній |
| [Ripoff Report](https://www.ripoffreport.com/) | Скарги на компанії |

## 
**Міжнародні ресурси для пошуку інформації про компанії**


|  |  |  |
| --- | --- | --- |
| [List-Org](https://www.list-org.com/) | База даних російських компаній | Пошук за ІПН, назвами, власниками |
| [Qichacha](https://www.qichacha.com/) | База китайських компаній | Детальна інформація про компанії Китаю |
| [Companies House](https://beta.companieshouse.gov.uk/) | Реєстр компаній Великобританії | Офіційний державний реєстр UK |
| [EU NationalRegistries](https://e-justice.europa.eu/content_business_registers_in_member_states-106-de-en.do?member=1) | Реєстри компаній ЄС | Офіційні реєстри компаній у країнах Європейського Союзу |
| [BBC Country Profiles](http://news.bbc.co.uk/2/hi/country_profiles/default.stm) | Профілі країн | Огляд політичної, економічної ситуації в різних країнах |

## 
[http://cybdetective.com/osintmap/](http://cybdetective.com/osintmap/) - велика мапа ресурсів







**LinkedIn**

[https://LinkedIn.com](https://linkedin.com/) | LinkedIn

Щоб виконувати більшість пошуків, вам потрібно увійти в **"burner" акаунт** (тимчасовий), створений у тому ж регіоні та галузі, що й ваша ціль.

📌 **Формати пошуку**:

- **Повне ім'я**: `https://linkedin.com/in/ім'я`
- **Пошук за компанією + ім'ям**:perl
CopyEdithttps://www.linkedin.com/company/microsoft/people/?keywords=jason%20jones

- **Альтернативний пошук через Google**:css
CopyEditsite:linkedin.com microsoft jason jones

- **Пошук за посадою через Google**:css
CopyEditsite:linkedin.com “Assistant General Counsel at Maxjet”


📌 **Пошук профілів, пов'язаних із ціллю**:

- На сторінці профілю вашої цілі перейдіть у розділ **“People also viewed”**.
- Якщо ви знайшли когось іншого з тієї ж компанії, він може бути пов'язаний із ціллю.

📌 **Пошук акаунта за електронною поштою**:

1. **Створіть .csv файл** із єдиним рядком – цільовою email-адресою.
2. **Увійдіть у "burner" акаунт** LinkedIn.
3. **Завантажте файл** на [https://www.linkedin.com/mynetwork/import-contacts/](https://www.linkedin.com/mynetwork/import-contacts/).
⚠️ Власник акаунта отримає сповіщення.

📌 **Що робити після знаходження профілю**:

- **Завантажте фото** (правий клік → відкрити в новій вкладці) і зробіть **реверсний пошук зображень** через Google.
- **Натисніть "More" → "Download PDF"**, щоб зберегти профіль.
- **Скопіюйте посаду**, щоб потім використовувати її для інших пошуків.
- **Перевірте "Contact Info"** – можливо, там є щось крім URL LinkedIn.
- **Запишіть історію роботи** – попередні роботодавці можуть бути точками перехрестя.
- **Занотуйте університети** – можливі точки зв’язку.
- **Перевірте колег та референси** – можуть вести до нової інформації.
- **Проаналізуйте інтереси та опубліковані статті** – це може дати більше контексту про ціль.

***

### 
**1.4 – Ресурси**


|  |  |
| --- | --- |
| [https://start.me/p/rxeRqr/aml-toolbox](https://start.me/p/rxeRqr/aml-toolbox) | Посилання для бізнес-аналітики |
| [Discoverly](https://chrome.google.com/webstore/detail/discoverly-for-gmail-link/dijhcpbkalfgkcebgoncjmfpbamihgaf?utm_source=chrome-ntp-icon) | Chrome-розширення для LinkedIn |
| [linkedin2username](https://gitlab.com/initstring/linkedin2username) | Скрипт для отримання юзернеймів з LinkedIn |
| [The Endorser](https://github.com/eth0izzle/the-endorser) | Автоматичне збирання даних з LinkedIn |
| [Raven](https://github.com/0x09AL/raven) | OSINT-скрипт для пошуку на LinkedIn |
| [Arlandria](https://github.com/kussic/arlandria) | Скрипт для автоматизованого збору профілів |
| [Гайд Sector035](https://medium.com/@sector035/gathering-company-intel-the-agile-way-6db12ca031c9) | OSINT-методи для аналізу компаній |
| [Пошук LinkedIn за email](https://www.intelligencewithsteve.com/post/a-guide-to-searching-linkedin-by-email-address) | Альтернативний метод пошуку профілів за email |

## 











Vehicle OSINT 




https://github.com/akashblackhat/vehical-osint



**Інструменти для роботи з зображеннями (Ідентифікація цілей через фото/відео)**


|  |  |
| --- | --- |
| [Carnet.ai](https://carnet.ai/) | Визначає марку/модель автомобіля за зображенням |
| [Remini](https://remini.ai/) | Покращує якість розмитих або спотворених зображень |
| [LetsEnhance](https://letsenhance.io/) | Збільшує роздільну здатність фото без втрати якості |
| [Media.io](https://www.media.io/) | Видаляє яскраві або великі об'єкти із зображень |
| [Replicate](https://replicate.com/) | Відновлює розмиті/пошкоджені фотографії обличчя та інших об'єктів |
| [TheinPaint](https://theinpaint.com/) | Видаляє небажані об'єкти з фотографій |
| [PimEyes](https://pimeyes.com/) | Потужний ШІ для розпізнавання облич, що порівнює фото з базами в Інтернеті |
| [CarLogos](https://www.carlogos.org/) | База всіх світових автовиробників і їхніх логотипів |
| [PhotOSINT](https://photosint.io/) | Сканує зображення на веб-сторінках для пошуку EXIF-даних |
| Calculator IPVM | Визначає поле зору камери спостереження за допомогою Google Maps |
| [Commercial Truck Trader](https://www.commercialtrucktrader.com/) | База даних комерційних вантажівок у США |
| [Plate Recognition AI](https://platerecognition.com/) | Розпізнає номери автомобілів у зоні видимості камери |

## 


**Інструменти для пошуку інформації за номерними знаками (License Plate OSINT)**

🔎 **Ці сервіси дозволяють шукати інформацію про автомобілі за номерними знаками у різних країнах, перевіряти історію, страховку, штрафи та реєстраційні дані.**


***

### 
**🔹 Пошук номерних знаків у США, ЄС, Австралії, Індії**

|  |  |
| --- | --- |
| [Vehicle Registration API](https://vehicleregistrationapi.com/) | API для пошуку номерних знаків у США, ЄС, Австралії, Індії |
| [FindByPlate](https://findbyplate.com/) | Пошук інформації за номерним знаком (США) |
| [VehicleHistory Plate Search](https://www.vehiclehistory.com/) | Пошук за номером та штатом (США) |
| [FaxVin (License Plate Search)](https://www.faxvin.com/) | Пошук інформації про автомобіль за номером (США) |
| [World License Plates](http://www.worldlicenseplates.com/) | База даних номерних знаків різних країн та провінцій |
| [Platesmania](https://platesmania.com/) | Міжнародна база фото номерних знаків та їх авто |
| [License Plate Data](https://licenseplatedata.com/) | Визначає інформацію про авто за номером та штатом (США) |

***

### 
**🔹 Пошук за номерним знаком у Європі**

|  |  |
| --- | --- |
| [Numberogram](https://numberogram.ru/) | Пошук російських номерних знаків |
| [Finnik](https://finnik.com/) | Пошук номерів авто в різних країнах Європи |
| Netherlands License Plate Dataset | База номерних знаків Нідерландів (15 млн записів) |
| Vic Roads | Реєстр транспортних засобів Вікторії (Австралія) |
| [SivAuto.fr](https://siv-auto.fr/) | Пошук номерних знаків Франції |
| [Queensland.gov](https://www.qld.gov.au/) | Реєстр номерних знаків Квінсленду (Австралія) |
| [Samgongustafa](https://www.samgongustofa.is/) | Пошук номерних знаків Ісландії |
| [Autocode](https://autocode.ru/) | Пошук автомобільних номерів РФ |
| Eteenindus | Естонський реєстр номерних знаків |
| [STKonline](https://www.stkonline.sk/) | Словацький реєстр номерних знаків |
| [DigitalService.dk](https://www.digitalservice.dk/) | Пошук номерних знаків у Данії, Швеції, Норвегії |
| [MTSBU](https://www.mtsbu.ua/) | Український реєстр номерних знаків (⚠️ Використовуйте на власний ризик) |

***

### 
**🔹 Пошук за номерним знаком у різних країнах**


|  |  |
| --- | --- |
| [First Check](https://www.firstcheck.co.za/) | Пошук номерних знаків у ПАР |
| [Federal Road Safety Corps](https://frsc.gov.ng/) | Нігерія – перевірка номерних знаків |
| [Doubango](https://www.doubango.org/) | Розпізнавання номерних знаків Південної Кореї |
| [Itarga](https://www.itarga.com/) | Італійський сервіс пошуку номерних знаків (iOS) |
| [Costco](https://www.costcoauto.com/) | Визначає марку/модель авто за VIN/номером |
| [Plate Recognizer](https://www.platerecognizer.com/) | Декодування номерного знака |
| [AutoCheck](https://www.autocheck.com/) | Пошук інформації за номерним знаком (Experian) |
| [egov.kz](https://www.egov.kz/) | Реєстр номерних знаків Казахстану |
| [Kaggle](https://www.kaggle.com/) | База номерних знаків Марокко |
| [HowsMyDrivingNY](https://www.howsmydrivingny.com/) | Пошук порушень для номерів Нью-Йорка |
| Colorado.gov | Перевірка авто в Колорадо |
| DC.gov | Перевірка штрафів у Вашингтоні (США) |
| ct.gov | Перевірка авто в Коннектикуті |
| [Honolulu Motor Vehicle Inquiry](https://www.honolulu.gov/) | Гавайський реєстр авто |
| Idaho.gov | Перевірка авто в Айдахо |
| [Oregon Semi-Truck Search](https://www.oregon.gov/) | База вантажівок Орегону |
| [Mexico.gob](https://www.gob.mx/) | Пошук номерних знаків у Мексиці |
| [Ghana Opera News](https://www.ghananews.com/) | Кодова система номерних знаків Гани |
| [MPWT.gov](https://www.mpwt.gov.kh/) | Камбоджа – пошук номерних знаків (⚠️ Потрібен VPN) |
| [Parkingfee.gov](https://www.gov.tw/) | Тайбей – перевірка паркувальних штрафів |
| [TTCarLicense](https://apps.apple.com/) | Пошук номерних знаків М'янми (macOS) |
| [EpicVin.com](https://www.epicvin.com/) | Пошук VIN/номерних знаків у США |
| [AuthorandBookinfo.com](https://www.authorandbookinfo.com/) | Коди номерних знаків Алжиру |

***

### 
**🔹 Пошук страховки та історії обслуговування авто**


|                                                                         |                                                                     |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------- |
| [Italy Insurance Control](https://www.ilportaledellautomobilista.it/)   | Перевірка страховки авто (Італія)                                   |
| [Italy Emission Class](https://www.aci.it/)                             | Клас викидів авто (Італія)                                          |
| [Italy Maintenance Control](https://www.ilportaledellautomobilista.it/) | Перевірка ТО авто (Італія)                                          |
| [Aida.info](https://www.aida.info.ro/)                                  | Перевірка страховки за номером (Румунія)                            |
| [VVO.at](https://www.vvo.at/)                                           | Австрійська база страхування авто                                   |
| [Bzkbih.ba](https://www.bzkbih.ba/)                                     | Перевірка страхування авто (Боснія)                                 |
| [Huo.hr](https://www.huo.hr/)                                           | Перевірка автострахування (Хорватія)                                |
| [IC CKP](https://ic.ckp.cz/)                                            | Чеська база страхування авто                                        |
| [DFIM.dk](https://dfim.dk/)                                             | Перевірка страхування (Данія)                                       |
| [LKF Estonia](https://vs.lkf.ee/)                                       | Страхування авто в Естонії, РФ, Ірані                               |
| [Claimsic.fi](https://www.claimsic.fi/)                                 | Фінляндія – перевірка страховки (потрібно вказати авто потерпілого) |
| [Services.ltab.lv](https://services.ltab.lv/)                           | База страхування Латвії                                             |
| [CAB.lt](https://cab.lt/)                                               | Литва – перевірка страховки авто                                    |
| [UFG.pl](https://www.ufg.pl/)                                           | Польща – перевірка страхування за номером                           |
| [Raz.zav](https://www.raz.zav/)                                         | Перевірка автострахування (Словенія)                                |
| [TFF.se](https://www.tff.se/)                                           | Перевірка страховки у Швеції                                        |

## 


| [Wulling.id](https://wulling.id/) | Стаття про індонезійські номерні знаки, включаючи коди регіонів та типи номерів |
| [Turizm.net](https://www.turizm.net/) | Коди міст для турецьких номерних знаків |
| [Aida.info](https://www.aida.info.ro/) | Перевірка страховки автомобіля за номерним знаком або VIN (Румунія) |
| [Egypt.gov](https://www.egypt.gov.eg/) | Таблиця специфікацій номерних знаків Єгипту за типом транспортного засобу |

## 

**🔹 Загальні VIN-декодери та історія авто**

|  |  |
| --- | --- |
| [FaxVin (VIN Search)](https://www.faxvin.com/) | Пошук інформації за VIN, перевірка історії |
| [VehicleHistory.com VIN Search](https://www.vehiclehistory.com/) | Перевірка історії автомобіля за VIN |
| [Vindecoderz](https://www.vindecoderz.com/) | Безкоштовний VIN-декодер |

***

### **🔹 VIN-декодери для окремих марок авто**

|  |  |
| --- | --- |
| [Bimmwer.work](https://bimmwer.work/) | VIN-декодер для BMW (повний список опцій) |
| [Ford VIN Search](https://www.ford.com/) | VIN-декодер для Ford |
| [Chevrolet VIN Search](https://www.chevrolet.com/) | VIN-декодер для Chevrolet |
| [Hyundai VIN Search](https://www.hyundai.com/) | VIN-декодер для Hyundai |
| [Nissan VIN Search](https://www.nissan-global.com/) | VIN-декодер для Nissan |
| [Cadillac VIN Search](https://www.cadillac.com/) | VIN-декодер для Cadillac |
| [Dodge VIN Search](https://www.dodge.com/) | VIN-декодер для Dodge |
| [Toyota VIN Search](https://www.toyota.com/) | VIN-декодер для Toyota |
| [Audi VIN Search](https://www.audi.com/) | VIN-декодер для Audi |
| [Honda VIN Search](https://www.honda.com/) | VIN-декодер для Honda |
| [Yamaha VIN Search](https://www.yamaha-motor.com/) | VIN-декодер для Yamaha |
| [Kawasaki VIN Search](https://www.kawasaki.com/) | VIN-декодер для Kawasaki |
| [Scion VIN Search](https://www.scion.com/) | VIN-декодер для Scion |
| [GM VIN Search](https://www.gm.com/) | VIN-декодер для General Motors |
| [BigRig](https://bigrig.com/) | VIN-декодер для вантажівок і комерційного транспорту |

***

### **🔹 Спеціалізовані VIN-сервіси**

|  |  |
| --- | --- |
| [National Highway Safety Administration (NHTSA)](https://www.nhtsa.gov/) | Офіційний VIN-декодер для США |
| [Cartell.ie](https://www.cartell.ie/) | Реєстр японських авто, показує імпорт і попередніх власників |
| [Carvx.jp](https://www.carvx.jp/) | Перевірка авто за номером шасі (Японія) |
| [Vinpit.com](https://www.vinpit.com/) | Пошук VIN для RV та автофургонів |
| [Cyclevin.com](https://www.cyclevin.com/) | База VIN-кодів викрадених мотоциклів |
| [ATVStyle.com](https://www.atvstyle.com/) | VIN-декодер для квадроциклів |
| [pro.rarom.ro](https://pro.rarom.ro/) | Перевірка історії авто за VIN (Румунія) |

***

## **Інструменти для карт, вулиць та камер спостереження (Map & Street View Tools, Streetcams)**

### **🔹 Карти та оглядові сервіси**

|  |  |
| --- | --- |
| [Show My Street](https://showmystreet.com/) | Спрощений доступ до Google Street View |
| [Mapillary](https://www.mapillary.com/) | Оглядова карта панорамних знімків по всьому світу |
| [Open Aerial Map](https://openaerialmap.org/) | Супутникові знімки та аерофотознімки |
| [ArcGis](https://www.arcgis.com/) | Карта маршрутів вантажівок у США |
| [Bureau of Transportation](https://www.bts.gov/) | Публічні карти транспортної інфраструктури США |
| [Transport for London](https://tfl.gov.uk/) | Карта автобусних маршрутів Лондона |
| [TransitMap](https://www.transitmap.net/) | Архів міжнародних карт громадського транспорту |
| [Indonesia Region Code Map](https://www.indonesiamap.net/) | Карта регіональних кодів Індонезії (актуальна на грудень 2022) |

***

### **🔹 Камери спостереження та онлайн-трансляції**

|  |  |
| --- | --- |
| [WebcamTaxi](https://www.webcamtaxi.com/) | Онлайн-камери по всьому світу, інтерактивна карта |
| [EarthCam](https://www.earthcam.com/) | Мережа веб-камер у різних країнах |
| [WorldCam.eu](https://www.worldcam.eu/) | Міжнародна мережа онлайн-камер |
| [Magonolialinkworld](https://www.magnolialinkworld.com/) | Живі трансляції з веб-камер у світі |
| [WorldCams](https://www.worldcams.tv/) | База камер спостереження |

***

### **🔹 OSINT-збір інформації через карти**

|  |  |
| --- | --- |
| Google Map Scraper | Скрейпінг адрес, телефонів та даних з Google Maps |
| Cipher's Public Transport Maps | 20 карт громадського транспорту різних країн |

***

### **🔹 Паркування та зважувальні станції**

|  |  |
| --- | --- |
| [allstays.com](https://www.allstays.com/) | Карта зупинок для вантажівок у Північній Америці |
| [Driverwyze.com](https://www.driverwyze.com/) | Карта пунктів зважування вантажівок у США та Канаді |
| [Truck Parking Europe](https://www.truck-parking.com/) | Карта паркувальних місць для вантажівок у Європі |

***

### **🔹 Метео- та дорожні умови**

|  |  |
| --- | --- |
| [Weatherbug](https://www.weatherbug.com/) | Камери руху та дорожніх умов у реальному часі |

## 

**[Truck Parking Europe](https://www.truck-parking.com/)** – карта паркувальних місць для комерційних вантажівок у Європі.



**🔹 Загальні OSINT-ресурси**

|  |  |
| --- | --- |
| [Cipher's OSINT Map](http://cybdetective.com/osintmap/) | Інтерактивна мапа OSINT-інструментів для реєстрів, компаній та інших публічних баз |
| [iHunt](https://ihunt.io/) | OSINT-фреймворк для розвідки |
| [Check License Plates](https://www.apple.com/) | iPhone/iPad ярлик для пошуку номерних знаків за країною, штатом або регіоном |
| [CarInfo](https://apps.apple.com/) | Пошук номерних знаків в Індії (macOS/iOS) |
| [BGToll](https://www.bgtoll.bg/) | Перевірка віньєток у ЄС, Росії, Азії та на Близькому Сході |
| [PaperswithCode](https://paperswithcode.com/) | База даних міжнародних номерних знаків із зображеннями |




### **🔹 Пошук водіїв, транспортних компаній та логістики**

|  |  |
| --- | --- |
| NMVTIS | Офіційний портал схвалених постачальників даних NMVTIS (США) |
| [DL # Calculator](https://www.dmv.org/) | Обчислення номерів водійських прав у 9 штатах США на основі ПІБ, статі та дати народження |
| [Enterprise](https://www.enterprise.com/) | Пошук чеків за комбінацією прізвища та номера водійського посвідчення |
| [Hertz](https://www.hertz.com/) | Пошук чеків у Hertz за аналогічним принципом |
| FMCSA.gov | Пошук транспортних компаній за USDOT-номером, MC/MX-номером або назвою |
| [FindFreightLoads.com](https://www.findfreightloads.com/) | База комерційних водіїв і доступних вантажів (контактні дані доступні для зареєстрованих користувачів) |




### **🔹 Пошук напіввантажівок, трейлерів, мотоциклів та іншого транспорту**

|  |  |
| --- | --- |
| [ATVTrader.com](https://www.atvtrader.com/) | База понад 1 000 000 квадроциклів із фото |
| [AutoEvolution.com](https://www.autoevolution.com/) | Хронологія мотоциклів та ATV за виробниками |
| [MXSouth.com](https://www.mxsouth.com/) | Каталог усіх відомих виробників ATV та аксесуарів |
| [NHTSA.gov](https://www.nhtsa.gov/) | Реєстр імпортерів авто в США |
| [Thomasnet.com](https://www.thomasnet.com/) | Список 113 виробників причепів у США |




### **🔹 Аналіз шин та слідів шин**

|  |  |
| --- | --- |
| [Biology Junction](https://www.biologyjunction.com/) | Бібліотека візерунків протекторів шин |
| [Tire Review](https://www.tirereview.com/) | Стаття про визначення стану авто за зносом шин |
| [CarLogos.com](https://www.carlogos.org/) | Повний список найбільших виробників шин у світі |
| [List of Companies.com](https://www.listofcompanies.com/) | Список виробників шин для квадроциклів |




### 
**🔹 Ресурси для виявлення несправностей, безпеки та OSINT-інструменти**

|  |  |
| --- | --- |
| [NHTSA (США)](https://www.nhtsa.gov/) | Реєстр транспортних засобів і обладнання з питаннями безпеки/відкликами VIN |
| **Місцеві реєстри конфіскованих авто** | Поліцейські бази даних по округах, штатах або провінціях |
| **Онлайн-портали штрафів** | Перевірка штрафів за місцевими системами |
| **Деякі евакуаторні компанії** | Можуть мати відкриті реєстри вилучених авто на своїх сайтах |
| [VINCHECKINFO's Reddit Thread](https://www.reddit.com/) | Обговорення відкритих реєстрів транспортних засобів у різних штатах |
| Cipher387 – 1000+ OSINT Tools | Величезна колекція OSINT-інструментів |
| **Google Earth/Maps Timeline** | Функція повернення до попередніх версій Street View |
| [CyberopsIntel](https://www.cyberopsintel.com/) | Стаття про OSINT-аналіз напіввантажівок |
| [Geoguessr](https://www.geoguessr.com/) | Гра для тренування навичок геолокації |




### **🔎 Висновок**

🔹 **Якщо потрібно знайти транспортний засіб за VIN/номером** → Використовуйте **FaxVin, VehicleHistory, NMVTIS, NHTSA**
🔹 **Якщо шукаєте водіїв або компанії** → **FMCSA, FindFreightLoads, Hertz, Enterprise**
🔹 **Якщо аналізуєте напіввантажівки, трейлери або мотоцикли** → **ATVTrader, AutoEvolution, MXSouth**
🔹 **Якщо хочете оцінити стан авто за шинами** → **Tire Review, Biology Junction**
🔹 **Якщо цікавить загальна OSINT-інформація про авто** → **Cipher's OSINT Map, Google Maps Timeline**



