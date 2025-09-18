/**
 * Utility functions for weight formatting and conversion
 */

/**
 * Converts a weight string to grams (as integer)
 * 
 * @param weightString - Weight string like "250g", "1kg", "500g"
 * @returns Weight in grams as integer
 */
export function convertToGrams(weightString: string): number {
  const match = weightString.match(/^(\d+(?:\.\d+)?)(g|kg)$/)
  if (!match) return 0
  
  const [, value, unit] = match
  const numericValue = parseFloat(value)
  
  if (unit === 'g') {
    return Math.round(numericValue)
  } else if (unit === 'kg') {
    return Math.round(numericValue * 1000)
  }
  
  return 0
}

/**
 * Converts grams to kilograms with proper precision
 * 
 * @param grams - Weight in grams as integer
 * @returns Weight in kilograms as number
 */
export function gramsToKg(grams: number): number {
  return grams / 1000
}

/**
 * Formats a weight in kilograms to display in the appropriate unit
 * - If weight >= 1kg, shows in kilograms (e.g., 1.75kg)
 * - If weight < 1kg, shows in grams (e.g., 250g, 500g)
 * - Removes unnecessary decimals and trailing zeros (e.g., 2.00kg becomes 2kg, 1.75kg stays 1.75kg)
 * 
 * @param weightInKg - Weight in kilograms as a number
 * @returns Formatted weight string
 */
export function formatWeight(weightInKg: number): string {
  const weightInGrams = Math.round(weightInKg * 1000)
  
  // If weight is >= 1000g (1kg), display in kilograms
  if (weightInGrams >= 1000) {
    const kg = weightInGrams / 1000
    // Use .toFixed(2) for precision, then remove trailing zeros
    const formattedKg = parseFloat(kg.toFixed(2)).toString()
    return `${formattedKg}kg`
  }
  
  // If weight < 1000g, display in grams
  return `${weightInGrams}g`
}

/**
 * Formats a weight string (like "250g", "1kg") to display in the appropriate unit
 * 
 * @param weightString - Weight string like "250g", "1kg", "500g"
 * @returns Formatted weight string
 */
export function formatWeightString(weightString: string): string {
  // Extract numeric value and unit
  const match = weightString.match(/^(\d+(?:\.\d+)?)(g|kg)$/)
  if (!match) return weightString
  
  const [, value, unit] = match
  const numericValue = parseFloat(value)
  
  if (unit === 'g') {
    // Convert grams to the appropriate display format
    return formatWeight(numericValue / 1000)
  } else if (unit === 'kg') {
    // Convert kilograms to the appropriate display format
    return formatWeight(numericValue)
  }
  
  return weightString
}

/**
 * Converts a weight string to kilograms for calculations
 * 
 * @param weightString - Weight string like "250g", "1kg", "500g"
 * @returns Weight in kilograms as a number
 */
export function convertToKg(weightString: string): number {
  const match = weightString.match(/^(\d+(?:\.\d+)?)(g|kg)$/)
  if (!match) return 0
  
  const [, value, unit] = match
  const numericValue = parseFloat(value)
  
  if (unit === 'g') {
    return numericValue / 1000
  } else if (unit === 'kg') {
    return numericValue
  }
  
  return 0
}

/**
 * Formats total weight for cart limits and progress
 * Always shows in kg with appropriate decimal places
 * 
 * @param weightInKg - Weight in kilograms
 * @param maxDecimals - Maximum decimal places (default: 1)
 * @returns Formatted weight string for totals
 */
export function formatTotalWeight(weightInKg: number, maxDecimals: number = 2): string {
  // For totals, we want to show up to 2 decimal places for precision
  // but remove trailing zeros and avoid rounding issues
  const formatted = weightInKg.toFixed(maxDecimals)
  const trimmed = parseFloat(formatted).toString()
  return `${trimmed}kg`
}
