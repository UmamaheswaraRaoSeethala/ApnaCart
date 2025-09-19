import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const vegetables = [
  { name: 'Beerakaya', fixedWeight: '500g', weightUnit: '500g', imageUrl: '/images/Beerakaya.jpeg' },
  { name: 'Beetroot', fixedWeight: '250g', weightUnit: '250g', imageUrl: '/images/Beetroot.jpg' },
  { name: 'Bitter Gourd', fixedWeight: '500g', weightUnit: '500g', imageUrl: '/images/Bitter Gourd.jpeg' },
  { name: 'Bottle Gourd(Sorakaya)', fixedWeight: '500g', weightUnit: '500g', imageUrl: '/images/Bottle Gourd(Sorakaya).jpeg' },
  { name: 'Brinjal Vilote', fixedWeight: '250g', weightUnit: '250g', imageUrl: '/images/Brinjal Vilote.jpg' },
  { name: 'Brinjal White', fixedWeight: '250g', weightUnit: '250g', imageUrl: '/images/Brinjal white.jpeg' },
  { name: 'Broad Beans', fixedWeight: '250g', weightUnit: '250g', imageUrl: '/images/Broad Beans.jpeg' },
  { name: 'Cabbage(1-piece)', fixedWeight: '500g', weightUnit: '500g', imageUrl: '/images/Cabbage.jpg' },
  { name: 'Capsicum', fixedWeight: '250g', weightUnit: '250g', imageUrl: '/images/Capsicum.png' },
  { name: 'Carrot', fixedWeight: '500g', weightUnit: '500g', imageUrl: '/images/Carrot.webp' },
  { name: 'Cauliflower (1-piece)', fixedWeight: '500g', weightUnit: '500g', imageUrl: '/images/Cauliflower.png' },
  { name: 'Chamagadda', fixedWeight: '500g', weightUnit: '500g', imageUrl: '/images/Chamagadda.png' },
  { name: 'Cluster Beans', fixedWeight: '250g', weightUnit: '250g', imageUrl: '/images/Cluster Beans.jpeg' },
  { name: 'Cucumber', fixedWeight: '500g', weightUnit: '500g', imageUrl: '/images/Cucumber.jpg' },
  { name: 'Curry Leaves + Coriander + Mint Leaves', fixedWeight: '250g', weightUnit: '250g', imageUrl: '/images/Curry-Leaves-Coriander-Mint-Leaves.png' },
  { name: 'Dondakaya', fixedWeight: '250g', weightUnit: '250g', imageUrl: '/images/Dondakaya.jpeg' },
  { name: 'Dosakaya(1-2 pieces)', fixedWeight: '250g', weightUnit: '250g', imageUrl: '/images/Dosakaya(1-2 pieces).jpeg' },
  { name: 'Drumstick(3-4 pieces)', fixedWeight: '250g', weightUnit: '250g', imageUrl: '/images/Drumstick.jpg' },
  { name: 'French Beans', fixedWeight: '250g', weightUnit: '250g', imageUrl: '/images/French Beans.jpeg' },
  { name: 'Garlic', fixedWeight: '250g', weightUnit: '250g', imageUrl: '/images/Garlic.jpeg' },
  { name: 'Ginger', fixedWeight: '250g', weightUnit: '250g', imageUrl: '/images/Ginger.jpg' },
  { name: 'Gongura Leaves', fixedWeight: '250g', weightUnit: '250g', imageUrl: '/images/Gongura Leaves.jpeg' },
  { name: 'Green Chilli Dark', fixedWeight: '250g', weightUnit: '250g', imageUrl: '/images/Green Chilli Dark.jpeg' },
  { name: 'Green Chilli', fixedWeight: '250g', weightUnit: '250g', imageUrl: '/images/Green Chilli.jpeg' },
  { name: 'Ladies Finger', fixedWeight: '250g', weightUnit: '250g', imageUrl: '/images/Ladies Finger.jpg' },
  { name: 'Lemon (4-6 pieces)', fixedWeight: '250g', weightUnit: '250g', imageUrl: '/images/Lemon.jpg' },
  { name: 'Onion', fixedWeight: '500g', weightUnit: '500g', imageUrl: '/images/Onion.jpg' },
  { name: 'Palakura Leaves', fixedWeight: '250g', weightUnit: '250g', imageUrl: '/images/Palakura Leaves.jpeg' },
  { name: 'Potato', fixedWeight: '500g', weightUnit: '500g', imageUrl: '/images/Potato.jpeg' },
  { name: 'Raw Banana(1-2 Pieces)', fixedWeight: '250g', weightUnit: '250g', imageUrl: '/images/Raw Banana(2 pieces).jpeg' },
  { name: 'Raw Mango(2 pieces)', fixedWeight: '250g', weightUnit: '250g', imageUrl: '/images/Raw Mango.jpeg' },
  { name: 'Sweet Potato', fixedWeight: '250g', weightUnit: '250g', imageUrl: '/images/Sweet Potato.jpeg' },
  { name: 'Tomato', fixedWeight: '500g', weightUnit: '500g', imageUrl: '/images/Tomato.jpeg' }
]

async function main() {
  console.log('🌱 Starting to seed the database...')
  
  // Clear existing vegetables
  await prisma.vegetable.deleteMany()
  console.log('🗑️ Cleared existing vegetables')
  
  // Add vegetables
  for (const vegetable of vegetables) {
    await prisma.vegetable.create({
      data: vegetable
    })
  }
  
  console.log(`✅ Added ${vegetables.length} vegetables to the database`)
  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
