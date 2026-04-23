import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router'
import { clearAuthenticatedSession } from '../authSession'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'

export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNavigate = (path: string) => {
    if (path === '/logout') {
      clearAuthenticatedSession()
      navigate('/login')
      setMobileOpen(false)
      return
    }

    navigate(path)
    setMobileOpen(false)
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#fafaf7',
        fontFamily: "'DM Sans', 'Trebuchet MS', sans-serif",
      }}
    >
      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar
        activePath={location.pathname}
        onNavigate={handleNavigate}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Columna principal */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        {/* TopBar sticky */}
        <TopBar
          sectionTitle="SOLARIS ASSETS"
          user={{ name: 'Ana García' }}
          notificationCount={3}
          onMenuClick={() => setMobileOpen((o) => !o)}
        />

        {/* Área de contenido scrolleable */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
          }}
          id="main-content"
          role="main"
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
