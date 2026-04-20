import type { ReactNode } from 'react'
import './Sidebar.css'

interface NavItem {
  label: string
  href: string
  icon: ReactNode
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9" />
        <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.6" />
        <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.6" />
        <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.6" />
      </svg>
    ),
  },
  {
    label: 'Properties',
    href: '/properties',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1L1 6v9h5v-4h4v4h5V6L8 1z" fill="currentColor" opacity="0.85" />
      </svg>
    ),
  },
  {
    label: 'Tenants',
    href: '/tenants',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="6" cy="5" r="3" fill="currentColor" opacity="0.9" />
        <path d="M1 14c0-3 2-5 5-5s5 2 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.9" />
        <circle cx="12" cy="5" r="2.5" fill="currentColor" opacity="0.5" />
        <path d="M13 14c0-2.5 1.5-4 2.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
      </svg>
    ),
  },
  {
    label: 'Maintenance',
    href: '/maintenance',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M13.5 2.5a3 3 0 00-4.2 4.2L2 14l1 1 7.3-7.3A3 3 0 0013.5 2.5z" fill="currentColor" opacity="0.85" />
      </svg>
    ),
  },
  {
    label: 'Finances',
    href: '/finances',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="4" width="14" height="9" rx="1.5" fill="currentColor" opacity="0.3" />
        <rect x="1" y="4" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.85" />
        <rect x="3" y="9.5" width="4" height="1.5" rx="0.75" fill="currentColor" opacity="0.85" />
      </svg>
    ),
  },
]

const FOOTER_ITEMS: NavItem[] = [
  {
    label: 'Logout',
    href: '/logout',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.85" />
        <path d="M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.85" />
      </svg>
    ),
  },
]

interface SidebarProps {
  activePath?: string
  onNavigate?: (path: string) => void
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export default function Sidebar({ activePath = '/tenants', onNavigate, mobileOpen = false, onMobileClose }: SidebarProps) {
  const handleNavClick = (href: string) => {
    if (onNavigate) onNavigate(href)
    if (onMobileClose) onMobileClose()
  }

  return (
    <aside className={`sidebar${mobileOpen ? ' sidebar--mobile-open' : ''}`}>
      {/* Logo */}
      <div className="sidebar__logo-area">
        <div className="sidebar__logo-text">SOLARIS</div>
        <div className="sidebar__logo-sub">ADMIN CONSOLE</div>
      </div>

      {/* Nav principal */}
      <nav className="sidebar__nav-section">
        {NAV_ITEMS.map((item) => (
          <div
            key={item.href}
            className={`sidebar__nav-item${activePath === item.href ? ' sidebar__nav-item--active' : ''}`}
            onClick={() => handleNavClick(item.href)}
            role="button"
            aria-current={activePath === item.href ? 'page' : undefined}
          >
            <span className="sidebar__item-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar__footer-section">
        {FOOTER_ITEMS.map((item) => (
          <div
            key={item.href}
            className={`sidebar__nav-item${activePath === item.href ? ' sidebar__nav-item--active' : ''}`}
            onClick={() => handleNavClick(item.href)}
            role="button"
          >
            <span className="sidebar__item-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
        <div className="sidebar__version">SOLARIS v2.6.0 · Enterprise</div>
      </div>
    </aside>
  )
}
