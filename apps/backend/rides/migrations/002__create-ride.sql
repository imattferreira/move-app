CREATE TABLE IF NOT EXISTS ccca.ride (
  ride_id       UUID                  PRIMARY KEY,
  passenger_id  UUID      NOT NULL,
  driver_id     UUID      NULL,
  status        TEXT      NOT NULL,
  fare          NUMERIC   NOT NULL,
  distance      NUMERIC   NOT NULL,
  from_lat      NUMERIC   NOT NULL,
  from_long     NUMERIC   NOT NULL,
  to_lat        NUMERIC   NOT NULL,
  to_long       NUMERIC   NOT NULL,
  date          TIMESTAMP NOT NULL
);
