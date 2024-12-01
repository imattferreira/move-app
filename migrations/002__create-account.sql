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
