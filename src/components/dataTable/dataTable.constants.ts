import type { TenantStatus } from '../../propiedadService'

interface BadgeStyle {
  bg: string
  color: string
  label: string
}

export const BADGE_STYLES: Record<TenantStatus, BadgeStyle> = {
  pagado: { bg: '#eaf6ef', color: '#2e7d4f', label: 'PAGADO' },
  pendiente: { bg: '#fff8e6', color: '#9A6F00', label: 'PENDIENTE' },
  vencido: { bg: '#fdf0f0', color: '#a33030', label: 'VENCIDO' },
}

export interface AvatarColor {
  bg: string
  color: string
}

export const AVATAR_COLORS: AvatarColor[] = [
  { bg: '#e6f1fb', color: '#185FA5' },
  { bg: '#fff8e6', color: '#9A6F00' },
  { bg: '#fdf0f0', color: '#a33030' },
  { bg: '#eaf6ef', color: '#2e7d4f' },
  { bg: '#f3e6fb', color: '#6a3a9a' },
]

export interface Tab {
  key: string
  label: string
}

export const TABS: Tab[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'pagados', label: 'Pagados' },
  { key: 'pendientes', label: 'Pendientes' },
  { key: 'vencidos', label: 'Vencidos' },
]

export const COL_HEADERS: string[] = ['Inquilino', 'Propiedad', 'Estado', 'Vencimiento', 'Monto', 'Acción']

export interface BuildingOption {
  value: string
  label: string
}

export const BUILDING_OPTIONS: BuildingOption[] = [
  { value: 'todos', label: 'Todos los edificios' },
  { value: 'torres-este', label: 'Torres del Este' },
  { value: 'solaris-i', label: 'Torre Solaris I' },
  { value: 'solaris-ii', label: 'Torre Solaris II' },
]
