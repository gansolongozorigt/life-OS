import { useEffect, useState } from 'react'
import ChatUI from './components/ChatUI.jsx'
import MatrixView from './components/MatrixView.jsx'
import HydrationTracker from './components/HydrationTracker.jsx'
import Timer from './components/Timer.jsx'
import FitnessLog from './components/FitnessLog.jsx'
import DailyReflection from './components/DailyReflection.jsx'
import BibleVerseCard from './components/BibleVerseCard.jsx'
import BottomNav from './components/BottomNav.jsx'
import { storage, KEYS, runMigrations } from './services/storage.js'
import { PRIORITIES, sortTasks } from './utils/priority.js'

// Өглөөний тодорхойлолт (05:00-12:00)
function isMorning(d = new Date()) {
  const h = d.getHours()
  return h >= 5 && h < 12
}

export default function App() {
  const [tab, setTab] = useState('chat')
  const [tasks, setTasks] = useState(() => storage.get(KEYS.TASKS, []))

  useEffect(() => {
    runMigrations()
  }, [])

  // Ажлын өөрчлөлт бүрт LocalStorage руу хадгална (эрэмбэлсэн хэлбэрээр).
  useEffect(() => {
    storage.set(KEYS.TASKS, sortTasks(tasks))
  }, [tasks])

  const toggle = (id) => setTasks((p) => p.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  const remove = (id) => setTasks((p) => p.filter((t) => t.id !== id))
  const edit = (id, title) => setTasks((p) => p.map((t) => (t.id === id ? { ...t, title } : t)))
  const setPriority = (id, priority) =>
    setTasks((p) => p.map((t) => (t.id === id ? { ...t, priority } : t)))

  return (
    <div className="flex flex-col h-screen max-w-xl mx-auto bg-white">
      {/* Header */}
      <header className="pt-safe px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Life OS</h1>
          <p className="text-xs text-slate-500">
            {new Date().toLocaleDateString('mn-MN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        {/* Зорилтын товч статистик */}
        <div className="flex gap-1.5 text-[10px] font-bold">
          {['A', 'B', 'C', 'D'].map((k) => {
            const n = tasks.filter((t) => t.priority === k && !t.done).length
            return (
              <span key={k} className={`rounded-md px-1.5 py-0.5 ${PRIORITIES[k].chip}`}>
                {k}·{n}
              </span>
            )
          })}
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 overflow-hidden">
        {tab === 'chat' && (
          <div className="h-full flex flex-col">
            {isMorning() && (
              <div className="px-3 pt-3">
                <BibleVerseCard />
              </div>
            )}
            <div className="flex-1 min-h-0">
              <ChatUI tasks={tasks} setTasks={setTasks} />
            </div>
          </div>
        )}

        {tab === 'matrix' && (
          <div className="h-full overflow-y-auto p-3">
            <MatrixView
              tasks={tasks}
              onToggle={toggle}
              onDelete={remove}
              onEdit={edit}
              onSetPriority={setPriority}
            />
          </div>
        )}

        {tab === 'hydration' && (
          <div className="h-full overflow-y-auto p-3 space-y-3">
            <HydrationTracker />
          </div>
        )}

        {tab === 'timer' && (
          <div className="h-full overflow-y-auto p-3 space-y-3">
            <Timer />
          </div>
        )}

        {tab === 'fitness' && (
          <div className="h-full overflow-y-auto p-3 space-y-3">
            <FitnessLog />
          </div>
        )}

        {tab === 'reflect' && (
          <div className="h-full overflow-y-auto p-3 space-y-3">
            <DailyReflection />
          </div>
        )}
      </main>

      <BottomNav tab={tab} onChange={setTab} />
    </div>
  )
}
