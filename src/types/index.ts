import { Link, ClickStat } from '@prisma/client'

/**
 * Link con estadísticas incluidas
 */
export type LinkWithStats = Link & {
  clickStats: ClickStat[]
}

/**
 * Respuesta estándar de la API
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * Estadísticas resumidas de un link
 */
export interface LinkStats {
  totalClicks: number
  uniqueClicks: number
  clicksByDay: {
    date: string
    clicks: number
  }[]
  clicksByCountry: {
    country: string
    clicks: number
  }[]
  clicksByDevice: {
    device: string
    clicks: number
  }[]
  clicksByBrowser: {
    browser: string
    clicks: number
  }[]
  topReferrers: {
    referer: string
    clicks: number
  }[]
}

/**
 * Información del dispositivo del usuario
 */
export interface DeviceInfo {
  device: string | null  // mobile, desktop, tablet
  browser: string | null // chrome, firefox, safari, etc
  os: string | null      // windows, macos, android, ios, linux
}

/**
 * Información de geolocalización
 */
export interface GeoLocation {
  country: string | null
  city: string | null
}

/**
 * Datos para crear un click stat
 */
export interface CreateClickStatData {
  linkId: string
  userAgent?: string
  referer?: string
  ipAddress?: string
  country?: string
  city?: string
  device?: string
  browser?: string
  os?: string
}

/**
 * Filtros para listar links
 */
export interface LinkFilters {
  isActive?: boolean
  search?: string
  orderBy?: 'createdAt' | 'clicks' | 'updatedAt'
  order?: 'asc' | 'desc'
  limit?: number
  offset?: number
}