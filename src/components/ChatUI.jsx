import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import TaskCard from './TaskCard.jsx'
import FilterBar from './FilterBar.jsx'
import { PRIORITIES, PRIORITY_ORDER, sortTasks, filterTasks } from '../utils/priority.js'

/**
 * ChatUI — минимал чат хэлбэрээр ажил нэмэх, жагсаалт харах.
 * Хэрэглэгч урсгал:
 *  1) Input-д ажлын нэр бичнэ
 *  2) A/B/C/D товчлуур дээр дарснаар зэрэг сонгогдож шууд карт болж ордог
 *  3) Карт дээр quick-actions: ✓ дуусгах, засах, устгах, зэрэг солих
 */
export default function ChatUI({ tasks, setTasks }) {
  const [draft, setDraft] = useState('')
  const [filter, setFilter] = useState(new Set())
  const scrollRef = useRef(null)

  const visible = sortTasks(filterTasks(tasks, [...filter]))

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [tasks.length])

  const addTask = (priority) => {
    const title = draft.trim()
    if (!title) return
    const t = {
      id: crypto.randomUUID(),
      title,
      priority,
      done: false,
      createdAt: Date.now(),
    }
    setTasks((prev) => [...prev, t])
    setDraft('')
  }

  const toggle = (id) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  const remove = (id) => setTasks((prev) => prev.filter((t) => t.id !== id))
  const edit = (id, title) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)))
  const setPriority = (id, priority) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, priority } : t)))

  return (
    <div className="flex flex-col h-full">
      {/* Шүүгч */}
      <div className="px-3 pt-2 pb-2 border-b border-slate-100">
        <FilterBar value={filter} onChange={setFilter} />
      </div>

      {/* Чат талбар */}
      <div ref={scrollRef} className="chat-scroll flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {/* Системийн анхны мессеж */}
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-100 px-3 py-2 text-sm text-slate-700">
          Сайн уу! Өнөөдрийн ажлаа бичээд <b>A / B / C / D</b> гэснээр зэрэглэл
          сонгоорой. Бүх ажил автоматаар эрэмбэлэгдэнэ.
        </div>

        {visible.length === 0 && (
          <div className="text-center text-xs text-slate-400 py-8">
            Одоогоор ажил алга. Доороос шинэ ажил нэм.
          </div>
        )}

        {visible.map((t) => (
          <TaskCard
            key={t.id}
            task={t}
            onToggle={toggle}
            onDelete={remove}
            onEdit={edit}
            onSetPriority={setPriority}
          />
        ))}
      </div>

      {/* Input + A/B/C/D товч */}
      <div className="border-t border-slate-200 bg-white p-2 pb-safe">
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addTask('B')
            }}
            placeholder="Жишээ: Имэйл унших, хурал бэлдэх..."
            className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-slate-400"
          />
          <button
            onClick={() => addTask('B')}
            aria-label="Илгээх"
            className="h-9 w-9 shrink-0 rounded-full bg-slate-900 text-white flex items-center justify-center"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2 grid grid-cols-4 gap-2">
          {PRIORITY_ORDER.map((k) => (
            <button
              key={k}
              onClick={() => addTask(k)}
              disabled={!draft.trim()}
              className={[
                'rounded-xl py-2 text-xs font-bold transition disabled:opacity-40 disabled:cursor-not-allowed',
                PRIORITIES[k].chip,
              ].join(' ')}
              title={PRIORITIES[k].hint}
            >
              {k} · {PRIORITIES[k].label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
