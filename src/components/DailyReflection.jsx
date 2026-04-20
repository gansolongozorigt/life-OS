import { useEffect, useState } from 'react'
import { Save, Smile } from 'lucide-react'
import { storage, KEYS } from '../services/storage.js'

const MOODS = [
  { key: 'great', emoji: '😄', label: 'Гайхалтай' },
  { key: 'good',  emoji: '🙂', label: 'Сайн' },
  { key: 'okay',  emoji: '😐', label: 'Боломжийн' },
  { key: 'down',  emoji: '😕', label: 'Зүдрүү' },
  { key: 'bad',   emoji: '😢', label: 'Муу' },
]

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

export default function DailyReflection() {
  const day = todayKey()
  const [all, setAll] = useState(() => storage.get(KEYS.REFLECTIONS, {}))
  const existing = all[day] ?? { mood: null, note: '' }
  const [mood, setMood] = useState(existing.mood)
  const [note, setNote] = useState(existing.note)
  const [saved, setSaved] = useState(false)

  useEffect(() => storage.set(KEYS.REFLECTIONS, all), [all])

  const save = () => {
    setAll((prev) => ({ ...prev, [day]: { mood, note, savedAt: Date.now() } }))
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-violet-600">
        <Smile className="h-4 w-4" />
        <span className="text-sm font-semibold">Өдрийн дүгнэлт</span>
      </div>

      <div className="flex justify-between mb-3">
        {MOODS.map((m) => (
          <button
            key={m.key}
            onClick={() => setMood(m.key)}
            className={[
              'flex flex-col items-center gap-0.5 rounded-xl px-2 py-1 transition',
              mood === m.key ? 'bg-violet-100 ring-2 ring-violet-400' : 'hover:bg-slate-50',
            ].join(' ')}
            title={m.label}
          >
            <span className="text-2xl">{m.emoji}</span>
            <span className="text-[10px] text-slate-500">{m.label}</span>
          </button>
        ))}
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={4}
        placeholder="Өнөөдөр юу болсон бэ? Юунд талархаж байна вэ?"
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-400 resize-none"
      />

      <button
        onClick={save}
        className="mt-2 inline-flex items-center gap-1 rounded-full bg-violet-500 text-white px-4 py-1.5 text-sm"
      >
        <Save className="h-4 w-4" /> {saved ? 'Хадгалагдлаа' : 'Хадгалах'}
      </button>
    </div>
  )
}
