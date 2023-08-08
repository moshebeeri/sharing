interface Field {
  from: number;
  to: number;
  step: number;
}

class AvailabilityPattern {
  minutes: Field[];
  hours: Field[];
  daysOfMonth: Field[];
  months: Field[];
  daysOfWeek: Field[];

  constructor(pattern: string) {
    const parts = pattern.split(" ");

    if (parts.length !== 5) {
      throw new Error("Invalid pattern");
    }

    this.minutes = this.parseField(parts[0], 0, 59);
    this.hours = this.parseField(parts[1], 0, 23);
    this.daysOfMonth = this.parseField(parts[2], 1, 31);
    this.months = this.parseField(parts[3], 1, 12);
    this.daysOfWeek = this.parseField(parts[4], 0, 6);

    this.validatePattern();
  }

  parseField(field: string, minValue: number, maxValue: number): Field[] {
    const ranges = field.split(",").map((range) => {
      const [from, to, step] = range.split(/[-/]/).map(Number);

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
    const daysOfWeek = this.fieldMatches(this.daysOfWeek, date.getUTCDay() + 1)
    // console.log('Checking:', date, daysOfWeek, hours, minutes); // Debug print statement
    // console.log('date Minutes: ' + date.getUTCMinutes() + " date huors: " + date.getUTCHours() + " date daysOfMonth: " + date.getUTCDate() + " date months: " + date.getUTCMonth() + " date daysOfWeek: " + date.getUTCDay())
    // console.log(`minutes: ${minutes}, hours: ${hours}, daysOfMonth: ${daysOfMonth}, months: ${months}, daysOfWeek: ${daysOfWeek}`);
    return (
      minutes && hours && daysOfMonth && months && daysOfWeek
    );
  }

  public matchesRange(startTime: Date, endTime: Date): boolean {
    const startDateMatches = this.matches(startTime);
    const endDateMatches = this.matches(endTime);

    if (startDateMatches && endDateMatches) {
      return true;
    }

    if (this.crossesDayBoundary(startTime, endTime)) {
      const nextDayStartTime = new Date(endTime);
      nextDayStartTime.setUTCDate(nextDayStartTime.getUTCDate() + 1);
      return this.matches(nextDayStartTime);
    }

    return false;
  }

  private crossesDayBoundary(startTime: Date, endTime: Date): boolean {
    return endTime.getUTCHours() < startTime.getUTCHours();
  }

  // private fieldMatches(fieldParts: Field[], value: number): boolean {
  //   return fieldParts.some(({ from, to, step }) => {
  //     if (from === -1) {
  //       return true;
  //     }
  //     // Ensure "to" value is not lower than "from" value
  //     if (to < from) {
  //       return false;
  //     }
  //     // Check if the value is within the range and if it matches the step
  //     const isInRange = value >= from && value <= to;
  //     const isStepMatch = (value - from ) % step === 0;
  //     const ret = isInRange && isStepMatch;
  //     return ret;
  //   });
  // }
  private fieldMatches(fieldParts: Field[], value: number): boolean {
    return fieldParts.some(({ from, to, step }) => {
      if (from === -1) {
        return true;
      }

      // Check if the value is within the range and if it matches the step
      const isStepMatch = (value - from) % step === 0;

      // Handle boundary crossing cases
      if (to < from) {
        const isInRange1 = value >= from;
        const isInRange2 = value <= to;
        return (isInRange1 || isInRange2) && isStepMatch;
      } else {
        const isInRange = value >= from && value <= to;
        return isInRange && isStepMatch;
      }
    });
  }

  toString(debugMode = false): string {
    if (debugMode)
      return `minutes: ${this.fieldToString(this.minutes)}\n` +
            `hours: ${this.fieldToString(this.hours)}\n` +
            `days of the month: ${this.fieldToString(this.daysOfMonth)}\n` +
            `months: ${this.fieldToString(this.months)}\n` +
            `days of the week: ${this.fieldToString(this.daysOfWeek)}`;

    return `${this.fieldToString(this.minutes)} ` +
          `${this.fieldToString(this.hours)} ` +
          `${this.fieldToString(this.daysOfMonth)} ` +
          `${this.fieldToString(this.months)} ` +
          `${this.fieldToString(this.daysOfWeek)}`;
  }

  private fieldToString(fieldParts: Field[]): string {
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

export { AvailabilityPattern};
