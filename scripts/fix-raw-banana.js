const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🍌 Fixing Raw Banana image link...')
    
    // Find Raw Banana products
    const rawBananaProducts = await prisma.vegetable.findMany({
      where: {
        name: {
          contains: 'Raw Banana'
        }
      }
    })
    
    console.log(`Found ${rawBananaProducts.length} Raw Banana products:`)
    rawBananaProducts.forEach(v => {
      console.log(`  - ${v.name} (${v.weightUnit}) - Current Image: ${v.imageUrl || 'No Image'}`)
    })
    
    // Update each Raw Banana product with the correct image
    for (const product of rawBananaProducts) {
      await prisma.vegetable.update({
        where: { id: product.id },
        data: { imageUrl: '/images/Raw Banana(2 pieces).jpeg' }
      })
      console.log(`✅ Updated ${product.name} with image: /images/Raw Banana(2 pieces).jpeg`)
    }
    
    // Verify the update
    const updatedProducts = await prisma.vegetable.findMany({
      where: {
        name: {
          contains: 'Raw Banana'
        }
      }
    })
    
    console.log('\n📋 Updated Raw Banana products:')
    updatedProducts.forEach(v => {
      console.log(`  - ${v.name} (${v.weightUnit}) - Image: ${v.imageUrl}`)
    })
    
    // Also check if there are any other vegetables without images
    const allVegetables = await prisma.vegetable.findMany()
    const withoutImages = allVegetables.filter(v => !v.imageUrl)
    
    if (withoutImages.length > 0) {
      console.log(`\n⚠️  Vegetables still without images: ${withoutImages.length}`)
      withoutImages.forEach(v => {
        console.log(`  - ${v.name} (${v.weightUnit})`)
      })
    } else {
      console.log('\n🎉 All vegetables now have images!')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
