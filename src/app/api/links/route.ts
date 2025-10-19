import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createLinkSchema } from '@/lib/validations'
import { generateUniqueShortCode, validateCustomShortCode } from '@/lib/generate-code'
import type { ApiResponse } from '@/types'
import { Link } from '@prisma/client'

/**
 * POST /api/links
 * Crea un nuevo link acortado
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos de entrada con Zod
    const validation = createLinkSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Datos inválidos',
          message: validation.error.issues[0].message
        },
        { status: 400 }
      )
    }
    
    const data = validation.data
    
    // Generar o validar código corto
    let shortCode: string
    
    if (data.shortCode) {
      // Validar código personalizado
      const validation = await validateCustomShortCode(data.shortCode)
      
      if (!validation.valid) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: 'Código inválido',
            message: validation.message
          },
          { status: 400 }
        )
      }
      
      shortCode = data.shortCode
    } else {
      // Generar código automático
      shortCode = await generateUniqueShortCode()
    }
    
    // Hashear contraseña si existe (en producción usa bcrypt)
    const hashedPassword = data.password
      ? Buffer.from(data.password).toString('base64')
      : null
    
    // Crear link en la base de datos
    const link = await prisma.link.create({
      data: {
        originalUrl: data.originalUrl,
        shortCode,
        title: data.title,
        description: data.description,
        password: hashedPassword,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        maxClicks: data.maxClicks,
      }
    })
    
    return NextResponse.json<ApiResponse<Link>>(
      {
        success: true,
        data: link,
        message: 'Link creado exitosamente'
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Error al crear link:', error)
    
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudo crear el link'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/links
 * Lista todos los links con paginación y filtros
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parámetros de consulta
    const isActive = searchParams.get('isActive')
    const search = searchParams.get('search')
    const orderBy = searchParams.get('orderBy') || 'createdAt'
    const order = searchParams.get('order') || 'desc'
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    // Construir filtros
    const where: any = {}
    
    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }
    
    if (search) {
      where.OR = [
        { originalUrl: { contains: search, mode: 'insensitive' } },
        { shortCode: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    // Obtener links
    const [links, total] = await Promise.all([
      prisma.link.findMany({
        where,
        orderBy: { [orderBy]: order },
        take: limit,
        skip: offset,
        include: {
          _count: {
            select: { clickStats: true }
          }
        }
      }),
      prisma.link.count({ where })
    ])
    
    return NextResponse.json<ApiResponse<{ links: typeof links; total: number }>>(
      {
        success: true,
        data: {
          links,
          total
        }
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Error al obtener links:', error)
    
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudieron obtener los links'
      },
      { status: 500 }
    )
  }
}