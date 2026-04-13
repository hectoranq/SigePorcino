/**
 * Date utility functions for consistent date formatting across the application
 * Enforces DD/MM/YYYY format regardless of system locale
 */

/**
 * Format a date string (ISO or YYYY-MM-DD) to DD/MM/YYYY display format
 * @param dateString - ISO date string or YYYY-MM-DD format
 * @returns Formatted date in DD/MM/YYYY format or "Sin fecha" if empty
 */
export const formatToDDMMYYYY = (dateString: string): string => {
  if (!dateString) return "Sin fecha"
  
  try {
    // Handle both ISO format (2024-03-15T10:30:00Z) and simple YYYY-MM-DD
    const dateOnly = dateString.split('T')[0].split(' ')[0]
    const [year, month, day] = dateOnly.split('-')
    
    if (!year || !month || !day) return "Sin fecha"
    
    // Return in DD/MM/YYYY format
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
  } catch (error) {
    console.error('Error formatting date:', error)
    return "Sin fecha"
  }
}

/**
 * Parse DD/MM/YYYY format to YYYY-MM-DD for API submission
 * @param ddmmyyyy - Date string in DD/MM/YYYY format
 * @returns Date in YYYY-MM-DD format or empty string if invalid
 */
export const parseFromDDMMYYYY = (ddmmyyyy: string): string => {
  if (!ddmmyyyy || ddmmyyyy.length < 10) return ""
  
  try {
    // Remove any non-digit characters except slashes
    const cleaned = ddmmyyyy.replace(/[^\d/]/g, '')
    const parts = cleaned.split('/')
    
    if (parts.length !== 3) return ""
    
    const [day, month, year] = parts
    
    // Basic validation
    if (!day || !month || !year || year.length !== 4) return ""
    
    // Return in YYYY-MM-DD format
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  } catch (error) {
    console.error('Error parsing date:', error)
    return ""
  }
}

/**
 * Validate if a DD/MM/YYYY date string is valid
 * @param ddmmyyyy - Date string in DD/MM/YYYY format
 * @returns true if valid date, false otherwise
 */
export const isValidDate = (ddmmyyyy: string): boolean => {
  if (!ddmmyyyy || ddmmyyyy.length < 10) return false
  
  try {
    const parts = ddmmyyyy.replace(/[^\d/]/g, '').split('/')
    if (parts.length !== 3) return false
    
    const [dayStr, monthStr, yearStr] = parts
    const day = parseInt(dayStr, 10)
    const month = parseInt(monthStr, 10)
    const year = parseInt(yearStr, 10)
    
    // Basic range checks
    if (isNaN(day) || isNaN(month) || isNaN(year)) return false
    if (year < 1900 || year > 2100) return false
    if (month < 1 || month > 12) return false
    if (day < 1 || day > 31) return false
    
    // Check if the date is actually valid (e.g., not 31/02/2024)
    const date = new Date(year, month - 1, day)
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    )
  } catch (error) {
    return false
  }
}

/**
 * Format ISO date string to YYYY-MM-DD for input type="date" (legacy support)
 * @param isoDate - ISO date string
 * @returns Date in YYYY-MM-DD format or empty string
 */
export const formatDateForInput = (isoDate: string): string => {
  if (!isoDate) return ""
  try {
    return isoDate.split('T')[0].split(' ')[0]
  } catch (error) {
    return ""
  }
}

/**
 * Format date to display in Spanish locale (DD/MM/YYYY) - alternative using toLocaleDateString
 * @param dateString - ISO date string or YYYY-MM-DD format
 * @returns Formatted date in DD/MM/YYYY format or "Sin fecha"
 */
export const formatDateToDisplay = (dateString: string): string => {
  if (!dateString) return "Sin fecha"
  
  try {
    const date = new Date(dateString)
    
    // Check if date is valid
    if (isNaN(date.getTime())) return "Sin fecha"
    
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch (error) {
    console.error('Error formatting date to display:', error)
    return "Sin fecha"
  }
}
