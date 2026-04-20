import { PRIORITIES, PRIORITY_ORDER } from '../utils/priority.js'

/**
 * FilterBar — хэрэглэгч зөвхөн A эсвэл A+B гэх мэт шүүлт хийнэ.
 * value: Set<'A'|'B'|'C'|'D'> (хоосон бол бүгд)
 */
export default function FilterBar({ value, onChange }) {
  const toggle = (key) => {
    const next = new Set(value)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    onChange?.(next)
  }
  const clear = () => onChange?.(new Set())

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
      <button
        onClick={clear}
        className={[
          'rounded-full px-3 py-1 text-xs font-medium border',
          value.size === 0
            ? 'bg-slate-900 text-white border-slate-900'
            : 'bg-white text-slate-600 border-slate-200',
        ].join(' ')}
      >
        Бүгд
      </button>
      {PRIORITY_ORDER.map((k) => {
        const p = PRIORITIES[k]
        const active = value.has(k)
        return (
          <button
            key={k}
            onClick={() => toggle(k)}
            className={[
              'rounded-full px-3 py-1 text-xs font-semibold border transition',
              active ? p.chip + ' border-transparent' : 'bg-white text-slate-600 border-slate-200',
            ].join(' ')}
            title={p.hint}
          >
            {k} — {p.label}
          </button>
        )
      })}
    </div>
  )
}
