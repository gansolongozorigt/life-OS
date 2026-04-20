import { useEffect, useState } from 'react'
import { Droplet, Minus, Plus, Settings2 } from 'lucide-react'
import { storage, KEYS } from '../services/storage.js'

/**
 * Ус уух бүртгэл — өдөр бүрийн прогресс бар.
 * Тохируулга: нэг уулт дах хэмжээ (мл), өдрийн зорилт (мл).
 */
function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

export default function HydrationTracker() {
  const [state, setState] = useState(() =>
    storage.get(KEYS.HYDRATION, {
      goalMl: 2000,
      unitMl: 250,
      byDay: {}, // { '2026-4-20': 1000 }
    })
  )
  const [showSettings, setShowSettings] = useState(false)
  const day = todayKey()
  const current = state.byDay?.[day] ?? 0
  const pct = Math.min(100, Math.round((current / state.goalMl) * 100))

  useEffect(() => storage.set(KEYS.HYDRATION, state), [state])

  const add = (delta) => {
    setState((s) => ({
      ...s,
      byDay: { ...s.byDay, [day]: Math.max(0, (s.byDay?.[day] ?? 0) + delta) },
    }))
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sky-600">
          <Droplet className="h-4 w-4" />
          <span className="text-sm font-semibold">Ус уух бүртгэл</span>
        </div>
        <button
          onClick={() => setShowSettings((v) => !v)}
          className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
          aria-label="Тохиргоо"
        >
          <Settings2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-2 flex items-baseline justify-between text-sm">
        <span className="font-medium">{current} мл</span>
        <span className="text-slate-500">/ {state.goalMl} мл ({pct}%)</span>
      </div>

      <div className="h-3 rounded-full bg-sky-50 overflow-hidden">
        <div
          className="h-full bg-sky-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        <button
          onClick={() => add(-state.unitMl)}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
        >
          <Minus className="h-4 w-4" /> {state.unitMl}мл
        </button>
        <button
          onClick={() => add(state.unitMl)}
          className="inline-flex items-center gap-1 rounded-full bg-sky-500 text-white px-4 py-1.5 text-sm shadow-sm"
        >
          <Plus className="h-4 w-4" /> {state.unitMl}мл нэмэх
        </button>
      </div>

      {showSettings && (
        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-sm">
          <label className="flex flex-col gap-1 text-xs text-slate-600">
            Нэг уулт (мл)
            <input
              type="number"
              min="50"
              step="50"
              value={state.unitMl}
              onChange={(e) =>
                setState((s) => ({ ...s, unitMl: Math.max(50, +e.target.value || 0) }))
              }
              className="rounded-lg border border-slate-200 px-2 py-1"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-slate-600">
            Өдрийн зорилт (мл)
            <input
              type="number"
              min="500"
              step="100"
              value={state.goalMl}
              onChange={(e) =>
                setState((s) => ({ ...s, goalMl: Math.max(500, +e.target.value || 0) }))
              }
              className="rounded-lg border border-slate-200 px-2 py-1"
            />
          </label>
        </div>
      )}
    </div>
  )
}
