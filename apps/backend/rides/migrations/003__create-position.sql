CREATE TABLE IF NOT EXISTS ccca.position (
  position_id UUID                PRIMARY KEY,
  ride_id     UUID      NOT NULL,
  lat         NUMERIC   NOT NULL,
  long        NUMERIC   NOT NULL,
  date        TIMESTAMP NOT NULL,

  CONSTRAINT fk_position_ride_id
    FOREIGN KEY (ride_id)
    REFERENCES ccca.ride(ride_id)
    ON DELETE CASCADE
);
