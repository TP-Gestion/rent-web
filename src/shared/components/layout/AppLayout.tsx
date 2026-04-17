import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import styles from './AppLayout.module.css'

export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNavigate = (path: string) => {
    navigate(path)
    setMobileOpen(false)
  }

  return (
    <div className={styles.layoutRoot}>
      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className={styles.sidebarOverlay}
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
      <div className={styles.mainColumn}>
        {/* TopBar sticky */}
        <TopBar
          sectionTitle="SOLARIS ASSETS"
          user={{ name: 'Ana García' }}
          notificationCount={3}
          onMenuClick={() => setMobileOpen((o) => !o)}
        />

        {/* Área de contenido scrolleable */}
        <main
          className={styles.mainContent}
          id="main-content"
          role="main"
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
