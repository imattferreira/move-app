import Ride from "~/domain/entities/ride";

// LSP - Liskov Substitution Principle
interface RidesRepository {
  save(ride: Ride): Promise<void>;
  findById(rideId: string): Promise<Ride | null>;
  hasActiveRideOfDriver(driverId: string): Promise<boolean>;
  hasActiveRideOfPassenger(passengerId: string): Promise<boolean>;
  update(ride: Ride): Promise<void>;
};

export default RidesRepository;
