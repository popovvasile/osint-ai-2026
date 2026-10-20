// Graph panel title per locale (ported from @quartz-community/graph v0.1.0 locales).
// Falls back to en-US for unknown locales.
const titles: Record<string, string> = {
  "ar-SA": "التمثيل التفاعلي",
  "ca-ES": "Vista Gràfica",
  "cs-CZ": "Graf",
  "de-DE": "Graphansicht",
  "en-GB": "Graph View",
  "en-US": "Graph View",
  "es-ES": "Vista Gráfica",
  "fa-IR": "نمای گراف",
  "fi-FI": "Verkkonäkymä",
  "fr-FR": "Vue Graphique",
  "he-IL": "מבט גרף",
  "hu-HU": "Grafikonnézet",
  "id-ID": "Tampilan Grafik",
  "it-IT": "Vista grafico",
  "ja-JP": "グラフビュー",
  "kk-KZ": "Граф көрінісі",
  "ko-KR": "그래프 뷰",
  "lt-LT": "Grafiko Vaizdas",
  "nb-NO": "Graf-visning",
  "nl-NL": "Grafiekweergave",
  "pl-PL": "Graf",
  "pt-BR": "Visão de gráfico",
  "ro-RO": "Graf",
  "ru-RU": "Вид графа",
  "th-TH": "มุมมองกราฟ",
  "tr-TR": "Grafik Görünümü",
  "uk-UA": "Вигляд графа",
  "vi-VN": "Sơ đồ",
  "zh-CN": "关系图谱",
  "zh-TW": "關係圖譜",
}

export function graphTitle(locale: string | undefined): string {
  return (locale && titles[locale]) || titles["en-US"]!
}
