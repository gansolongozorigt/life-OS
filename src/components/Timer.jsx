import { useEffect, useRef, useState } from 'react'
import { Play, Square, RotateCcw, Timer as TimerIcon } from 'lucide-react'
import { storage, KEYS } from '../services/storage.js'

/**
 * Ажлын цаг бүртгэл — Start/End таймер.
 * Бүртгэсэн session-ууд LocalStorage-д ({ label, startedAt, endedAt, durationMs }).
 */
function fmt(ms) {
  const s = Math.floor(ms / 1000)
  const h = String(Math.floor(s / 3600)).padStart(2, '0')
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
  const sec = String(s % 60).padStart(2, '0')
  return `${h}:${m}:${sec}`
}

export default function Timer() {
  const [label, setLabel] = useState('')
  const [startedAt, setStartedAt] = useState(null)
  const [, tick] = useState(0)
  const [sessions, setSessions] = useState(() => storage.get(KEYS.TIMERS, []))
  const intervalRef = useRef(null)

  useEffect(() => {
    if (startedAt) {
      intervalRef.current = setInterval(() => tick((n) => n + 1), 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [startedAt])

  useEffect(() => storage.set(KEYS.TIMERS, sessions), [sessions])

  const elapsed = startedAt ? Date.now() - startedAt : 0

  const start = () => setStartedAt(Date.now())
  const stop = () => {
    if (!startedAt) return
    const now = Date.now()
    const session = {
      id: crypto.randomUUID(),
      label: label.trim() || 'Ажлын сесс',
      startedAt,
      endedAt: now,
      durationMs: now - startedAt,
    }
    setSessions((p) => [session, ...p].slice(0, 50))
    setStartedAt(null)
    setLabel('')
  }
  const reset = () => setStartedAt(null)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-emerald-600">
        <TimerIcon className="h-4 w-4" />
        <span className="text-sm font-semibold">Ажлын цаг бүртгэл</span>
      </div>

      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Юу хийж байна вэ?"
        disabled={!!startedAt}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-400 disabled:opacity-60"
      />

      <div className="mt-3 flex items-center justify-between">
        <div className="font-mono text-3xl tabular-nums">{fmt(elapsed)}</div>
        <div className="flex gap-2">
          {!startedAt ? (
            <button
              onClick={start}
              className="inline-flex items-center gap-1 rounded-full bg-emerald-500 text-white px-4 py-2 text-sm"
            >
              <Play className="h-4 w-4" /> Эхлүүлэх
            </button>
          ) : (
            <>
              <button
                onClick={stop}
                className="inline-flex items-center gap-1 rounded-full bg-red-500 text-white px-4 py-2 text-sm"
              >
                <Square className="h-4 w-4" /> Дуусгах
              </button>
              <button
                onClick={reset}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-600"
                aria-label="Буцаах"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {sessions.length > 0 && (
        <ul className="mt-3 space-y-1 max-h-40 overflow-y-auto border-t border-slate-100 pt-2">
          {sessions.map((s) => (
            <li key={s.id} className="flex justify-between text-xs text-slate-600">
              <span className="truncate">{s.label}</span>
              <span className="font-mono">{fmt(s.durationMs)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
