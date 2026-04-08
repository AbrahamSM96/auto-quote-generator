import {
  calculateTotal,
  formatCurrency,
  formatDate,
  formatTime,
  padFolio,
} from './utils'

describe('Utils module', () => {
  describe('formatCurrency', () => {
    it('should format a number as currency', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
    })

    it('should format a string as currency', () => {
      expect(formatCurrency('1234.56')).toBe('$1,234.56')
    })
  })

  describe('formatDate', () => {
    it('should format a Date object as a date string', () => {
      const date = new Date(2023, 0, 1)
      expect(formatDate(date)).toBe('DOMINGO, 1 DE ENERO DE 2023')
    })

    it('should format a date string as a date string', () => {
      expect(formatDate('2023-01-01T00:00:00')).toBe(
        'DOMINGO, 1 DE ENERO DE 2023'
      )
    })
  })

  describe('formatTime', () => {
    it('should format a Date object as a time string', () => {
      const date = new Date('2023-01-01T12:34:00')
      expect(formatTime(date)).toBe('12:34 p.m.')
    })

    it('should format a date string as a time string', () => {
      expect(formatTime('2023-01-01T12:34:00')).toBe('12:34 p.m.')
    })
  })

  describe('padFolio', () => {
    it('should pad a number with leading zeros', () => {
      expect(padFolio(1)).toBe('001')
      expect(padFolio(12)).toBe('012')
      expect(padFolio(123)).toBe('123')
    })
  })

  describe('calculateTotal', () => {
    it('should calculate the total of multiple amounts', () => {
      expect(calculateTotal(1, 2, 3)).toBe(6)
      expect(calculateTotal('1', '2', '3')).toBe(6)
      expect(calculateTotal(1, '2', 3)).toBe(6)
    })

    it('should return 0 if no amounts are provided', () => {
      expect(calculateTotal()).toBe(0)
    })

    it('should handle invalid amounts gracefully', () => {
      expect(calculateTotal(1, 'invalid', 3)).toBe(4)
    })

    it('should handle string amounts and fallback to 0 for invalid strings', () => {
      expect(calculateTotal('100')).toBe(100)
      expect(calculateTotal('50', 'invalid')).toBe(50)
    })

    it('should handle zero and falsy amounts', () => {
      expect(calculateTotal(0, 5)).toBe(5)
      expect(calculateTotal(10, 0)).toBe(10)
      expect(calculateTotal('0', 5)).toBe(5)
    })
  })
})
