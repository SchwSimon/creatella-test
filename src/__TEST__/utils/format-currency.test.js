import { currencyToString } from '../../utils/format-currency';

describe('function currencyToString()', () => {
  describe('must return the @param exceptionString for invalid or non integer values', () => {
    const EXCEPTION_STRING = 'EXCEPTION_STRING';

    it('Undefined', () => {
      expect(currencyToString(undefined, EXCEPTION_STRING)).toBe(EXCEPTION_STRING);
    });

    it('Empty string', () => {
      expect(currencyToString('', EXCEPTION_STRING)).toBe(EXCEPTION_STRING);
    });

    it('Null', () => {
      expect(currencyToString(null, EXCEPTION_STRING)).toBe(EXCEPTION_STRING);
    });

    it('Non numeric string', () => {
      expect(currencyToString('a', EXCEPTION_STRING)).toBe(EXCEPTION_STRING);
    });

    it('Numeric string with space', () => {
      expect(currencyToString('123 ', EXCEPTION_STRING)).toBe(EXCEPTION_STRING);
    });

    it('Float', () => {
      expect(currencyToString(213.45, EXCEPTION_STRING)).toBe(EXCEPTION_STRING);
    });

    it('Array', () => {
      expect(currencyToString([], EXCEPTION_STRING)).toBe(EXCEPTION_STRING);
    });

    it('Object', () => {
      expect(currencyToString({}, EXCEPTION_STRING)).toBe(EXCEPTION_STRING);
    });
  });

  describe('must format currency represented in cents to a decimal string representation', () => {
    it('1 -> 0.01', () => {
      expect(currencyToString(1)).toBe('0.01');
    });

    it('10 -> 0.10', () => {
      expect(currencyToString(10)).toBe('0.10');
    });

    it('100 -> 1.00', () => {
      expect(currencyToString(100)).toBe('1.00');
    });

    it('1000 -> 10.00', () => {
      expect(currencyToString(1000)).toBe('10.00');
    });

    it('12345 -> 123.45', () => {
      expect(currencyToString(12345)).toBe('123.45');
    });
  });
});
