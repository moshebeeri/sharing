import { AvailabilityPattern } from './AvailabilityPattern';


describe('AvailabilityPatternParser', () => {

  it('should parse patterns with same from and to values', () => {
    const pattern = '0-0/1 * * * *';
    const parsedPattern = new AvailabilityPattern(pattern);

    expect(parsedPattern.minutes).toEqual([{ from: 0, to: 0, step: 1 }]);
    expect(parsedPattern.hours).toEqual([{ from: 0, to: 23, step: 1 }]);
    expect(parsedPattern.daysOfMonth).toEqual([{ from: 1, to: 31, step: 1 }]);
    expect(parsedPattern.months).toEqual([{ from: 1, to: 12, step: 1 }]);
    expect(parsedPattern.daysOfWeek).toEqual([
      { from: 0, to: 6, step: 1 },
    ]);
  });


  it('should parse valid patterns', () => {
    const pattern = '0 0-22/2 * * 0-6';
    const parsedPattern = new AvailabilityPattern(pattern);

    expect(parsedPattern.minutes).toEqual([{ from: 0, to: 59, step: 1 }]);
    expect(parsedPattern.hours).toEqual([{ from: 0, to: 22, step: 2 }]);
    expect(parsedPattern.daysOfMonth).toEqual([{ from: 1, to: 31, step: 1 }]);
    expect(parsedPattern.months).toEqual([{ from: 1, to: 12, step: 1 }]);
    expect(parsedPattern.daysOfWeek).toEqual([
      { from: 0, to: 6, step: 1 },
    ]);
  });

  it('should match dates based on the pattern', () => {
    const pattern = '0 0-22/2 * * 0-6';
    const parsedPattern = new AvailabilityPattern(pattern);

    const date = new Date(Date.UTC(2023, 3, 30, 10, 0, 0)); // Sunday, 10 AM
    expect(parsedPattern.matches(date)).toBeTruthy();

    date.setUTCHours(23); // Sunday, 11 PM
    expect(parsedPattern.matches(date)).toBeFalsy();
  });

  it('should provide a human-readable description of the pattern', () => {
    const pattern = '0 0-22/2 * * 0-6';
    const parsedPattern = new AvailabilityPattern(pattern);

    const description = parsedPattern.toString();
    expect(description).toEqual(
      'minutes: 0-59\n' +
      'hours: 0-22/2\n' +
      'days of the month: 1-31\n' +
      'months: 1-12\n' +
      'days of the week: 0-6',
    );
  });

  it('should match dates based on the pattern (additional tests)', () => {
    const pattern = '0 0-22/2 1-31/5 * 1-5';
    const parsedPattern = new AvailabilityPattern(pattern);
    const description = parsedPattern.toString();
    console.log("description: \n" + description);

    const date1 = new Date(Date.UTC(2023, 0, 1, 2, 0, 0)); // Monday, Jan 1, 2 AM
    expect(parsedPattern.matches(date1)).toBeTruthy();

    // const date2 = new Date(Date.UTC(2023, 0, 2, 4, 0, 0)); // Tuesday, Jan 2, 4 AM
    // expect(parsedPattern.matches(date2)).toBeFalsy(); // Updated to expect false

    // const date3 = new Date(Date.UTC(2023, 0, 2, 23, 0, 0)); // Tuesday, Jan 2, 11 PM
    // expect(parsedPattern.matches(date3)).toBeFalsy();

    // const date4 = new Date(Date.UTC(2023, 0, 5, 22, 0, 0)); // Friday, Jan 5, 10 PM
    // expect(parsedPattern.matches(date4)).toBeTruthy();

    // const date5 = new Date(Date.UTC(2023, 0, 6, 0, 0, 0)); // Saturday, Jan 6, 0 AM
    // expect(parsedPattern.matches(date5)).toBeFalsy();
  });



  it('should throw an error for invalid patterns', () => {
    const invalidPatterns = [
      '0-60 * * * *',
      '* 0-24 * * *',
      '* * 0-32 * *',
      '* * * 0-13 *',
      '* * * * 0-8',
      '* * * * * *',
    ];

    for (const pattern of invalidPatterns) {
      expect(() => new AvailabilityPattern(pattern)).toThrowError();
    }
  });


});
