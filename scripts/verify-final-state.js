const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🔍 Verifying final database state...')
    
    const vegetables = await prisma.vegetable.findMany({
      orderBy: { name: 'asc' }
    })
    
    console.log(`📊 Total vegetables: ${vegetables.length}`)
    
    const withImages = vegetables.filter(v => v.imageUrl).length
    const withoutImages = vegetables.filter(v => !v.imageUrl).length
    
    console.log(`✅ Vegetables with images: ${withImages}`)
    console.log(`❌ Vegetables without images: ${withoutImages}`)
    
    if (withoutImages === 0) {
      console.log('🎉 SUCCESS: All vegetables now have images!')
    } else {
      console.log('\nVegetables without images:')
      vegetables.filter(v => !v.imageUrl).forEach(v => {
        console.log(`  - ${v.name} (${v.weightUnit})`)
      })
    }
    
    console.log('\n📋 Complete vegetable list:')
    vegetables.forEach(v => {
      const status = v.imageUrl ? '✅' : '❌'
      console.log(`${status} ${v.name} (${v.weightUnit}) - ${v.imageUrl || 'No Image'}`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
