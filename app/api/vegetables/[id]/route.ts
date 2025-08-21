import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

