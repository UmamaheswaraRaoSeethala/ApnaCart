// Utility function to automatically match vegetable names with image files
export const getVegetableImage = (vegetableName: string): string => {
  // Normalize the vegetable name for matching
  const normalizedName = vegetableName.toLowerCase().trim()
  
  // Define image mappings for special cases where names don't match exactly
  const imageMappings: Record<string, string> = {
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
    'brinjal black': 'Brinjal Black.jpeg',
    'nagpuri brinjal': 'Nagpuri Brinjal.jpeg',
    'cluster beans': 'Cluster Beans.jpeg',
    'combo': 'Combo.png',
    'curry leaves + coriander + mint leaves': 'Curry Leaves + Coriander + Mint Leaves.png',
    'curry leaves': 'Curry Leaves + Coriander + Mint Leaves.png',
    'coriander': 'Curry Leaves + Coriander + Mint Leaves.png',
    'mint leaves': 'Curry Leaves + Coriander + Mint Leaves.png',
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
  }
  
  // Try to find exact match first
  if (imageMappings[normalizedName]) {
    return `/images/${imageMappings[normalizedName]}`
  }
  
  // Try to find partial matches
  for (const [key, imageFile] of Object.entries(imageMappings)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return `/images/${imageFile}`
    }
  }
  
  // If no match found, return default image
  return '/images/default.jpeg'
}

// Function to automatically link the best available image for a vegetable
export const autoLinkVegetableImage = (vegetableName: string, customImageUrl?: string): string => {
  // If admin has provided a custom image URL, use that
  if (customImageUrl && customImageUrl.trim() !== '') {
    return customImageUrl.trim()
  }
  
  // Otherwise, automatically link the best matching image
  return getVegetableImage(vegetableName)
}

// Function to check if an image exists
export const imageExists = (imagePath: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = imagePath
  })
}

// Function to get the best available image for a vegetable
export const getBestVegetableImage = async (vegetableName: string, customImageUrl?: string): Promise<string> => {
  // If admin has provided a custom image URL, use that first
  if (customImageUrl && customImageUrl.trim() !== '') {
    const customExists = await imageExists(customImageUrl)
    if (customExists) {
      return customImageUrl
    }
  }
  
  // Otherwise, use the automatic matching
  return getVegetableImage(vegetableName)
}

// Function to validate and normalize image paths
export const normalizeImagePath = (imagePath: string): string => {
  if (!imagePath) return '/images/default.jpeg'
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // If it's a relative path starting with /, return as is
  if (imagePath.startsWith('/')) {
    return imagePath
  }
  
  // If it's just a filename, add the images folder path
  if (!imagePath.includes('/')) {
    return `/images/${imagePath}`
  }
  
  return imagePath
}
