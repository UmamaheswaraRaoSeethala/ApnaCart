// Test script to verify image matching functionality
const fs = require('fs');
const path = require('path');

// Simulate the image matching logic
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

// Test cases
const testCases = [
  'Tomato',
  'Onion',
  'Potato',
  'Carrot',
  'Cabbage',
  'Cauliflower',
  'Capsicum',
  'Cucumber',
  'Garlic',
  'Ginger',
  'Lemon',
  'Bitter Gourd',
  'Bottle Gourd',
  'Broad Beans',
  'Brinjal',
  'Cluster Beans',
  'Curry Leaves',
  'Dondakaya',
  'Dosakaya',
  'Drumstick',
  'French Beans',
  'Green Chilli',
  'Ladies Finger',
  'Palakura Leaves',
  'Raw Banana',
  'Raw Mango',
  'Sweet Potato',
  'Beerakaya',
  'Beetroot',
  'Chamagadda',
  'Gongura Leaves',
  'Brinjal Vilote',
  'Green Chilli Dark',
  'Unknown Vegetable',
  'Test Item'
];

console.log('🧪 Testing Image Matching System\n');
console.log('Vegetable Name'.padEnd(25) + ' | Matched Image');
console.log('-'.repeat(50));

testCases.forEach(vegetableName => {
  const matchedImage = getVegetableImage(vegetableName);
  console.log(vegetableName.padEnd(25) + ' | ' + matchedImage);
});

console.log('\n✅ Image matching test completed!');
console.log('\n📝 Notes:');
console.log('- Images with exact matches show the specific file');
console.log('- Unknown vegetables show the default image');
console.log('- All paths are relative to the public folder');
console.log('- Make sure to create a default.jpeg image in public/images/');
