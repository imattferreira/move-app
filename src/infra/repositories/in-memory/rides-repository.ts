import Ride from '~/domain/entities/ride';
import RidesRepository from '~/application/repositories/rides-repository';

class RidesRepositoryInMemory implements RidesRepository {
  private stored: Ride[];

  constructor() {
    this.stored = [];
  }

  async save(ride: Ride): Promise<void> {
    this.stored.push(ride);
  }

  async findById(rideId: string): Promise<Ride | null> {
    const ride = this.stored.find(ride => ride.getId() === rideId);

    return ride || null;
  }

  async hasActiveRideOfDriver(driverId: string): Promise<boolean> {
    return this.stored.some(ride => (
      ride.getDriverId() === driverId && ride.status !== 'completed'
    ));
  }

  async hasActiveRideOfPassenger(passengerId: string): Promise<boolean> {
    return this.stored.some(
      ride => ride.getPassengerId() === passengerId
        && ride.status !== 'completed'
    );
  }

  async update(ride: Ride): Promise<void> {
    const rideIndex = this.stored.findIndex(r => r.getId() === ride.getId());

    this.stored[rideIndex] = ride;
  }
}

export default RidesRepositoryInMemory;
