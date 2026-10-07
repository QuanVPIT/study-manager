import { useTheme, type Theme } from '../lib/useTheme'

const OPTIONS: { value: Theme; icon: string; label: string }[] = [
  { value: 'light', icon: '☀️', label: 'Light' },
  { value: 'dark', icon: '🌙', label: 'Dark' },
  { value: 'system', icon: '💻', label: 'System' },
]

// 3 small buttons side by side. The selected one looks "pressed".
function ThemeToggle() {
  const [theme, setTheme] = useTheme()

  return (
    <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-700" role="group" aria-label="Color theme">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          onClick={() => setTheme(o.value)}
          title={o.label}
          aria-pressed={theme === o.value} // tells screen readers which one is selected
          className={`flex-1 rounded-lg px-2 py-1 text-sm transition ${
            theme === o.value
              ? 'bg-white font-semibold text-slate-800 shadow-sm dark:bg-slate-900 dark:text-slate-100'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100'
          }`}
        >
          {o.icon} <span className="hidden lg:inline">{o.label}</span>
        </button>
      ))}
    </div>
  )
}

export default ThemeToggle
