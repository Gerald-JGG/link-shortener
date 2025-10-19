import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'

export async function POST(req: Request) {
  const { url } = await req.json()

  if (!url) {
    return NextResponse.json({ error: 'URL requerida' }, { status: 400 })
  }

  const shortCode = nanoid(6)

  const link = await prisma.link.create({
    data: { originalUrl: url, shortCode },
  })

  return NextResponse.json({ shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${shortCode}` })
}
