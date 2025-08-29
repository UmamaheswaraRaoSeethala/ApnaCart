const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('⚖️ Checking current vegetable weights...')
    
    const vegetables = await prisma.vegetable.findMany({
      orderBy: { name: 'asc' }
    })
    
    console.log(`📊 Total vegetables: ${vegetables.length}`)
    console.log('\n📋 Current vegetable weights:')
    
    vegetables.forEach(v => {
      console.log(`  - ${v.name}: ${v.weightUnit} - Image: ${v.imageUrl ? '✅' : '❌'}`)
    })
    
    // Check for any vegetables that might have incorrect weights
    console.log('\n🔍 Weight analysis:')
    const weightCounts = {}
    vegetables.forEach(v => {
      weightCounts[v.weightUnit] = (weightCounts[v.weightUnit] || 0) + 1
    })
    
    Object.entries(weightCounts).forEach(([weight, count]) => {
      console.log(`  - ${weight}: ${count} vegetables`)
    })
    
    // Ask user what weights should be for specific vegetables
    console.log('\n❓ Please let me know if any weights are incorrect:')
    console.log('  - Which vegetables have wrong weights?')
    console.log('  - What should the correct weights be?')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()

