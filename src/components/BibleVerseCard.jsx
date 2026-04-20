import { BookOpen, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { VERSES, getTodayVerse } from '../services/verses.js'

export default function BibleVerseCard() {
  const [idx, setIdx] = useState(() => VERSES.indexOf(getTodayVerse()))
  const v = VERSES[idx]

  const shuffle = () => {
    let n = Math.floor(Math.random() * VERSES.length)
    if (VERSES.length > 1 && n === idx) n = (n + 1) % VERSES.length
    setIdx(n)
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-amber-700">
          <BookOpen className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            Өнөөдрийн ишлэл
          </span>
        </div>
        <button
          onClick={shuffle}
          className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
        >
          <RefreshCw className="h-3 w-3" /> Солих
        </button>
      </div>
      <p className="text-sm text-slate-800 leading-relaxed">“{v.text}”</p>
      <p className="mt-2 text-xs text-slate-500">— {v.ref}</p>
    </div>
  )
}
