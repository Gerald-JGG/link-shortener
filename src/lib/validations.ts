import { z } from 'zod'

/**
 * Schema para crear un nuevo link
 */
export const createLinkSchema = z.object({
  originalUrl: z
    .string()
    .min(1, 'La URL es requerida')
    .url('La URL no es válida')
    .refine((url) => {
      // Validar que no sea una URL local
      try {
        const urlObj = new URL(url)
        return !['localhost', '127.0.0.1', '0.0.0.0'].includes(urlObj.hostname)
      } catch {
        return false
      }
    }, 'No se permiten URLs locales'),
  
  shortCode: z
    .string()
    .min(3, 'El código debe tener al menos 3 caracteres')
    .max(10, 'El código debe tener máximo 10 caracteres')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Solo se permiten letras, números, guiones y guiones bajos')
    .optional(),
  
  title: z
    .string()
    .max(255, 'El título debe tener máximo 255 caracteres')
    .optional(),
  
  description: z
    .string()
    .max(500, 'La descripción debe tener máximo 500 caracteres')
    .optional(),
  
  expiresAt: z
    .string()
    .datetime()
    .optional()
    .refine((date) => {
      if (!date) return true
      return new Date(date) > new Date()
    }, 'La fecha de expiración debe ser futura'),
  
  password: z
    .string()
    .min(4, 'La contraseña debe tener al menos 4 caracteres')
    .max(50, 'La contraseña debe tener máximo 50 caracteres')
    .optional(),
  
  maxClicks: z
    .number()
    .positive('El máximo de clicks debe ser positivo')
    .int('El máximo de clicks debe ser un número entero')
    .optional(),
})

/**
 * Schema para actualizar un link existente
 */
export const updateLinkSchema = z.object({
  title: z
    .string()
    .max(255, 'El título debe tener máximo 255 caracteres')
    .optional(),
  
  description: z
    .string()
    .max(500, 'La descripción debe tener máximo 500 caracteres')
    .optional(),
  
  isActive: z
    .boolean()
    .optional(),
  
  expiresAt: z
    .string()
    .datetime()
    .nullable()
    .optional(),
  
  maxClicks: z
    .number()
    .positive()
    .int()
    .nullable()
    .optional(),
})

/**
 * Schema para verificar contraseña de link protegido
 */
export const verifyPasswordSchema = z.object({
  password: z.string().min(1, 'La contraseña es requerida'),
})

/**
 * Types inferidos de los schemas
 */
export type CreateLinkInput = z.infer<typeof createLinkSchema>
export type UpdateLinkInput = z.infer<typeof updateLinkSchema>
export type VerifyPasswordInput = z.infer<typeof verifyPasswordSchema>