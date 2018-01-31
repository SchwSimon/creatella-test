import { dateToElapsedTime } from '../../utils/format-date';

describe('function dateToElapsedTime()', () => {
  describe('elapsed time >= 7 days', () => {
    it('must force leading zeroes', () => {
      expect(dateToElapsedTime('Sat Feb 3 2017 11:52:52 GMT+0100 (Mitteleuropäische Zeit)')).toBe('03.02.2017');
    });

    it('must not append leading zeroes', () => {
      expect(dateToElapsedTime('Sat Dec 22 2017 11:52:52 GMT+0100 (Mitteleuropäische Zeit)')).toBe('22.12.2017');
    });
  });

  describe('elapsed time < 24 hours', () => {
    it('must return 1 day ago', () => {
      const date = new Date();
      date.setHours(date.getHours() - 1);

      expect(dateToElapsedTime(date)).toBe('1 hour ago');
    });

    it('must return 2 days ago', () => {
      const date = new Date();
      date.setHours(date.getHours() - 12);

      expect(dateToElapsedTime(date)).toBe('12 hours ago');
    });
  });

  describe('elapsed time < 7 days && >= 24 hours', () => {
    it('must return 1 day ago', () => {
      const date = new Date();
      date.setHours(date.getHours() - 24);

      expect(dateToElapsedTime(date)).toBe('1 day ago');
    });

    it('must return 2 days ago', () => {
      const date = new Date();
      date.setHours(date.getHours() - 48);

      expect(dateToElapsedTime(date)).toBe('2 days ago');
    });
  });
});
