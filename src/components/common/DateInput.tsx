import React from "react"
import { TextField, TextFieldProps } from "@mui/material"
import { parseFromDDMMYYYY, isValidDate } from "../../utils/dateHelpers"

export interface DateInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  readOnly?: boolean
  error?: boolean
  helperText?: string
  required?: boolean
  fullWidth?: boolean
  variant?: "standard" | "outlined" | "filled"
  sx?: TextFieldProps["sx"]
}

/**
 * DateInput Component - Masked text input for DD/MM/YYYY format
 * Forces DD/MM/YYYY format regardless of system locale
 * Compatible with React 19 (no react-input-mask dependency)
 * 
 * @param label - Label for the input field
 * @param value - Date value in YYYY-MM-DD format (for compatibility with existing code)
 * @param onChange - Callback that receives the date in YYYY-MM-DD format
 * @param readOnly - Whether the field is read-only
 * @param error - Whether to show error state
 * @param helperText - Helper text to display below the input
 * @param required - Whether the field is required
 * @param fullWidth - Whether to use full width
 * @param variant - MUI TextField variant
 * @param sx - MUI sx prop for styling
 */
export const DateInput: React.FC<DateInputProps> = ({
  label,
  value,
  onChange,
  readOnly = false,
  error = false,
  helperText,
  required = false,
  fullWidth = true,
  variant = "standard",
  sx,
}) => {
  // Convert YYYY-MM-DD to DD/MM/YYYY for display
  const displayValue = React.useMemo(() => {
    if (!value) return ""
    
    try {
      // If value is already in DD/MM/YYYY format, use it
      if (value.includes('/')) {
        return value
      }
      
      // Convert from YYYY-MM-DD to DD/MM/YYYY
      const [year, month, day] = value.split('-')
      if (year && month && day) {
        return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
      }
      return ""
    } catch (error) {
      console.error('Error converting date for display:', error)
      return ""
    }
  }, [value])

  // Validate date and show error if invalid
  const [internalError, setInternalError] = React.useState(false)
  const [internalHelperText, setInternalHelperText] = React.useState("")
  const [localValue, setLocalValue] = React.useState(displayValue)

  React.useEffect(() => {
    setLocalValue(displayValue)
  }, [displayValue])

  /**
   * Format input as DD/MM/YYYY with automatic slash insertion
   */
  const formatDateInput = (input: string): string => {
    // Remove all non-digit characters
    const digitsOnly = input.replace(/\D/g, '')
    
    // Apply formatting based on length
    let formatted = ''
    if (digitsOnly.length > 0) {
      formatted = digitsOnly.substring(0, 2) // DD
      if (digitsOnly.length >= 3) {
        formatted += '/' + digitsOnly.substring(2, 4) // MM
      }
      if (digitsOnly.length >= 5) {
        formatted += '/' + digitsOnly.substring(4, 8) // YYYY
      }
    }
    
    return formatted
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value
    
    // Allow deletion
    if (inputValue.length < localValue.length) {
      setLocalValue(inputValue)
      
      // If cleared, reset
      if (!inputValue) {
        setInternalError(false)
        setInternalHelperText("")
        onChange("")
      }
      return
    }
    
    // Format the input
    const formatted = formatDateInput(inputValue)
    setLocalValue(formatted)
    
    // If the date is complete (10 characters: DD/MM/YYYY)
    if (formatted.length === 10) {
      // Validate the date
      if (isValidDate(formatted)) {
        setInternalError(false)
        setInternalHelperText("")
        // Convert to YYYY-MM-DD format for the parent component
        const yyyymmdd = parseFromDDMMYYYY(formatted)
        onChange(yyyymmdd)
      } else {
        setInternalError(true)
        setInternalHelperText("Fecha inválida")
        // Still pass the value to allow correction
        const yyyymmdd = parseFromDDMMYYYY(formatted)
        onChange(yyyymmdd)
      }
    } else if (formatted.length > 0) {
      // Date is not complete yet
      setInternalError(false)
      setInternalHelperText("")
    }
  }

  const handleBlur = () => {
    // On blur, if incomplete, clear the field
    if (localValue.length > 0 && localValue.length < 10) {
      setLocalValue("")
      setInternalError(false)
      setInternalHelperText("")
      onChange("")
    }
  }

  return (
    <TextField
      fullWidth={fullWidth}
      label={label}
      variant={variant}
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      error={error || internalError}
      helperText={helperText || internalHelperText}
      required={required}
      placeholder="dd/mm/aaaa"
      InputLabelProps={{
        shrink: true,
      }}
      InputProps={{
        readOnly: readOnly,
      }}
      inputProps={{
        maxLength: 10,
      }}
      sx={{
        mb: 3,
        "& .MuiInputBase-input": {
          color: readOnly ? "text.secondary" : "text.primary",
        },
        ...sx,
      }}
    />
  )
}

export default DateInput
