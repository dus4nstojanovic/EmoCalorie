-- name: create-status-table-if-not-exists!
-- create the status table if it does not exist
CREATE TABLE IF NOT EXISTS status (
  id serial PRIMARY KEY,
  sdate varchar (50) NOT NULL,
  calories numeric NOT NULL,
  goal numeric NOT NULL);

-- name: create-food-table-if-not-exists!
-- create the food table if it does not exist
CREATE TABLE IF NOT EXISTS food (
id serial PRIMARY KEY,
name varchar (100) NOT NULL,
calories numeric NOT NULL);

-- name: insert-goal-today<!
-- inserting goal
INSERT INTO status (goal, sdate, calories)
    VALUES (:goal, :sdate, :calories);

-- name: get-goal-today
-- selects goal for today
SELECT goal, sdate
FROM status;

-- name: clear-status!
-- deletes all rows from status table
DELETE FROM status;
