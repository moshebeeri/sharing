import { ReservationSystem, ReservationRule, AvailabilityGroup, Reservation } from "./ReservationSystem";
import { Resource } from "../resource/resource";
import { AvailabilityPattern } from "../resource/AvailabilityPattern";

describe("ReservationSystem", () => {
  let reservationSystem: ReservationSystem;
  let parkingResource: Resource;
  let yachtResource: Resource;

  beforeEach(() => {
    reservationSystem = new ReservationSystem();

    const parkingGroup = new AvailabilityGroup(1, "Parking");
    const yachtGroup = new AvailabilityGroup(2, "Yachts");

    parkingResource = new Resource(1, "Parking Spot", 1, [new AvailabilityPattern("* * * * *")]);
    yachtResource = new Resource(2, "Yacht", 2, [new AvailabilityPattern("* 7-21 * * *")]);

    parkingGroup.addResource(parkingResource);
    yachtGroup.addResource(yachtResource);

    reservationSystem.addAvailabilityGroup(parkingGroup);
    reservationSystem.addAvailabilityGroup(yachtGroup);

    const parkingRule = new ReservationRule(1, 1, 1, new AvailabilityPattern("0 19-7 * * *"), {});
    const yachtRule = new ReservationRule(2, 2, 1, new AvailabilityPattern("* 7-20 * * 1-5"), {});

    reservationSystem.addReservationRule(parkingRule);
    reservationSystem.addReservationRule(yachtRule);
  });

  test("can reserve parking spot", () => {
    const userId = 1;
    const startTime = new Date(Date.UTC(2023, 0, 5, 19, 0, 0));
    const endTime = new Date(Date.UTC(2023, 0, 6, 7, 0, 0));
    expect(reservationSystem.canReserve(userId, 1, startTime, endTime)).toBeTruthy();
  });

  test("can reserve yacht", () => {
    const userId = 1;
    const startTime = new Date(Date.UTC(2023, 0, 5, 10, 0, 0));
    const endTime = new Date(Date.UTC(2023, 0, 5, 14, 0, 0));
    expect(reservationSystem.canReserve(userId, 2, startTime, endTime)).toBeTruthy();
  });

  test("cannot reserve parking spot outside allowed hours", () => {
    const userId = 1;
    const startTime = new Date(Date.UTC(2023, 0, 5, 18, 0, 0));
    const endTime = new Date(Date.UTC(2023, 0, 6, 7, 0, 0));
    expect(reservationSystem.canReserve(userId, 1, startTime, endTime)).toBeFalsy();
  });

  test("cannot reserve yacht on weekend", () => {
    const userId = 1;
    const startTime = new Date(Date.UTC(2023, 0, 7, 10, 0, 0));
    const endTime = new Date(Date.UTC(2023, 0, 7, 14, 0, 0));
    expect(reservationSystem.canReserve(userId, 2, startTime, endTime)).toBeFalsy();
  });

  test("cannot reserve parking spot when exceeding allowed reservations", () => {
    const userId = 1;
    const startTime1 = new Date(Date.UTC(2023, 0, 5, 19, 0, 0));
    const endTime1 = new Date(Date.UTC(2023, 0, 6, 7, 0, 0));
    const startTime2 = new Date(Date.UTC(2023, 0, 6, 19, 0, 0));
    const endTime2 = new Date(Date.UTC(2023, 0, 7, 7, 0, 0));
    reservationSystem.addReservation(new Reservation(1, userId, parkingResource, startTime1, endTime1));
    reservationSystem.addReservation(new Reservation(2, userId, parkingResource, startTime2, endTime2));

    const startTime3 = new Date(Date.UTC(2023, 0, 7, 19, 0, 0));
    const endTime3 = new Date(Date.UTC(2023, 0, 8, 7, 0, 0));
    expect(reservationSystem.canReserve(userId, 1, startTime3, endTime3)).toBeFalsy();
  });
});

