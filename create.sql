DROP SCHEMA IF EXISTS ccca cascade;

CREATE SCHEMA ccca;

CREATE TABLE ccca.account (
	account_id   UUID              PRIMARY KEY,
	name         TEXT    NOT NULL,
	email        TEXT    NOT NULL,
	cpf          TEXT    NOT NULL,
	car_plate    TEXT    NULL,
	is_passenger BOOLEAN NOT NULL DEFAULT false,
	is_driver    BOOLEAN NOT NULL DEFAULT false,
	password     TEXT    NOT NULL
);

CREATE TABLE ccca.ride (
  ride_id       UUID    PRIMARY KEY,
  passenger_id  UUID,
  driver_id     UUID,
  status        TEXT,
  fare          NUMERIC,
  distance      NUMERIC,
  from_lat      NUMERIC,
  from_long     NUMERIC,
  to_lat        NUMERIC,
  to_long       NUMERIC,
  date          TIMESTAMP
);

CREATE TABLE ccca.position (
  position_id UUID      PRIMARY KEY,
  ride_id     UUID,
  lat         NUMERIC,
  long        NUMERIC,
  date        TIMESTAMP
);

CREATE INDEX idx_account_email ON ccca.account (email);
CREATE INDEX idx_ride_passenger_status ON ccca.ride (passenger_id, status);
CREATE INDEX idx_position_ride_id ON ccca.position (ride_id);
