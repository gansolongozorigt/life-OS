import { useEffect, useState } from 'react'
import { Footprints, Plus } from 'lucide-react'
import { storage, KEYS } from '../services/storage.js'

/**
 * Гүйлт/Фитнесс бүртгэл — зам, хугацаа, зай, алхам.
 * Энгийн манай form — LocalStorage-д тэмдэглэл (entry) бүр хадгалагдана.
 */
export default function FitnessLog() {
  const [entries, setEntries] = useState(() => storage.get(KEYS.FITNESS, []))
  const [form, setForm] = useState({
    type: 'гүйлт',
    distanceKm: '',
    durationMin: '',
    steps: '',
    note: '',
  })

  useEffect(() => storage.set(KEYS.FITNESS, entries), [entries])

  const add = () => {
    const e = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      type: form.type,
      distanceKm: parseFloat(form.distanceKm) || 0,
      durationMin: parseFloat(form.durationMin) || 0,
      steps: parseInt(form.steps, 10) || 0,
      note: form.note.trim(),
    }
    if (!e.distanceKm && !e.durationMin && !e.steps) return
    setEntries((p) => [e, ...p].slice(0, 100))
    setForm({ type: e.type, distanceKm: '', durationMin: '', steps: '', note: '' })
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-fuchsia-600">
        <Footprints className="h-4 w-4" />
        <span className="text-sm font-semibold">Гүйлт / Фитнесс бүртгэл</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="col-span-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2"
        >
          <option value="гүйлт">Гүйлт</option>
          <option value="алхалт">Алхалт</option>
          <option value="дугуй">Дугуй</option>
          <option value="йога">Йога</option>
          <option value="спорт заал">Спорт заал</option>
        </select>
        <input
          type="number" step="0.1" placeholder="Зай (км)"
          value={form.distanceKm}
          onChange={(e) => setForm({ ...form, distanceKm: e.target.value })}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-2"
        />
        <input
          type="number" step="1" placeholder="Хугацаа (мин)"
          value={form.durationMin}
          onChange={(e) => setForm({ ...form, durationMin: e.target.value })}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-2"
        />
        <input
          type="number" step="1" placeholder="Алхам"
          value={form.steps}
          onChange={(e) => setForm({ ...form, steps: e.target.value })}
          className="col-span-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2"
        />
        <input
          placeholder="Тэмдэглэл (сонголт)"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          className="col-span-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2"
        />
        <button
          onClick={add}
          className="col-span-2 inline-flex items-center justify-center gap-1 rounded-full bg-fuchsia-500 text-white px-4 py-2 text-sm"
        >
          <Plus className="h-4 w-4" /> Бүртгэх
        </button>
      </div>

      {entries.length > 0 && (
        <ul className="mt-3 space-y-1.5 max-h-40 overflow-y-auto border-t border-slate-100 pt-2">
          {entries.map((e) => (
            <li key={e.id} className="text-xs text-slate-600">
              <span className="font-semibold">{e.type}</span>
              {e.distanceKm ? ` · ${e.distanceKm} км` : ''}
              {e.durationMin ? ` · ${e.durationMin} мин` : ''}
              {e.steps ? ` · ${e.steps} алхам` : ''}
              <span className="block text-[10px] text-slate-400">
                {new Date(e.date).toLocaleString('mn-MN')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
