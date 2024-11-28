import Ride from "../entities/ride";

export default interface RidesRepository {
  save(ride: Ride): Promise<void>;
  findByRideId(rideId: string): Promise<Ride | null>;
  findLastRideOfPassenger(passengerId: string): Promise<Ride>;
}

export class PsqlRidesRepository implements RidesRepository {
  save(ride: Ride): Promise<void> {
    throw new Error("Method not implemented.");
  }

  findByRideId(rideId: string): Promise<Ride | null> {
    throw new Error("Method not implemented.");
  }

  findLastRideOfPassenger(passengerId: string): Promise<Ride> {
    throw new Error("Method not implemented.");
  }
}

export class RidesRepositoryInMemory implements RidesRepository {
  save(ride: Ride): Promise<void> {
    throw new Error("Method not implemented.");
  }

  findByRideId(rideId: string): Promise<Ride | null> {
    throw new Error("Method not implemented.");
  }

  findLastRideOfPassenger(passengerId: string): Promise<Ride> {
    throw new Error("Method not implemented.");
  }
}
