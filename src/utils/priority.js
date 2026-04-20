// Эйзенхауэрын 4 ангилал — нэг эх үүсвэрээс хэрэглэгдэнэ.
export const PRIORITIES = {
  A: {
    key: 'A',
    label: 'Маш чухал',
    hint: 'Яаралтай бөгөөд Чухал',
    // Tailwind class-уудыг build-time-д static-аар оруулна
    card: 'bg-red-50 border-red-500 text-red-900',
    chip: 'bg-red-500 text-white',
    dot: 'bg-red-500',
    order: 0,
  },
  B: {
    key: 'B',
    label: 'Чухал',
    hint: 'Яаралтай бус боловч Чухал',
    card: 'bg-amber-50 border-amber-500 text-amber-900',
    chip: 'bg-amber-500 text-white',
    dot: 'bg-amber-500',
    order: 1,
  },
  C: {
    key: 'C',
    label: 'Тийм ч чухал биш',
    hint: 'Яаралтай боловч Чухал бус',
    card: 'bg-blue-50 border-blue-500 text-blue-900',
    chip: 'bg-blue-500 text-white',
    dot: 'bg-blue-500',
    order: 2,
  },
  D: {
    key: 'D',
    label: 'Чухал биш',
    hint: 'Яаралтай бус, Чухал бус',
    card: 'bg-slate-100 border-slate-400 text-slate-700',
    chip: 'bg-slate-500 text-white',
    dot: 'bg-slate-400',
    order: 3,
  },
}

export const PRIORITY_ORDER = ['A', 'B', 'C', 'D']

export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    const pa = PRIORITIES[a.priority]?.order ?? 99
    const pb = PRIORITIES[b.priority]?.order ?? 99
    if (pa !== pb) return pa - pb
    // Дараа нь бүтээгдсэн цагаар шинэ нь эхэнд
    return (b.createdAt ?? 0) - (a.createdAt ?? 0)
  })
}

export function filterTasks(tasks, selected) {
  // selected: ['A'], эсвэл ['A','B'] гэх мэт. Хоосон бол бүгд.
  if (!selected || selected.length === 0) return tasks
  const set = new Set(selected)
  return tasks.filter((t) => set.has(t.priority))
}
