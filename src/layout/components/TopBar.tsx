import { useState, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { usePropertiesSummary } from '../../hooks/usePropertiesSummary'
import './TopBar.css'

const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M8 1.5A4.5 4.5 0 003.5 6v3.5L2 11h12l-1.5-1.5V6A4.5 4.5 0 008 1.5z"
      fill="currentColor"
      opacity="0.85"
    />
    <path d="M6.5 11.5a1.5 1.5 0 003 0" fill="currentColor" opacity="0.85" />
  </svg>
)

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="2.5" fill="currentColor" opacity="0.85" />
    <path
      d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.85"
    />
  </svg>
)

const SearchIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    className="topbar__search-icon"
  >
    <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
  </svg>
)

function getInitials(name = ''): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

interface User {
  name: string
}

interface TopBarProps {
  sectionTitle?: string
  user?: User
  notificationCount?: number
  onSearch?: (query: string) => void
  onMenuClick?: () => void
  onNotificationsClick?: () => void
  onSettingsClick?: () => void
  onAvatarClick?: () => void
}

export default function TopBar({
  sectionTitle,
  user,
  notificationCount,
  onSearch,
  onMenuClick,
  onNotificationsClick,
  onSettingsClick,
  onAvatarClick,
}: TopBarProps) {
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  
  const navigate = useNavigate()
  const { data: properties } = usePropertiesSummary()

  const filteredProperties = useMemo(() => {
    if (!searchValue.trim()) return []
    const query = searchValue.toLowerCase()
    return (properties ?? []).filter((prop) => {
      const edificioStr = (prop.edificio ?? '').toLowerCase()
      const pisoStr = (prop.piso ?? '').toLowerCase()
      const direccionStr = (prop.direccion ?? '').toLowerCase()
      const inquilinoStr = (prop.nombreInquilino ?? '').toLowerCase()
      return (
        edificioStr.includes(query) ||
        pisoStr.includes(query) ||
        direccionStr.includes(query) ||
        inquilinoStr.includes(query) ||
        `${edificioStr} ${pisoStr}`.includes(query)
      )
    }).slice(0, 8)
  }, [searchValue, properties])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
    if (onSearch) onSearch(e.target.value)
  }

  const handleSearchClear = () => {
    setSearchValue('')
    if (onSearch) onSearch('')
    searchRef.current?.focus()
  }

  return (
    <header className="topbar" role="banner">
      {/* Hamburguer - solo mobile */}
      <button
        className="topbar__menu-btn"
        onClick={onMenuClick}
        aria-label="Abrir menú"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Título de sección */}
      <div className="topbar__section-title">
        {sectionTitle}
      </div>

      {/* Buscador */}
      <div className="topbar__search-container">
        <div className={`topbar__search-wrapper${searchFocused ? ' topbar__search-wrapper--focused' : ''}`}>
          <SearchIcon />
          <input
            ref={searchRef}
            type="text"
            placeholder="Buscar propiedad..."
            value={searchValue}
            onChange={handleSearchChange}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            className="topbar__search-input"
          />
          {searchValue && (
            <button
              onClick={handleSearchClear}
              className="topbar__clear-btn"
            >
              x
            </button>
          )}
        </div>

        {searchFocused && searchValue.trim() && (
          <div className="topbar__search-dropdown">
            {filteredProperties.length === 0 ? (
              <div className="topbar__search-no-results">
                No se encontraron propiedades
              </div>
            ) : (
              filteredProperties.map((prop) => (
                <button
                  key={prop.id}
                  className="topbar__search-item"
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                  onClick={() => {
                    navigate(`/propiedades/${prop.id}`)
                    setSearchValue('')
                    setSearchFocused(false)
                    searchRef.current?.blur()
                  }}
                >
                  <div className="topbar__search-item-info">
                    <span className="topbar__search-item-title">
                      {prop.edificio} - {prop.piso}
                    </span>
                    <span className="topbar__search-item-subtitle">
                      {prop.nombreInquilino ? `Inquilino: ${prop.nombreInquilino}` : 'Sin inquilino'}
                    </span>
                  </div>
                  <span
                    className={`topbar__search-item-badge topbar__search-item-badge--${
                      prop.estadoOcupacion === 'OCCUPIED' ? 'occupied' : 'available'
                    }`}
                  >
                    {prop.estadoOcupacion === 'OCCUPIED' ? 'Ocupado' : 'Disponible'}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="topbar__divider" />

      {/* Acciones */}
      <div className="topbar__actions">

        {/* Notificaciones */}
        <button
          className="topbar__icon-btn"
          onClick={onNotificationsClick}
        >
          <BellIcon />
          {notificationCount != null && notificationCount > 0 && <span className="topbar__notif-dot" />}
        </button>

        {/* Settings */}
        <button
          className="topbar__icon-btn"
          onClick={onSettingsClick}
        >
          <SettingsIcon />
        </button>

        {/* Avatar */}
        <button
          className="topbar__avatar-btn"
          onClick={onAvatarClick}
        >
          {getInitials(user?.name)}
        </button>
      </div>
    </header>
  )
}
