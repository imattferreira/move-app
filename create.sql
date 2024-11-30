DROP SCHEMA IF EXISTS ccca cascade;

CREATE SCHEMA ccca;

CREATE TABLE IF NOT EXISTS ccca.account (
	account_id   UUID              PRIMARY KEY,
	name         TEXT    NOT NULL,
	email        TEXT    NOT NULL,
	cpf          TEXT    NOT NULL,
	car_plate    TEXT    NULL,
	is_passenger BOOLEAN NOT NULL DEFAULT false,
	is_driver    BOOLEAN NOT NULL DEFAULT false,
	password     TEXT    NOT NULL
);

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

CREATE INDEX IF NOT EXISTS idx_account_email ON ccca.account (email);
CREATE INDEX IF NOT EXISTS idx_ride_passenger_status ON ccca.ride (passenger_id, status);
CREATE INDEX IF NOT EXISTS idx_position_ride_id ON ccca.position (ride_id);
