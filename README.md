# Life OS — Монгол хэл дээрх chat-based дижитал төлөвлөгч (PWA)

Life OS нь Эйзенхауэрын матрицад тулгуурласан, минимал chat-like интерфейстэй, бүрэн
оффлайн ажилладаг хувийн төлөвлөгч. React (Vite) + Tailwind CSS + Lucide Icons
дээр бүтсэн, LocalStorage-д өгөгдлөө хадгална.

## Ажиллуулах

```bash
npm install
npm run dev       # http://localhost:5173
npm run build
npm run preview   # PWA-г шалгахад (HTTPS шаардахгүй localhost-д ажиллана)
```

> Анхаар: PWA үндсэндээ `http://localhost` эсвэл `https://` орчинд л найдвартай
> ажиллана. `file://`-аас нээвэл Service Worker бүртгэгдэхгүй.

---

## 1. High-level архитектур

Апп нь **нэг SPA** — router-гүй, tab-based навигацитай. State бүхэлдээ React-ын
`useState` + `useEffect` хосоор LocalStorage-той sync хийгдэнэ. Өгөгдлийн эх
үүсвэр нь `storage.js` layer бөгөөд бусад компонент зөвхөн энэ дундуур унш/бич.

```
┌───────────────────────────── App ─────────────────────────────┐
│  ┌─────────── Header (огноо + A/B/C/D тоолуур) ───────────┐  │
│  │                                                         │  │
│  ├───────────────────── Main (tab) ────────────────────────┤  │
│  │   chat     → BibleVerseCard + ChatUI                     │  │
│  │   matrix   → MatrixView (2x2, TaskCard-ууд)              │  │
│  │   hydration→ HydrationTracker                            │  │
│  │   timer    → Timer                                       │  │
│  │   fitness  → FitnessLog                                  │  │
│  │   reflect  → DailyReflection (mood + note)               │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌───────────────────── BottomNav ─────────────────────────┐  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘

services/
  storage.js        — LocalStorageService (prefix, versioning, fallback)
  verses.js         — Библийн ишлэлийн оффлайн сан + өдрийн сонголт
utils/
  priority.js       — PRIORITIES (A/B/C/D), sortTasks, filterTasks
```

### Компонентүүд

| Компонент           | Үүрэг                                                                 |
|---------------------|-----------------------------------------------------------------------|
| `App`               | Tab state, tasks state, LocalStorage sync, layout                     |
| `ChatUI`            | Чат-хэлбэр бүхий үндсэн харагдац, шинэ ажил нэмэх (A/B/C/D товч)      |
| `TaskCard`          | Нэг ажлын карт — зэрэг, quick-actions (дуусгах, засах, устгах, солих) |
| `MatrixView`        | Эйзенхауэрын 2x2 матриц, 4 квадрат тус бүр өөр өнгөтэй                |
| `FilterBar`         | Ажлын жагсаалтыг A/B/C/D-ээр шүүх                                     |
| `BibleVerseCard`    | Өдрийн ишлэл, өглөө автомат, "Солих" товчоор шинэчлэх                  |
| `HydrationTracker`  | Ус уух прогресс бар + тохируулга (unit, goal)                          |
| `Timer`             | Start/End таймер, session бүртгэл                                      |
| `FitnessLog`        | Гүйлт/фитнесс — зай, хугацаа, алхам, төрөл                             |
| `DailyReflection`   | Mood selector + өдрийн тэмдэглэл                                       |
| `BottomNav`         | 6 tab бүхий доод navigation                                            |

---

## 2. TaskCard-д A/B/C/D өнгө дамжуулах жишээ

Tailwind-ын dynamic class-уудыг build-time-д JIT-ээс шалгах боломжгүй тул
**static** class string-үүдийг нэг лавлах объектод хадгалаад `task.priority`-оор
сонгож ашиглана (`utils/priority.js`).

```js
// utils/priority.js (хураангуй)
export const PRIORITIES = {
  A: { card: 'bg-red-50    border-red-500    text-red-900',    chip: 'bg-red-500 text-white',    order: 0 },
  B: { card: 'bg-amber-50  border-amber-500  text-amber-900',  chip: 'bg-amber-500 text-white',  order: 1 },
  C: { card: 'bg-blue-50   border-blue-500   text-blue-900',   chip: 'bg-blue-500 text-white',   order: 2 },
  D: { card: 'bg-slate-100 border-slate-400  text-slate-700',  chip: 'bg-slate-500 text-white',  order: 3 },
}
```

```jsx
// components/TaskCard.jsx (хураангуй)
import { PRIORITIES } from '../utils/priority.js'

export default function TaskCard({ task, onSetPriority }) {
  const p = PRIORITIES[task.priority] ?? PRIORITIES.D
  return (
    <div className={`rounded-2xl border-2 p-3 shadow-sm ${p.card}`}>
      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${p.chip}`}>
        {p.key}
      </span>
      <p className="font-medium">{task.title}</p>

      {/* зэрэг солих — нэг дарах */}
      <div className="mt-2 flex gap-1.5">
        {['A','B','C','D'].map((k) => (
          <button
            key={k}
            onClick={() => onSetPriority(task.id, k)}
            className={[
              'h-6 w-6 rounded-md text-[11px] font-bold',
              k === task.priority ? PRIORITIES[k].chip : 'bg-white/70 text-slate-600',
            ].join(' ')}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  )
}
```

Яагаад dynamic `bg-${color}-500` гэж бичиж болохгүй вэ? Tailwind JIT нь файлын
эх кодоос class-ыг string хайлтаар олдог. String нь template literal-аар бүрэлдэх
үед scanner олж чадахгүй тул build-д class таслагдана. Мөн бид `safelist`
хэрэглэхгүйн тулд full class-ыг config-т өгч байна.

Эрэмбэлэх (A → B → C → D) энгийн:

```js
tasks.sort((a, b) => PRIORITIES[a.priority].order - PRIORITIES[b.priority].order)
```

---

## 3. PWA ба LocalStorage — анхаарах гол зүйл

### PWA

- **manifest.webmanifest** заавал: `name`, `start_url`, `display: "standalone"`,
  `theme_color`, 192px + 512px icon. (Маск-тай иконд `purpose: "any maskable"`.)
- **Service Worker** зөвхөн secure context (`https://` эсвэл `localhost`)-д
  ажиллана. Production дээр HTTPS шаардлагатай.
- **Scope**: `sw.js`-ыг root-д байрлуулах (`/sw.js`). `/js/sw.js` гэвэл scope
  `/js/*` болж бусад route-ыг cache хийхгүй.
- **Cache стратеги**: HTML navigation-д network-first (шинэчлэлт авах), бусад
  static asset-д stale-while-revalidate (хурд + оффлайн). Энэ төслийн `public/sw.js`
  яг ийм бүтэцтэй.
- **Шинэ хувилбар deploy**: cache нэрийг bump хийнэ (`life-os-v1` → `v2`), идэвхжих
  үед хуучин cache-ийг цэвэрлэнэ. Хэрэглэгчид "Шинэ хувилбар боломжтой"
  toast харуулахыг хүсвэл `navigator.serviceWorker` event-ээр барина.
- **iOS Safari**-ийн хязгаарлалт: add-to-home-screen-ээс нэмсэн үед standalone
  ажиллана гэхдээ push notification дэмжлэггүй (iOS 16.4-аас хойш үндсэндээ),
  сайтын icon/manifest нь `apple-touch-icon` meta-тай байх.
- **Vite дээр**: энэ төсөлд plugin ашиглаагүй, `public/sw.js`-ийг шууд үйлчилнэ.
  Илүү том төсөлд `vite-plugin-pwa` + Workbox рекомендлагдана (precache manifest,
  асинх update, т.м.).

### LocalStorage

- **Хэмжээний хязгаар** ~5 MB (browser тус бүрээр ялгаатай). Том өгөгдөл (гүйлтийн
  GPS trace, олон жилийн тэмдэглэл) удаан хугацаанд хуримтлагдвал давчуурна —
  ирээдүйд **IndexedDB**-рүү зөвлөсөн шилжилт хийх хэрэгтэй.
- **Синхрон API**. Том JSON-ийг write хийхэд UI блоклогдож болно — өгөгдлийг
  feature-ээр нь тусдаа key-ээр хадгалаад зөвхөн өөрчлөгдсөн key-ийг бичих
  хэрэгтэй. Тиймээс `KEYS = { TASKS, HYDRATION, FITNESS, REFLECTIONS, TIMERS }`
  гэж тусгаарласан.
- **JSON алдаа**: parse алдсан үед апп fatal болохгүйн тулд `safeParse` wrapper
  + fallback буцаах.
- **Quota exceeded / Private browsing**: Safari-д `localStorage` идэвхтэй боловч
  write хийхэд алдаа өгдөг тохиолдол бий. `storage.js`-д probe хийж, амжилтгүй
  бол **in-memory Map** руу fallback хийдэг.
- **Schema migration**: Апп хувилбар солигдвол өгөгдөл хуучирч мэдэх учир `__schema`
  key бүхий version хадгална. Идэвхжих үед `runMigrations()` ажиллан шинэчлэл
  хийнэ.
- **Нууцлал**: LocalStorage-д нууц мэдээлэл (нууц үг, токен) НЕ БИЧИХ. XSS
  гарвал урсгалтай байна. Life OS хэрэглэгчийн хувийн өдрийн тэмдэглэл хадгалж
  байгаа тул end-to-end encryption хэрэггүй, гэхдээ `Content-Security-Policy`
  deploy дээр сайн тохируулах.
- **Хэрэглэгчийн өгөгдлийг export/import** функц нэмэх сайн зуршил: хэрэглэгчид
  өөрийн өгөгдлөө JSON-оор татаж аваад backup хийх боломжтой байх.

---

## 4. Chat-based UI — UX flow

**Зорилго**: хэрэглэгч "Юу хийх ёстой вэ?" гэсэн асуултад шууд бичиж хариулна.
Хариу өгсний дараа A/B/C/D сонгосноор ажил чат-руу нэг карт болж "илгээгддэг"
төсөөлөлтэй. Энэ нь уламжлалт form-ын нэмэх товч-оос илүү хурдан ба танил.

### Flow

1. **Нээх** → Өглөө бол доод хэсэгт Библийн ишлэл. Дээр системийн анхны мессеж
   ("Сайн уу! ... A/B/C/D") харагдана.
2. **Нэмэх** → Хэрэглэгч input-д ажлын нэр бичнэ. 4 өнгийн товчоос зэргээ сонгоно.
   - Enter дарвал default `B` зэрэгтэйгээр нэмэгдэнэ.
   - Send (↗) товч мөн `B`-ээр нэмнэ.
3. **Автомат эрэмбэ** → Шинэ карт орох тутам жагсаалт дахин sort болж, `A`
   эхэнд, `D` сүүлд харагдана (`sortTasks` нь priority, дараа createdAt-аар).
4. **Зэрэг солих** → Карт дээрх жижиг A/B/C/D товчуудаас нэгийг дарах → карт
   шууд өөр өнгө рүү шилжих, жагсаалтад байрлалаа солих.
5. **Дуусгах** → Зүүн талын тойрог товчлуур → карт бүдгэрч line-through болно.
6. **Засах/Устгах** → quick-actions `Засах` / `Устгах`.
7. **Шүүх** → Дээд талын `FilterBar` дээрээс `A` эсвэл `A+B` гэх мэт дарж
   зөвхөн сонгосон зэргийн ажлуудыг харна. `Бүгд` дарж reset.
8. **Эйзенхауэрын матриц** → `BottomNav → Матриц` tab-аар 2x2 layout-оор 4
   ангиллыг нэг дор харах.
9. **Дагалдах tab-ууд** → Ус, Таймер, Фитнесс, Дүгнэлт. Бүгд LocalStorage-д
   автоматаар хадгалагдана, оффлайн ажиллана.

### UX зарчмууд

- **Нэг гол үйлдэл нэг экранд**: өнгөтэй товчлуур A/B/C/D нь chat-ийн голд,
  бусад feature BottomNav дундуур.
- **Сарниулдаггүй минимал**: header + main + bottom nav. Modal цонх ашиглахгүй;
  тохиргоо in-line (жишээ: HydrationTracker settings toggle).
- **Хэл**: бүх label, товч, placeholder монгол хэл дээр. Олон улсын цагаан толгой
  (emoji mood, tolo-гүй) зарцуулна.
- **Хариу**: үйлдэл болсоны дараа визуал feedback шууд (өнгө солих, ring
  animation, "Хадгалагдлаа" toast дотор кард).

---

## Файлын бүтэц

```
life-os/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── public/
│   ├── manifest.webmanifest
│   ├── sw.js
│   └── icons/
│       ├── icon.svg
│       ├── icon-192.png
│       └── icon-512.png
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    │   ├── BibleVerseCard.jsx
    │   ├── BottomNav.jsx
    │   ├── ChatUI.jsx
    │   ├── DailyReflection.jsx
    │   ├── FilterBar.jsx
    │   ├── FitnessLog.jsx
    │   ├── HydrationTracker.jsx
    │   ├── MatrixView.jsx
    │   ├── TaskCard.jsx
    │   └── Timer.jsx
    ├── services/
    │   ├── storage.js
    │   └── verses.js
    └── utils/
        └── priority.js
```

## Цаашид хөгжүүлэх санаа

- IndexedDB-д migration (gym, running GPS trace том өгөгдөл)
- Өгөгдлийн JSON export/import (backup)
- Push notification (өглөөний сэрүүлэг, ус уух сануулга)
- Darкmode (Tailwind-ын `dark:` variant + `prefers-color-scheme`)
- Олон хэл (i18n) — `mn`/`en` хоёрыг дэмжих
