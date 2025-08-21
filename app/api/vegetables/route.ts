import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/vegetables - Get all vegetables
export async function GET() {
  try {
    const vegetables = await prisma.vegetable.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      vegetables
    })
  } catch (error) {
    console.error('Error fetching vegetables:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vegetables' },
      { status: 500 }
    )
  }
}

// POST /api/vegetables - Add new vegetable
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, weightUnit, imageUrl } = body

    // Validation
    if (!name || !weightUnit) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['250g', '500g'].includes(weightUnit)) {
      return NextResponse.json(
        { success: false, error: 'Invalid weight unit. Must be 250g or 500g' },
        { status: 400 }
      )
    }

    // Create vegetable
    const vegetable = await prisma.vegetable.create({
      data: {
        name: name.trim(),
        weightUnit,
        imageUrl: imageUrl || null
      }
    })

    return NextResponse.json({
      success: true,
      vegetable
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating vegetable:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create vegetable' },
      { status: 500 }
    )
  }
}

