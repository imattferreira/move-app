CREATE INDEX IF NOT EXISTS idx_ride_passenger_status ON ccca.ride (passenger_id, status);
CREATE INDEX IF NOT EXISTS idx_position_ride_id ON ccca.position (ride_id);
