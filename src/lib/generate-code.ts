import { prisma } from './prisma'

// Caracteres permitidos en el código corto
// Evitamos caracteres confusos: 0/O, 1/l/I
const CHARACTERS = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'

/**
 * Genera un código corto aleatorio de la longitud especificada
 */
function generateRandomCode(length: number): string {
  let code = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * CHARACTERS.length)
    code += CHARACTERS[randomIndex]
  }
  return code
}

/**
 * Genera un código corto único verificando que no exista en la base de datos
 * @param length - Longitud del código (por defecto 6)
 * @returns Promise<string> - Código único generado
 */
export async function generateUniqueShortCode(length: number = 6): Promise<string> {
  const maxAttempts = 10
  let attempts = 0
  
  while (attempts < maxAttempts) {
    const code = generateRandomCode(length)
    
    // Verificar que el código no exista en la base de datos
    const existingLink = await prisma.link.findUnique({
      where: { shortCode: code },
      select: { id: true } // Solo necesitamos saber si existe
    })
    
    if (!existingLink) {
      return code
    }
    
    attempts++
  }
  
  // Si después de 10 intentos no encontramos un código único,
  // incrementamos la longitud y volvemos a intentar
  console.warn(`No se pudo generar código único de ${length} caracteres después de ${maxAttempts} intentos. Incrementando longitud...`)
  return generateUniqueShortCode(length + 1)
}

/**
 * Valida si un código corto personalizado es válido y está disponible
 * @param code - Código a validar
 * @returns Promise<{valid: boolean, message?: string}>
 */
export async function validateCustomShortCode(
  code: string
): Promise<{ valid: boolean; message?: string }> {
  // Validar formato
  const formatRegex = /^[a-zA-Z0-9-_]+$/
  if (!formatRegex.test(code)) {
    return {
      valid: false,
      message: 'El código solo puede contener letras, números, guiones y guiones bajos'
    }
  }
  
  // Validar longitud
  if (code.length < 3) {
    return {
      valid: false,
      message: 'El código debe tener al menos 3 caracteres'
    }
  }
  
  if (code.length > 10) {
    return {
      valid: false,
      message: 'El código debe tener máximo 10 caracteres'
    }
  }
  
  // Palabras reservadas que no se pueden usar
  const reservedWords = [
    'api',
    'dashboard',
    'admin',
    'login',
    'register',
    'about',
    'contact',
    'terms',
    'privacy',
    'help',
    'docs',
    'blog'
  ]
  
  if (reservedWords.includes(code.toLowerCase())) {
    return {
      valid: false,
      message: 'Este código está reservado y no se puede usar'
    }
  }
  
  // Verificar disponibilidad en la base de datos
  const existingLink = await prisma.link.findUnique({
    where: { shortCode: code },
    select: { id: true }
  })
  
  if (existingLink) {
    return {
      valid: false,
      message: 'Este código ya está en uso'
    }
  }
  
  return { valid: true }
}