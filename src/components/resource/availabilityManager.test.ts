import { AvailabilityManager, QuotaPeriod } from './AvailabilityManager';

describe('AvailabilityManager', () => {
  let availabilityManager: AvailabilityManager;

  beforeEach(() => {
    availabilityManager = new AvailabilityManager(2, 'day');
    availabilityManager.addPattern('0 9-17 * * 1-5');
  });

  test('generateAvailableSlots', () => {
    const startTime = new Date('2023-05-01T12:00:00');
    const endTime = new Date('2023-05-01T16:00:00');
    const intervalMinutes = 30;
    const availableSlots = availabilityManager.generateAvailableSlots(startTime, endTime, intervalMinutes);

    const expectedSlots = [
      '2023-05-01T12:00:00',
      '2023-05-01T12:30:00',
      '2023-05-01T13:00:00',
      '2023-05-01T13:30:00',
      '2023-05-01T14:00:00',
      '2023-05-01T14:30:00',
      '2023-05-01T15:00:00',
      '2023-05-01T15:30:00',
    ].map((dateString) => new Date(dateString));

    expect(availableSlots).toEqual(expectedSlots);
  });

  describe('isQuotaAvailable', () => {
    const now = new Date(Date.UTC(2023, 4, 1, 10, 0));

    it('should return true when quota is not reached within the specified range', () => {
      const userSchedules = [
        new Date(Date.UTC(2023, 4, 1, 10, 0)),
      ];
      expect(availabilityManager.isQuotaAvailable(userSchedules, now)).toBe(true);
    });

    it('should return false when quota is reached within the specified range', () => {
      const userSchedules = [
        new Date(Date.UTC(2023, 4, 1, 10, 0)),
        new Date(Date.UTC(2023, 4, 1, 14, 0)),
        new Date(Date.UTC(2023, 4, 2, 10, 0)),
        new Date(Date.UTC(2023, 4, 2, 14, 0))
      ];
      expect(availabilityManager.isQuotaAvailable(userSchedules, now)).toBe(false);
    });

    it('should return true when quota is not reached within the specified month', () => {
      const availabilityManager = new AvailabilityManager(3, 'month');
      availabilityManager.addPattern('0 9-17 * * 1-5');

      const userSchedules = [
        new Date(Date.UTC(2023, 4, 1, 10, 0)),
        new Date(Date.UTC(2023, 4, 15, 14, 0))
      ];
      expect(availabilityManager.isQuotaAvailable(userSchedules, now)).toBe(true);
    });

    it('should return false when quota is reached within the specified month', () => {
      const availabilityManager = new AvailabilityManager(3, 'month');
      availabilityManager.addPattern('0 9-17 * * 1-5');

      const userSchedules = [];
      for (let i = 0; i < 3; i++) {
        const date = new Date(Date.UTC(2023, 4, 10 + i, 9, 0));
        userSchedules.push(date);
      }

      expect(availabilityManager.isQuotaAvailable(userSchedules, now)).toBe(false);
    });

    it('should return true when quota is not reached within the specified year', () => {
      const availabilityManager = new AvailabilityManager(12, 'year');
      availabilityManager.addPattern('0 9-17 * * 1-5');

      const userSchedules = [];
      for (let i = 0; i < 6; i++) {
        userSchedules.push(new Date(Date.UTC(2023, 2 * i, 15, 14, 0)));
      }

      expect(availabilityManager.isQuotaAvailable(userSchedules, now)).toBe(true);
    });

    it('should return false when quota is reached within the specified year', () => {
      const availabilityManager = new AvailabilityManager(12, 'year');
      availabilityManager.addPattern('0 9-17 * * 1-5');

      const userSchedules = [];
      for (let i = 0; i < 12; i++) {
        const date = new Date(Date.UTC(2023, i, 10, 9, 0));
        userSchedules.push(date);
      }

      expect(availabilityManager.isQuotaAvailable(userSchedules, now)).toBe(false);
    });
  });
});
