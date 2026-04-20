// LocalStorageService — нэг дор цэгцтэй get/set, schema version,
// fallback (quota-exceeded, private browsing), migration hook.

const PREFIX = 'lifeos:v1:'
const VERSION_KEY = PREFIX + '__schema'
const SCHEMA_VERSION = 1

// Аюулгүй JSON parse — get()-д алдаа гарвал fallback буцаана.
function safeParse(raw, fallback) {
  if (raw == null) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

// Private browsing эсвэл quota-exceeded үед fallback in-memory store.
const memoryStore = new Map()
let storageAvailable = (() => {
  try {
    const k = '__probe__'
    localStorage.setItem(k, '1')
    localStorage.removeItem(k)
    return true
  } catch {
    return false
  }
})()

function rawGet(key) {
  if (!storageAvailable) return memoryStore.get(key) ?? null
  return localStorage.getItem(key)
}

function rawSet(key, value) {
  if (!storageAvailable) {
    memoryStore.set(key, value)
    return
  }
  try {
    localStorage.setItem(key, value)
  } catch (e) {
    // QuotaExceededError — memory store-руу оруулна, алдаа шиддэггүй.
    console.warn('LocalStorage quota хэтэрсэн:', e)
    memoryStore.set(key, value)
  }
}

function rawRemove(key) {
  if (!storageAvailable) {
    memoryStore.delete(key)
    return
  }
  localStorage.removeItem(key)
}

export const storage = {
  get(key, fallback = null) {
    return safeParse(rawGet(PREFIX + key), fallback)
  },
  set(key, value) {
    rawSet(PREFIX + key, JSON.stringify(value))
  },
  remove(key) {
    rawRemove(PREFIX + key)
  },
  // Бүх түлхүүрээр өдрийн тэмдэглэл гэх мэт арилгахад ашиглана.
  clearAll() {
    if (!storageAvailable) {
      memoryStore.clear()
      return
    }
    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith(PREFIX)) keys.push(k)
    }
    keys.forEach((k) => localStorage.removeItem(k))
  },
}

// Schema migration cүэл (ирээдүйд схем солигдвол энд хийнэ).
export function runMigrations() {
  const current = storage.get('__schema', 0)
  if (current === SCHEMA_VERSION) return
  // TODO: v0 → v1 гэх мэт migration-ууд энд.
  storage.set('__schema', SCHEMA_VERSION)
}

// Нийтлэг key-үүд (типо болохоос сэргийлнэ).
export const KEYS = {
  TASKS: 'tasks',
  HYDRATION: 'hydration',
  FITNESS: 'fitness',
  REFLECTIONS: 'reflections',
  TIMERS: 'timers',
  SETTINGS: 'settings',
}
