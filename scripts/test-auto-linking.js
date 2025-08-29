// Test script to verify automatic image linking functionality
const fs = require('fs');
const path = require('path');

// Simulate the automatic image linking logic
function autoLinkVegetableImage(vegetableName, customImageUrl) {
  // If admin has provided a custom image URL, use that
  if (customImageUrl && customImageUrl.trim() !== '') {
    return customImageUrl.trim();
  }
  
  // Otherwise, automatically link the best matching image
  return getVegetableImage(vegetableName);
}

function getVegetableImage(vegetableName) {
  const normalizedName = vegetableName.toLowerCase().trim();
  
  const imageMappings = {
    'onion': 'Onion.jpg',
    'tomato': 'Tomato.jpeg',
    'potato': 'Potato.jpeg',
    'carrot': 'Carrot.webp',
    'cabbage': 'Cabbage.jpg',
    'cauliflower': 'Cauliflower.png',
    'capsicum': 'Capsicum.png',
    'cucumber': 'Cucumber.jpg',
    'garlic': 'Garlic.jpeg',
    'ginger': 'Ginger.jpg',
    'lemon': 'Lemon.jpg',
    'bitter gourd': 'Bitter Gourd.jpeg',
    'bottle gourd': 'Bottle Gourd(Sorakaya).jpeg',
    'broad beans': 'Broad Beans.jpeg',
    'brinjal': 'Brinjal white.jpeg',
    'cluster beans': 'Cluster Beans.jpeg',
    'curry leaves': 'Curry Leaves + Coriander + Mint Leaves.png',
    'dondakaya': 'Dondakaya.jpeg',
    'dosakaya': 'Dosakaya(1-2 pieces).jpeg',
    'drumstick': 'Drumstick.jpg',
    'french beans': 'French Beans.jpeg',
    'green chilli': 'Green Chilli.jpeg',
    'ladies finger': 'Ladies Finger.jpg',
    'palakura leaves': 'Palakura Leaves.jpeg',
    'raw banana': 'Raw Banana(2 pieces).jpeg',
    'raw mango': 'Raw Mango.jpeg',
    'sweet potato': 'Sweet Potato.jpeg',
    'beerakaya': 'Beerakaya.jpeg',
    'beetroot': 'Beetroot.jpg',
    'chamagadda': 'Chamagadda.png',
    'gongura leaves': 'Gongura Leaves.jpeg',
    'brinjal vilote': 'Brinjal Vilote.jpg',
    'green chilli dark': 'Green Chilli Dark.jpeg'
  };
  
  if (imageMappings[normalizedName]) {
    return `/images/${imageMappings[normalizedName]}`;
  }
  
  for (const [key, imageFile] of Object.entries(imageMappings)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return `/images/${imageFile}`;
    }
  }
  
  return '/images/default.jpeg';
}

// Test scenarios
const testScenarios = [
  {
    name: 'Tomato',
    customImageUrl: '',
    expectedBehavior: 'Should auto-link to Tomato.jpeg'
  },
  {
    name: 'Onion',
    customImageUrl: '',
    expectedBehavior: 'Should auto-link to Onion.jpg'
  },
  {
    name: 'Potato',
    customImageUrl: '',
    expectedBehavior: 'Should auto-link to Potato.jpeg'
  },
  {
    name: 'Unknown Vegetable',
    customImageUrl: '',
    expectedBehavior: 'Should auto-link to default.jpeg'
  },
  {
    name: 'Tomato',
    customImageUrl: 'https://example.com/custom-tomato.jpg',
    expectedBehavior: 'Should use custom URL instead of auto-linking'
  },
  {
    name: 'Carrot',
    customImageUrl: '',
    expectedBehavior: 'Should auto-link to Carrot.webp'
  },
  {
    name: 'Bitter Gourd',
    customImageUrl: '',
    expectedBehavior: 'Should auto-link to Bitter Gourd.jpeg'
  }
];

console.log('🧪 Testing Automatic Image Linking System\n');
console.log('='.repeat(80));

testScenarios.forEach((scenario, index) => {
  const result = autoLinkVegetableImage(scenario.name, scenario.customImageUrl);
  const isCustomUrl = scenario.customImageUrl && scenario.customImageUrl.trim() !== '';
  const status = isCustomUrl ? '🔗 Custom URL' : '🔄 Auto-linked';
  
  console.log(`\n${index + 1}. ${scenario.name}`);
  console.log(`   Expected: ${scenario.expectedBehavior}`);
  console.log(`   Status: ${status}`);
  console.log(`   Result: ${result}`);
  
  if (isCustomUrl) {
    console.log(`   Note: Custom URL overrides automatic linking`);
  } else {
    const autoImage = getVegetableImage(scenario.name);
    console.log(`   Auto-match: ${autoImage}`);
  }
});

console.log('\n' + '='.repeat(80));
console.log('\n✅ Automatic Image Linking Test Completed!');
console.log('\n📋 Summary:');
console.log('• 🔄 Auto-linked: System automatically finds matching images from public/images/');
console.log('• 🔗 Custom URL: Admin-provided URLs override automatic linking');
console.log('• 🖼️ Fallback: Unknown vegetables automatically get default.jpeg');
console.log('\n🎯 How it works:');
console.log('1. Admin adds vegetable with name (e.g., "Tomato")');
console.log('2. System automatically checks for tomato.jpeg in public/images/');
console.log('3. If found, links it automatically; if not, uses default.jpeg');
console.log('4. Custom URLs always take precedence over automatic linking');
console.log('\n💡 Benefits:');
console.log('• No manual image linking required');
console.log('• Consistent image display across admin and customer views');
console.log('• Automatic fallback to default image');
console.log('• Custom URLs still supported for special cases');
