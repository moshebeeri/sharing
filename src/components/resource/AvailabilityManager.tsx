import { AvailabilityPattern } from './AvailabilityPattern'

type QuotaPeriod = 'day' | 'week' | 'month' | 'year'

class AvailabilityManager {
  private patterns: AvailabilityPattern[]
  private quota: number
  private quotaPeriod: QuotaPeriod

  constructor (quota: number, quotaPeriod: QuotaPeriod = 'day') {
    this.patterns = []
    this.quota = quota
    this.quotaPeriod = quotaPeriod
  }

  setQuota (quota: number, quotaPeriod: QuotaPeriod = 'day') {
    this.quota = quota
    this.quotaPeriod = quotaPeriod
  }

  addPattern (pattern: string): void {
    try {
      const availabilityPattern = new AvailabilityPattern(pattern)
      this.patterns.push(availabilityPattern)
    } catch (error) {
      console.error(`Error adding pattern: ${error}`)
    }
  }

  removePattern (pattern: string): boolean {
    const index = this.patterns.findIndex(
      p => p.toString() === new AvailabilityPattern(pattern).toString()
    )
    if (index !== -1) {
      this.patterns.splice(index, 1)
      return true
    }
    return false
  }

  getPatterns (): AvailabilityPattern[] {
    return this.patterns
  }

  isAvailable (date: Date): boolean {
    return this.patterns.some(pattern => pattern.matches(date))
  }

  isAvailableInRange (startTime: Date, endTime: Date): boolean {
    return this.patterns.some(pattern =>
      pattern.matchesRange(startTime, endTime)
    )
  }

  generateAvailableSlots (
    startTime: Date,
    endTime: Date,
    intervalMinutes: number
  ): Date[] {
    const availableSlots: Date[] = []
    let currentSlot = new Date(startTime)

    while (currentSlot < endTime) {
      if (this.isAvailable(currentSlot)) {
        availableSlots.push(new Date(currentSlot))
      }
      currentSlot.setMinutes(currentSlot.getMinutes() + intervalMinutes)
    }

    return availableSlots
  }

  private filterSchedulesInRange (
    userSchedules: Date[],
    startTime: Date,
    endTime: Date
  ): Date[] {
    const startPeriod = this.getPeriodStart(startTime)
    const endPeriod = this.getPeriodEnd(endTime)

    return userSchedules.filter(schedule => {
      const schedulePeriodStart = this.getPeriodStart(schedule)
      const schedulePeriodEnd = this.getPeriodEnd(schedule)

      return (
        schedulePeriodStart >= startPeriod &&
        schedulePeriodEnd <= endPeriod &&
        this.isAvailable(schedule)
      )
    })
  }

  isQuotaAvailable(
    userSchedules: Date[],
    now: Date = new Date(),
    print: Boolean = false
  ): boolean {
    const periodStart = this.getPeriodStart(now);
    const periodEnd = this.getPeriodEnd(now);

    const schedulesInPeriod = userSchedules.filter(schedule => {
      const inPeriod = this.isDateInRange(schedule, periodStart, periodEnd);
      return inPeriod;
    });
    if(print)
      console.log(
        "schedulesInPeriod.length < this.quota " +
          schedulesInPeriod.length +
          "< " +
          this.quota
      );
    return schedulesInPeriod.length < this.quota;
  }

  public isDateInRange(date: Date, start: Date, end: Date): boolean {
    const dateTimestamp = date.getTime();
    const startTimestamp = start.getTime();
    const endTimestamp = end.getTime();
    return dateTimestamp >= startTimestamp && dateTimestamp <= endTimestamp;
  }

  private getPeriodStart (date: Date): Date {
    if (this.quotaPeriod === 'day') {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate())
    } else if (this.quotaPeriod === 'week') {
      const dayOfWeek = date.getDay()
      const startOfWeek = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - dayOfWeek
      )
      return startOfWeek
    } else if (this.quotaPeriod === 'month') {
      return new Date(date.getFullYear(), date.getMonth(), 1)
    } else {
      return new Date(date.getFullYear(), 0, 1)
    }
  }

  private getPeriodEnd (date: Date): Date {
    if (this.quotaPeriod === 'day') {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
    } else if (this.quotaPeriod === 'week') {
      const dayOfWeek = date.getDay()
      const endOfWeek = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - dayOfWeek + 7
      )
      return endOfWeek
    } else if (this.quotaPeriod === 'month') {
      return new Date(date.getFullYear(), date.getMonth() + 1, 1)
    } else {
      return new Date(date.getFullYear() + 1, 0, 1)
    }
  }
}

export { AvailabilityManager, type QuotaPeriod }
