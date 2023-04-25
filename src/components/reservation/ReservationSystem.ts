import { AvailabilityPattern } from "../resource/AvailabilityPattern";
import { Resource } from "../resource/resource";

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

  // You can add more methods to handle the availability group logic
}

class Reservation {
  id: number;
  userID: number;
  resource: Resource;
  startTime: Date;
  endTime: Date;

  constructor(id: number, userID: number, resource: Resource, startTime: Date, endTime: Date) {
    this.id = id;
    this.userID = userID;
    this.resource = resource;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  // You can add more methods to handle reservation logic
}


class ReservationRule {
  id: number;
  availabilityGroupId: number;
  maxReservationsPerTimeFrame: number;
  availabilityPattern: AvailabilityPattern;
  resourceConstraints: any; // You can define additional constraints specific to resources here

  constructor(id: number, availabilityGroupId: number, maxReservationsPerTimeFrame: number, timeFrame: AvailabilityPattern, resourceConstraints: any = {}) {
    this.id = id;
    this.availabilityGroupId = availabilityGroupId;
    this.maxReservationsPerTimeFrame = maxReservationsPerTimeFrame;
    this.availabilityPattern = timeFrame;
    this.resourceConstraints = resourceConstraints;
  }

  checkConstraints(reservations: Reservation[], userId: number, startTime: Date, endTime: Date): boolean {
    // Check if the desired reservation time matches the availability pattern
    if (!this.availabilityPattern.matchesRange(startTime, endTime)) {
      return false;
    }

    const reservationsInTimeFrame = reservations.filter((reservation) =>
      this.availabilityPattern.matches(reservation.startTime) && this.availabilityPattern.matches(reservation.endTime)
    );

    const userReservations = reservationsInTimeFrame.filter(
      (reservation) => reservation.userID === userId
    );

    return userReservations.length < this.maxReservationsPerTimeFrame;
  }

}

class ReservationSystem {
  availabilityGroups: AvailabilityGroup[];
  reservations: Reservation[];
  reservationRules: ReservationRule[];

  constructor() {
    this.availabilityGroups = [];
    this.reservations = [];
    this.reservationRules = [];
  }

  addAvailabilityGroup(group: AvailabilityGroup): void {
    this.availabilityGroups.push(group);
  }

  addReservation(reservation: Reservation): void {
    this.reservations.push(reservation);
  }

  addReservationRule(rule: ReservationRule): void {
    this.reservationRules.push(rule);
  }

  getAvailabilityGroup(availabilityGroupId: number): AvailabilityGroup | undefined {
    return this.availabilityGroups.find(group => group.id === availabilityGroupId);
  }

  getRulesForAvailabilityGroup(availabilityGroupId: number): ReservationRule[] {
    return this.reservationRules.filter(rule => rule.availabilityGroupId === availabilityGroupId);
  }

  getReservationsForUserAndGroup(userId: number, availabilityGroupId: number): Reservation[] {
    return this.reservations.filter(reservation =>
      reservation.userID === userId && reservation.resource.availabilityGroupId === availabilityGroupId
    );
  }

  canReserve(userId: number, availabilityGroupId: number, startTime: Date, endTime: Date): boolean {
    const group = this.getAvailabilityGroup(availabilityGroupId);
    if (!group) return false;

    const rules = this.getRulesForAvailabilityGroup(availabilityGroupId);
    const reservations = this.getReservationsForUserAndGroup(userId, availabilityGroupId);

    for (const rule of rules) {
      if (!rule.checkConstraints(reservations, userId, startTime, endTime)) {
        return false;
      }
    }

    return true;
  }
}

export { ReservationSystem, ReservationRule, AvailabilityGroup, Reservation };
