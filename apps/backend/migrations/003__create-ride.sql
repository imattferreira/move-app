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
  date          TIMESTAMP NOT NULL,

  CONSTRAINT fk_ride_passenger_id
    FOREIGN KEY (passenger_id)
    REFERENCES ccca.account(account_id)
    ON DELETE CASCADE,

  CONSTRAINT fk_ride_driver_id
    FOREIGN KEY (driver_id)
    REFERENCES ccca.account(account_id)
    ON DELETE CASCADE
);
