import { Navigate, Route, Routes } from 'react-router'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import CoursesPage from './pages/CoursesPage'
import DeadlinesPage from './pages/DeadlinesPage'
import NotesPage from './pages/NotesPage'

// App decides WHICH page to show for each URL.
function App() {
  return (
    <Routes>
      {/* Every page inside this Route is shown inside <Layout> (sidebar + content) */}
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/deadlines" element={<DeadlinesPage />} />
        <Route path="/notes" element={<NotesPage />} />
        {/* Unknown URL (e.g. /abc) → go back to the dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
