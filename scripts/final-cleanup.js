const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🧹 Final cleanup and image linking...')
    
    // Fix Potato image
    const potato = await prisma.vegetable.findFirst({
      where: { name: 'Potato' }
    })
    
    if (potato && !potato.imageUrl) {
      await prisma.vegetable.update({
        where: { id: potato.id },
        data: { imageUrl: '/images/Potato.jpeg' }
      })
      console.log('✅ Fixed Potato with image: /images/Potato.jpeg')
    }
    
    // Remove duplicate Drumstick (keep the one with 250g)
    const drumstickDuplicates = await prisma.vegetable.findMany({
      where: {
        name: {
          contains: 'Drum'
        }
      }
    })
    
    if (drumstickDuplicates.length > 1) {
      // Keep the one with 250g, remove the 500g one
      const toRemove = drumstickDuplicates.find(v => v.weightUnit === '500g')
      if (toRemove) {
        await prisma.vegetable.delete({
          where: { id: toRemove.id }
        })
        console.log('🗑️ Removed duplicate Drumstick (500g)')
      }
    }
    
    // Fix Sweet Potato - it shouldn't use Potato.jpeg
    const sweetPotato = await prisma.vegetable.findFirst({
      where: { name: 'Sweet Potato' }
    })
    
    if (sweetPotato && sweetPotato.imageUrl === '/images/Potato.jpeg') {
      await prisma.vegetable.update({
        where: { id: sweetPotato.id },
        data: { imageUrl: '/images/Sweet Potato.jpeg' }
      })
      console.log('✅ Fixed Sweet Potato with correct image: /images/Sweet Potato.jpeg')
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
    
    console.log(`\n📈 Final Summary:`)
    console.log(`  - Vegetables with images: ${withImages}`)
    console.log(`  - Vegetables without images: ${withoutImages}`)
    console.log(`  - Total vegetables: ${finalVegetables.length}`)
    
    if (withoutImages === 0) {
      console.log('🎉 All vegetables now have images!')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
