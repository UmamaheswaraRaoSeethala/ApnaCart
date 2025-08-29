import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { autoLinkVegetableImage } from '@/utils/imageUtils'

const prisma = new PrismaClient()

// PUT /api/vegetables/[id] - Update a vegetable
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid vegetable ID' },
        { status: 400 }
      )
    }

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

    // Check if vegetable exists
    const existingVegetable = await prisma.vegetable.findUnique({
      where: { id }
    })

    if (!existingVegetable) {
      return NextResponse.json(
        { success: false, error: 'Vegetable not found' },
        { status: 404 }
      )
    }

    // Automatically link the best available image
    const autoLinkedImage = autoLinkVegetableImage(name, imageUrl)

    // Update the vegetable with automatically linked image
    const updatedVegetable = await prisma.vegetable.update({
      where: { id },
      data: {
        name: name.trim(),
        fixedWeight,
        weightUnit: fixedWeight, // Keep for backward compatibility
        imageUrl: autoLinkedImage // Use automatically linked image
      }
    })

    return NextResponse.json({
      success: true,
      vegetable: updatedVegetable,
      message: `Vegetable updated successfully with automatically linked image: ${autoLinkedImage}`
    })
  } catch (error) {
    console.error('Error updating vegetable:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update vegetable' },
      { status: 500 }
    )
  }
}

// DELETE /api/vegetables/[id] - Delete a vegetable
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid vegetable ID' },
        { status: 400 }
      )
    }

    // Check if vegetable exists
    const existingVegetable = await prisma.vegetable.findUnique({
      where: { id }
    })

    if (!existingVegetable) {
      return NextResponse.json(
        { success: false, error: 'Vegetable not found' },
        { status: 404 }
      )
    }

    // Delete the vegetable
    await prisma.vegetable.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Vegetable deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting vegetable:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete vegetable' },
      { status: 500 }
    )
  }
}