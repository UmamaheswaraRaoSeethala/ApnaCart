const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🔧 Fixing remaining image links...')
    
    // Fix specific vegetables that need images
    const fixes = [
      { name: 'Potato', imageUrl: '/images/Potato.jpeg' },
      { name: 'Drum Stick', imageUrl: '/images/Drumstick.jpg' },
      { name: 'Green Chilli Dark', imageUrl: '/images/Green Chilli Dark.jpeg' }
    ]
    
    for (const fix of fixes) {
      const vegetable = await prisma.vegetable.findFirst({
        where: {
          name: {
            contains: fix.name
          }
        }
      })
      
      if (vegetable) {
        await prisma.vegetable.update({
          where: { id: vegetable.id },
          data: { imageUrl: fix.imageUrl }
        })
        console.log(`✅ Fixed ${vegetable.name} with image: ${fix.imageUrl}`)
      }
    }
    
    // Remove duplicate Green Chilli Dark since it's now merged with Green Chilli
    const duplicateGreenChilli = await prisma.vegetable.findFirst({
      where: {
        name: 'Green Chilli Dark'
      }
    })
    
    if (duplicateGreenChilli) {
      await prisma.vegetable.delete({
        where: { id: duplicateGreenChilli.id }
      })
      console.log(`🗑️ Removed duplicate: Green Chilli Dark`)
    }
    
    // Show final state
    const finalVegetables = await prisma.vegetable.findMany({
      orderBy: { name: 'asc' }
    })
    
    console.log(`\n📊 Final vegetables in database: ${finalVegetables.length}`)
    finalVegetables.forEach(veg => {
      console.log(`  - ${veg.name} (${veg.weightUnit})${veg.imageUrl ? ` - Image: ${veg.imageUrl}` : ' - No Image'}`)
    })
    
    // Count vegetables with and without images
    const withImages = finalVegetables.filter(v => v.imageUrl).length
    const withoutImages = finalVegetables.filter(v => !v.imageUrl).length
    
    console.log(`\n📈 Summary:`)
    console.log(`  - Vegetables with images: ${withImages}`)
    console.log(`  - Vegetables without images: ${withoutImages}`)
    console.log(`  - Total vegetables: ${finalVegetables.length}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
