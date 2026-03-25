import { type ClassValue, clsx } from 'clsx/lite'
import { twMerge } from 'tailwind-merge'

/**
 * cn - Combines class names using clsx and tailwind-merge.
 *
 * @param {...any} inputs - A list of class names or class name objects to combine.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * formatCurrency - Formats a number or string as a currency value in Mexican Pesos (MXN).
 *
 * @param amount - The amount to format, which can be a number or a string representing a number.
 */
export function formatCurrency(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('es-MX', {
    currency: 'MXN',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: 'currency',
  }).format(numAmount)
}

/**
 * formatDate - Formats a Date object or a date string into a human-readable format in Spanish (Mexico).
 *
 * @param date - The date to format, which can be a Date object or a string representing a date.
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric',
  })
    .format(dateObj)
    .toUpperCase()
}

/**
 * formatTime - Formats a Date object or a date string into a time format with hours and minutes in Spanish (Mexico).
 *
 * @param date - The date to format, which can be a Date object or a string representing a date.
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-MX', {
    hour: '2-digit',
    hour12: true,
    minute: '2-digit',
  }).format(dateObj)
}

/**
 * padFolio - Pads a folio number with leading zeros to ensure it has at least 3 digits.
 *
 * @param folio - The folio number to pad.
 */
export function padFolio(folio: number): string {
  return folio.toString().padStart(3, '0')
}

/**
 * calculateTotal - Calculates the total sum of multiple amounts, which can be numbers or strings representing numbers.
 *
 * @param {...any} amounts - The amounts to sum.
 */
export function calculateTotal(
  ...amounts: (number | string)[]
): number | string {
  return amounts.reduce((sum: number, amount) => {
    const num =
      typeof amount === 'string' ? parseFloat(amount) || 0 : amount || 0
    return sum + num
  }, 0)
}
