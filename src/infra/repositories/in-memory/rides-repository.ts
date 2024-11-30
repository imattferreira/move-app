import RidesRepository from "../../../application/repositories/rides-repository";
import Ride from "../../../domain/entities/ride";

class RidesRepositoryInMemory implements RidesRepository {
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
    const ride = this.stored.find(
      (ride) => ride.passengerId === passengerId && ride.status !== "completed"
    );

    return !!ride;
  }

  async update(ride: Ride): Promise<void> {
    const rideIndex = this.stored.findIndex((r) => r.id === ride.id);

    this.stored[rideIndex] = ride;
  }
}

export default RidesRepositoryInMemory;
