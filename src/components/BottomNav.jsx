import { MessageSquare, Grid2x2, Droplet, Timer as TimerIcon, Footprints, NotebookPen } from 'lucide-react'

const TABS = [
  { key: 'chat',      label: 'Чат',    Icon: MessageSquare },
  { key: 'matrix',    label: 'Матриц', Icon: Grid2x2 },
  { key: 'hydration', label: 'Ус',     Icon: Droplet },
  { key: 'timer',     label: 'Таймер', Icon: TimerIcon },
  { key: 'fitness',   label: 'Фитнес', Icon: Footprints },
  { key: 'reflect',   label: 'Дүгнэлт',Icon: NotebookPen },
]

export default function BottomNav({ tab, onChange }) {
  return (
    <nav className="border-t border-slate-200 bg-white/95 backdrop-blur pb-safe">
      <ul className="grid grid-cols-6 text-[10px]">
        {TABS.map(({ key, label, Icon }) => {
          const active = tab === key
          return (
            <li key={key}>
              <button
                onClick={() => onChange(key)}
                className={[
                  'w-full flex flex-col items-center gap-0.5 py-2 transition',
                  active ? 'text-sky-600' : 'text-slate-500 hover:text-slate-700',
                ].join(' ')}
              >
                <Icon className={active ? 'h-5 w-5' : 'h-[18px] w-[18px]'} />
                <span>{label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
