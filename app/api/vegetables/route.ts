import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { autoLinkVegetableImage } from '@/utils/imageUtils'

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
    const { name, fixedWeight, imageUrl } = body

    // Validation
    if (!name || !fixedWeight) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['250g', '500g', '1kg'].includes(fixedWeight)) {
      return NextResponse.json(
        { success: false, error: 'Invalid weight. Must be 250g, 500g, or 1kg' },
        { status: 400 }
      )
    }

    // Automatically link the best available image
    const autoLinkedImage = autoLinkVegetableImage(name, imageUrl)

    // Create vegetable with automatically linked image
    const vegetable = await prisma.vegetable.create({
      data: {
        name: name.trim(),
        fixedWeight,
        weightUnit: fixedWeight, // Keep for backward compatibility
        imageUrl: autoLinkedImage // Use automatically linked image
      }
    })

    return NextResponse.json({
      success: true,
      vegetable,
      message: `Vegetable created successfully with automatically linked image: ${autoLinkedImage}`
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating vegetable:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create vegetable' },
      { status: 500 }
    )
  }
}

