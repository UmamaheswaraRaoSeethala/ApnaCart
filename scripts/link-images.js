const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🔍 Checking current database and linking images...')
    
    // Get all vegetables from database
    const vegetables = await prisma.vegetable.findMany()
    console.log(`📊 Found ${vegetables.length} vegetables in database:`)
    vegetables.forEach(v => {
      console.log(`  - ${v.name} (${v.weightUnit})${v.imageUrl ? ` - Image: ${v.imageUrl}` : ' - No Image'}`)
    })
    
    // Get all images from public/images folder
    const imagesDir = path.join(__dirname, '..', 'public', 'images')
    const imageFiles = fs.readdirSync(imagesDir)
    console.log(`\n🖼️ Found ${imageFiles.length} images in public/images folder:`)
    imageFiles.forEach(img => console.log(`  - ${img}`))
    
    // Create a mapping of image names to vegetable names
    const imageMapping = {
      'Beetroot.jpg': 'Beetroot',
      'Cabbage.jpg': 'Cabbage',
      'Cauliflower.png': 'Cauliflower',
      'Dosakaya(1-2 pieces).jpeg': 'Dosakaya',
      'Chamagadda.png': 'Chamagadda',
      'Capsicum.png': 'Capsicum',
      'Garlic.jpeg': 'Garlic',
      'French Beans.jpeg': 'French Beans',
      'Green Chilli.jpeg': 'Green Chilli',
      'Carrot.webp': 'Carrot',
      'Potato.jpeg': 'Potato',
      'Brinjal white.jpeg': 'Brinjal White',
      'Bitter Gourd.jpeg': 'Bitter Gourd',
      'Curry Leaves + Coriander + Mint Leaves.png': 'Curry Leaves',
      'Cluster Beans.jpeg': 'Cluster Beans',
      'Broad Beans.jpeg': 'Broad Beans',
      'Tomato.jpeg': 'Tomato',
      'Dondakaya.jpeg': 'Dondakaya',
      'Onion.jpg': 'Onion',
      'Raw Banana(2 pieces).jpeg': 'Raw Banana',
      'Gongura Leaves.jpeg': 'Gongura Leaves',
      'Sweet Potato.jpeg': 'Sweet Potato',
      'Cucumber.jpg': 'Cucumber',
      'Ladies Finger.jpg': 'Ladies Finger',
      'Beerakaya.jpeg': 'Beerakaya',
      'Drumstick.jpg': 'Drumstick',
      'Green Chilli Dark.jpeg': 'Green Chilli Dark',
      'Brinjal Vilote.jpg': 'Brinjal Vilote',
      'Lemon.jpg': 'Lemon',
      'Ginger.jpg': 'Ginger',
      'Bottle Gourd(Sorakaya).jpeg': 'Bottle Gourd',
      'Raw Mango.jpeg': 'Raw Mango',
      'Palakura Leaves.jpeg': 'Palakura Leaves'
    }
    
    console.log('\n🔗 Linking images to vegetables...')
    
    // Update each vegetable with its corresponding image
    for (const [imageFile, vegetableName] of Object.entries(imageMapping)) {
      // Find vegetable by name (case-insensitive)
      const vegetable = vegetables.find(v => 
        v.name.toLowerCase().includes(vegetableName.toLowerCase()) ||
        vegetableName.toLowerCase().includes(v.name.toLowerCase())
      )
      
      if (vegetable) {
        const imagePath = `/images/${imageFile}`
        
        // Update the vegetable with the image
        await prisma.vegetable.update({
          where: { id: vegetable.id },
          data: { imageUrl: imagePath }
        })
        
        console.log(`✅ Linked ${imageFile} to ${vegetable.name}`)
      } else {
        // Create new vegetable if it doesn't exist
        const newVegetable = await prisma.vegetable.create({
          data: {
            name: vegetableName,
            weightUnit: '500g',
            imageUrl: `/images/${imageFile}`
          }
        })
        
        console.log(`🆕 Created ${vegetableName} with image ${imageFile}`)
      }
    }
    
    // Show final state
    const finalVegetables = await prisma.vegetable.findMany()
    console.log(`\n📊 Final vegetables in database: ${finalVegetables.length}`)
    finalVegetables.forEach(veg => {
      console.log(`  - ${veg.name} (${veg.weightUnit})${veg.imageUrl ? ` - Image: ${veg.imageUrl}` : ' - No Image'}`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
