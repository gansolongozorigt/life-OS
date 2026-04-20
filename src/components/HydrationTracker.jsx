import { useEffect, useState } from 'react'
import { Plus, Minus, Settings2 } from 'lucide-react'

// Мэдэгдэл илгээх зөвшөөрөл хүсэх функц
const requestPermission = async () => {
  if (!("Notification" in window)) {
    console.log("Энэ хөтөч мэдэгдэл дэмжихгүй байна.");
    return;
  }
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    console.log("Мэдэгдэл зөвшөөрөгдлөө");
  }
};

// Service Worker-оор дамжуулан мэдэгдэл илгээх функц
const triggerReminder = () => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      action: 'water-reminder'
    });
  }
};

export default function HydrationTracker() {
  const [showSettings, setShowSettings] = useState(false);
  const [current, setCurrent] = useState(0);
  const [state, setState] = useState({
    unitMl: 250,
    goalMl: 2000
  });

  // Апп ачаалагдах үед зөвшөөрөл хүсэх
  useEffect(() => {
    requestPermission();
  }, []);

  const add = (amount) => {
    setCurrent((prev) => Math.max(0, prev + amount));
    
    // Хэрэв ус нэмж байгаа бол (хасах биш) мэдэгдэл ажиллуулах
    if (amount > 0) {
      triggerReminder();
    }
  };

  const pct = Math.min(100, Math.round((current / state.goalMl) * 100));

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">Ус уух бүртгэл</h3>
        <button
          onClick={() => setShowSettings((v) => !v)}
          className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
          aria-label="Тохиргоо"
        >
          <Settings2 className="h-5 w-5" />
        </button>
      </div>

      <div className="mb-2 flex items-baseline justify-between text-sm">
        <span className="font-medium text-sky-600">{current} мл</span>
        <span className="text-slate-500">/ {state.goalMl} мл ({pct}%)</span>
      </div>

      <div className="h-3 rounded-full bg-sky-50 overflow-hidden">
        <div
          className="h-full bg-sky-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          onClick={() => add(-state.unitMl)}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 active:scale-95 transition-transform"
        >
          <Minus className="h-4 w-4" /> {state.unitMl}мл
        </button>
        <button
          onClick={() => add(state.unitMl)}
          className="inline-flex items-center gap-1 rounded-full bg-sky-500 text-white px-4 py-1.5 text-sm font-medium shadow-sm shadow-sky-200 hover:bg-sky-600 active:scale-95 transition-transform"
        >
          <Plus className="h-4 w-4" /> {state.unitMl}мл нэмэх
        </button>
      </div>

      {showSettings && (
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 animate-in fade-in slide-in-from-top-2">
          <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600">
            Нэг уулт (мл)
            <input
              type="number"
              min="50"
              step="50"
              value={state.unitMl}
              onChange={(e) =>
                setState((s) => ({ ...s, unitMl: Math.max(50, +e.target.value || 0) }))
              }
              className="rounded-lg border border-slate-200 px-2 py-1.5 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600">
            Өдрийн зорилт (мл)
            <input
              type="number"
              min="500"
              step="100"
              value={state.goalMl}
              onChange={(e) =>
                setState((s) => ({ ...s, goalMl: Math.max(500, +e.target.value || 0) }))
              }
              className="rounded-lg border border-slate-200 px-2 py-1.5 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
            />
          </label>
        </div>
      )}
    </div>
  )
}
