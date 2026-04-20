import { PRIORITIES } from '../utils/priority.js'
import TaskCard from './TaskCard.jsx'

/**
 * MatrixView — Эйзенхауэрын матриц (2x2). A, B, C, D дөрөв тусдаа квадрат.
 */
export default function MatrixView({ tasks, ...handlers }) {
  const groups = { A: [], B: [], C: [], D: [] }
  tasks.forEach((t) => (groups[t.priority] ?? groups.D).push(t))

  const Quadrant = ({ keyLetter }) => {
    const p = PRIORITIES[keyLetter]
    const items = groups[keyLetter]
    return (
      <section className={`rounded-2xl border-2 p-3 ${p.card}`}>
        <header className="mb-2 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${p.chip}`}>
                {keyLetter}
              </span>
              <h3 className="text-sm font-semibold">{p.label}</h3>
            </div>
            <p className="text-[11px] opacity-70">{p.hint}</p>
          </div>
          <span className="text-xs opacity-70">{items.length}</span>
        </header>
        <div className="space-y-2">
          {items.length === 0 && (
            <p className="text-xs opacity-60">Ажил алга.</p>
          )}
          {items.map((t) => (
            <TaskCard key={t.id} task={t} {...handlers} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Quadrant keyLetter="A" />
      <Quadrant keyLetter="B" />
      <Quadrant keyLetter="C" />
      <Quadrant keyLetter="D" />
    </div>
  )
}
