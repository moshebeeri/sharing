// resource.test.ts
import { ResourceSharingSystem, Resource, DurationBasedSharingStrategy } from './resource';

// jest.mock('./helpers', () => ({
//   generateAvailablePeriods: jest.fn(),
//   isValidBookingRequest: jest.fn(),
// }));

describe('ResourceSharingSystem', () => {
  let system: ResourceSharingSystem;

  beforeEach(() => {
    system = new ResourceSharingSystem();
  });

  test('adds a resource', () => {
    const resource: Resource = {
      id: 1,
      name: 'Vacation Home',
      sharingStrategy: {
        availabilityPattern: '0 0 1 */3 *',
        bookingPattern: '1w',
        allocationSystem: 'firstComeFirstServed',
        bookings: [],
      } as DurationBasedSharingStrategy,
    };

    system.addResource(resource);

    expect(system.resources).toContain(resource);
  });

  // Other tests for ordering, validation, etc.
});
