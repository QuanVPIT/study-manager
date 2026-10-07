import { NavLink, Outlet } from 'react-router'
import ThemeToggle from './ThemeToggle'

// The menu items. Each one has its own color (our "colorful" design style).
// NOTE: Tailwind only sees FULL class names written in the code,
// so we write "bg-violet-500" completely instead of building it like `bg-${color}-500`.
const navItems = [
  { to: '/', label: 'Dashboard', icon: '🏠', active: 'bg-violet-500 text-white', hover: 'hover:bg-violet-100 dark:hover:bg-violet-900/40' },
  { to: '/courses', label: 'Courses', icon: '📘', active: 'bg-sky-500 text-white', hover: 'hover:bg-sky-100 dark:hover:bg-sky-900/40' },
  { to: '/deadlines', label: 'Deadlines', icon: '⏰', active: 'bg-rose-500 text-white', hover: 'hover:bg-rose-100 dark:hover:bg-rose-950/40' },
  { to: '/notes', label: 'Notes', icon: '📝', active: 'bg-amber-500 text-white', hover: 'hover:bg-amber-100 dark:hover:bg-amber-900/40' },
]

// Layout = the frame around every page: a sidebar on the left, the page on the right.
function Layout() {
  return (
    // Phone: menu on top (flex-col). Bigger screens (md:): menu on the left (flex-row).
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900 md:flex-row">
      <aside className="bg-white dark:bg-slate-800 p-4 shadow-sm md:w-60 md:shrink-0">
        <h1 className="mb-6 text-2xl font-extrabold">
          📚{' '}
          {/* Gradient text: paint a gradient background, then "clip" it to the letters */}
          <span className="bg-linear-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
            Study Manager
          </span>
        </h1>

        <nav className="flex gap-2 overflow-x-auto md:flex-col">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end // "/" should only be active on exactly "/", not on "/courses" too
              // NavLink tells us if this link matches the current URL (isActive)
              className={({ isActive }) =>
                `flex items-center gap-3 whitespace-nowrap rounded-xl px-4 py-2 font-medium transition ${
                  isActive ? item.active : `text-slate-600 dark:text-slate-300 ${item.hover}`
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* ☀️ / 🌙 / 💻 theme switcher */}
        <div className="mt-4 md:mt-8">
          <ThemeToggle />
        </div>
      </aside>

      {/* <Outlet /> is the "slot" where the current page appears */}
      <main className="flex-1 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
