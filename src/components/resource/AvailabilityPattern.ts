type FieldPart = {
  from: number;
  to: number;
  step: number;
};

interface Field {
  from: number;
  to: number;
  step: number;
}

export class AvailabilityPattern {
  minutes: FieldPart[];
  hours: FieldPart[];
  daysOfMonth: FieldPart[];
  months: FieldPart[];
  daysOfWeek: FieldPart[];

  constructor(pattern: string) {
    // console.log("pattern " + pattern);
    const parts = pattern.split(' ');

    if (parts.length !== 5) {
      throw new Error('Invalid pattern');
    }

    this.minutes = this.parseField(parts[0], 0, 59);
    this.hours = this.parseField(parts[1], 0, 23);
    this.daysOfMonth = this.parseField(parts[2], 1, 31);
    this.months = this.parseField(parts[3], 1, 12);
    // console.log("[part 4 week: " + parts[4]);
    this.daysOfWeek = this.parseField(parts[4], 0, 6);

    this.validatePattern();
  }

  parseField(field: string, minValue: number, maxValue: number): Array<Field> {
    const ranges = field.split(',').map(range => {
      const [from, to, step] = range.split(/[-\/]/).map(Number);

      return {
        from: isNaN(from) ? minValue : from,
        to: isNaN(to) ? maxValue : to,
        step: isNaN(step) ? 1 : step,
      };
    });

    return ranges;
  }

  public matches(date: Date): boolean {
    const minutes = this.fieldMatches(this.minutes, date.getUTCMinutes())
    const hours = this.fieldMatches(this.hours, date.getUTCHours())
    const daysOfMonth = this.fieldMatches(this.daysOfMonth, date.getUTCDate())
    const months = this.fieldMatches(this.months, date.getUTCMonth() +1)
    const daysOfWeek = this.fieldMatches(this.daysOfWeek, date.getUTCDay()+1)
    console.log(date)
    console.log('date Minutes: ' + date.getUTCMinutes() + "date huors: " + date.getUTCHours() + "date daysOfMonth: " + date.getUTCDate() + "date months: " + date.getUTCMonth() + "date daysOfWeek: " + date.getUTCDay())
    console.log(`minutes: ${minutes}, hours: ${hours}, daysOfMonth: ${daysOfMonth}, months: ${months}, daysOfWeek: ${daysOfWeek}`);
    return (
      minutes && hours && daysOfMonth && months && daysOfWeek
    );
  }

  private fieldMatches(fieldParts: FieldPart[], value: number): boolean {
    return fieldParts.some(({ from, to, step }) => {
      if (from === -1) {
        return true;
      }
      // Ensure "to" value is not lower than "from" value
      if (to < from) {
        return false;
      }
      // Check if the value is within the range and if it matches the step
      const isInRange = value >= from && value <= to;
      const isStepMatch = (value - from ) % step === 0;
      const ret = isInRange && isStepMatch;
      return ret;
    });
  }

  toString(): string {
    return `minutes: ${this.fieldToString(this.minutes)}\n` +
          `hours: ${this.fieldToString(this.hours)}\n` +
          `days of the month: ${this.fieldToString(this.daysOfMonth)}\n` +
          `months: ${this.fieldToString(this.months)}\n` +
          `days of the week: ${this.fieldToString(this.daysOfWeek)}`;
  }

  private fieldToString(fieldParts: FieldPart[]): string {
    return fieldParts.map(({ from, to, step }) => {
      if (from === -1) {
        return '*';
      }
      if (from === to) {
        return `${from}`;
      }
      if (step === 1) {
        return `${from}-${to}`;
      }
      return `${from}-${to}/${step}`;
    }).join(', ');
  }

  private validateField(field: Array<Field>, minValue: number, maxValue: number) {
    for (const range of field) {
      if (range.from < minValue || range.from > maxValue || range.to < minValue || range.to > maxValue) {
        throw new Error(`Invalid range: ${range.from}-${range.to} (valid values: ${minValue}-${maxValue})`);
      }
      if (range.step < 1) {
        throw new Error(`Invalid step: ${range.step} (valid values: >= 1)`);
      }
    }
  }

  private validatePattern() {
    this.validateField(this.minutes, 0, 59);
    this.validateField(this.hours, 0, 23);
    this.validateField(this.daysOfMonth, 1, 31);
    this.validateField(this.months, 1, 12);
    this.validateField(this.daysOfWeek, 0, 7);
  }

}
