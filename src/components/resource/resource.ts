import { AvailabilityPattern } from "./AvailabilityPattern";


class Resource {
  id: number;
  name: string;
  availabilityGroupId: number;
  availability: AvailabilityPattern[];

  constructor(
    id: number,
    name: string,
    availabilityGroupId: number,
    availability: AvailabilityPattern[]
  ) {
    this.id = id;
    this.name = name;
    this.availabilityGroupId = availabilityGroupId;
    this.availability = availability;
  }
}

type SharingStrategy = TimeBasedSharingStrategy | DurationBasedSharingStrategy | GroupBasedSharingStrategy;

interface TimeBasedSharingStrategy {
  slots: Array<{ start: string; end: string }>;
  queue: Array<number>; // user IDs
  canBookWhileInQueue: boolean;
  bookingPreferences: "weekdays" | "weekends" | "any";
  budgetSystem: "coins" | "points" | null;
  monthlyBudget: number | null;
}

// In this example, the availabilityPattern uses the standard
// cron format, where "0 0 1 */3 *" represents
// "at 00:00 on day-of-month 1 every 3 months".
// The bookingPattern uses a custom format, where "1w"
// represents "1 week per booking".
interface DurationBasedSharingStrategy {
  availabilityPattern: string; // e.g., "0 0 1 */3 *"
  bookingPattern: string; // e.g., "1w"
  allocationSystem: "firstComeFirstServed" | "lottery";
  bookings: Array<{ userID: number; start: string; end: string }>; // actual bookings
}

interface GroupBasedSharingStrategy {
  teams: Array<{ teamID: number; memberIDs: Array<number> }>;
  teamSize: number;
  teamSchedules: Array<{ teamID: number; start: string; end: string }>;
  allocationSystem: "availability" | "fairness";
}

class ResourceSharingSystem {
  resources: Resource[];

  constructor() {
    this.resources = [];
  }

  addResource(resource: Resource): void {
    this.resources.push(resource);
  }
  generateAvailablePeriods(
    availabilityPattern: string,
    startDate: string,
    endDate: string
  ): Array<{ start: string; end: string }> {
    // Implementation to parse the pattern and generate the periods
    return [];
  }

  isValidBookingRequest(
    bookingPattern: string,
    userID: number,
    requestedStartDate: string,
    requestedEndDate: string,
    bookings: Array<{ userID: number; start: string; end: string }>
  ): boolean {
    // Implementation to parse the pattern and check if the request is valid
    return false;
  }

  // Other methods for ordering, validation, etc.
}


class AvailabilityGroup {
  id: number;
  name: string;
  resources: Resource[];

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    this.resources = [];
  }

  addResource(resource: Resource): Resource[] {
    this.resources.push(resource);
    return this.resources;
  }
}

export {
  ResourceSharingSystem,
  AvailabilityGroup,
  Resource,
  type DurationBasedSharingStrategy
};