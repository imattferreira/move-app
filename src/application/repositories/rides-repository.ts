import Ride from "~/domain/entities/ride";

// LSP - Liskov Substitution Principle
interface RidesRepository {
  save(ride: Ride): Promise<void>;
  findByRideId(rideId: string): Promise<Ride | null>;
  hasActiveRideOfPassenger(passengerId: string): Promise<boolean>;
  update(ride: Ride): Promise<void>;
};

export default RidesRepository;
