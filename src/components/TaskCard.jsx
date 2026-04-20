import { Check, Pencil, Trash2 } from 'lucide-react'
import { PRIORITIES, PRIORITY_ORDER } from '../utils/priority.js'

/**
 * TaskCard — ажлын карт.
 * Props:
 *  - task: { id, title, priority:'A'|'B'|'C'|'D', done, createdAt }
 *  - onToggle(id)  — done / undone
 *  - onDelete(id)
 *  - onEdit(id, nextTitle)
 *  - onSetPriority(id, priority)
 */
export default function TaskCard({ task, onToggle, onDelete, onEdit, onSetPriority }) {
  const p = PRIORITIES[task.priority] ?? PRIORITIES.D

  return (
    <div
      className={[
        'rounded-2xl border-2 p-3 shadow-sm transition',
        p.card,
        task.done ? 'opacity-60 line-through' : '',
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        <button
          aria-label="Дуусгах"
          onClick={() => onToggle?.(task.id)}
          className={[
            'mt-0.5 h-6 w-6 shrink-0 rounded-full border-2 flex items-center justify-center',
            task.done ? `${p.chip} border-transparent` : 'border-current bg-white/60',
          ].join(' ')}
        >
          {task.done && <Check className="h-4 w-4" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${p.chip}`}
              title={p.hint}
            >
              {p.key}
            </span>
            <span className="text-xs opacity-70 truncate">{p.label}</span>
          </div>

          <p className="font-medium leading-snug break-words">{task.title}</p>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {/* Priority picker — нэг даралтаар A/B/C/D солих */}
            {PRIORITY_ORDER.map((key) => (
              <button
                key={key}
                onClick={() => onSetPriority?.(task.id, key)}
                aria-label={`Зэрэг ${key}`}
                className={[
                  'h-6 w-6 rounded-md text-[11px] font-bold transition',
                  key === task.priority
                    ? PRIORITIES[key].chip
                    : 'bg-white/70 text-slate-600 hover:bg-white',
                ].join(' ')}
              >
                {key}
              </button>
            ))}

            <button
              onClick={() => {
                const next = prompt('Ажлыг засах:', task.title)
                if (next && next.trim()) onEdit?.(task.id, next.trim())
              }}
              className="ml-auto inline-flex items-center gap-1 rounded-md bg-white/70 px-2 py-1 text-xs hover:bg-white"
            >
              <Pencil className="h-3.5 w-3.5" /> Засах
            </button>
            <button
              onClick={() => onDelete?.(task.id)}
              className="inline-flex items-center gap-1 rounded-md bg-white/70 px-2 py-1 text-xs text-red-700 hover:bg-white"
            >
              <Trash2 className="h-3.5 w-3.5" /> Устгах
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
