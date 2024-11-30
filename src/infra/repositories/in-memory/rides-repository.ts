import RidesRepository from "../../../../application/repositories/rides-repository";
import Ride from "../../../../domain/entities/ride";

export class RidesRepositoryInMemory implements RidesRepository {
  private stored: Ride[];

  constructor() {
    this.stored = [];
  }

  async save(ride: Ride): Promise<void> {
    this.stored.push(ride);
  }

  async findByRideId(rideId: string): Promise<Ride | null> {
    const ride = this.stored.find((ride) => ride.id === rideId);

    return ride || null;
  }

  async hasActiveRideOfPassenger(passengerId: string): Promise<boolean> {
    const ride = this.stored
      .find((ride) => ride.passengerId === passengerId && ride.status !== 'completed');

    return !!ride;
  }
}

export default RidesRepositoryInMemory;
