const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🔍 Checking database...')
    
    // Check if there are any vegetables
    const vegetables = await prisma.vegetable.findMany()
    console.log(`📊 Found ${vegetables.length} vegetables in database:`)
    
    if (vegetables.length === 0) {
      console.log('❌ No vegetables found. Adding sample vegetables...')
      
      // Add sample vegetables
      const sampleVegetables = [
        { name: 'Tomato', weightUnit: '500g' },
        { name: 'Onion', weightUnit: '500g' },
        { name: 'Potato', weightUnit: '500g' },
        { name: 'Carrot', weightUnit: '250g' },
        { name: 'Cucumber', weightUnit: '250g' },
        { name: 'Bell Pepper', weightUnit: '250g' },
        { name: 'Spinach', weightUnit: '250g' },
        { name: 'Broccoli', weightUnit: '500g' }
      ]
      
      for (const veg of sampleVegetables) {
        const created = await prisma.vegetable.create({
          data: veg
        })
        console.log(`✅ Added: ${created.name} (${created.weightUnit})`)
      }
      
      console.log('🎉 Sample vegetables added successfully!')
    } else {
      vegetables.forEach(veg => {
        console.log(`  - ${veg.name} (${veg.weightUnit})`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()



