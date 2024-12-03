import Coord from '~/domain/value-objects/coord';
import Position from '../entities/position';

// Domain-Service
class DistanceCalculator {
  static calculateDistanceBetweenPositions(positions: Position[]): number {
    let distance = 0;

    for (const [index, position] of positions.entries()) {
      const next = positions[index + 1];

      if (!next) {
        break;
      }

      distance += DistanceCalculator.calculateDistanceBetweenCoords(
        position.getCoord(),
        next.getCoord()
      );
    }

    return distance;
  }

  static calculateDistanceBetweenCoords(from: Coord, to: Coord): number {
    const earthRadius = 6371;
    const degreesToRadians = Math.PI / 180;
    const deltaLat = (to.getLat() - from.getLat()) * degreesToRadians;
    const deltaLong = (to.getLong() - from.getLong()) * degreesToRadians;
    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2)
      + Math.cos(from.getLat() * degreesToRadians)
      * Math.cos(to.getLat() * degreesToRadians)
      * Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return Math.round(distance);
  }
}

export default DistanceCalculator;
