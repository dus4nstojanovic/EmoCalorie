-- name: create-status-table-if-not-exists!
-- create the status table if it does not exist
CREATE TABLE IF NOT EXISTS status (
  id serial PRIMARY KEY,
  sdate date NOT NULL,
  calories numeric NOT NULL,
  goal numeric NOT NULL);

-- name: create-food-table-if-not-exists!
-- create the food table if it does not exist
CREATE TABLE IF NOT EXISTS food (
id serial PRIMARY KEY,
name varchar (100) NOT NULL,
calories numeric NOT NULL);
