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
SELECT goal, sdate, calories
FROM status;

-- name: clear-status!
-- deletes all rows from status table
DELETE FROM status;

-- name: update-calories!
-- updates calories
UPDATE status
SET calories = :calories
WHERE id = (SELECT id FROM status LIMIT 1);

-- name: insert-food-today<!
-- inserting food
INSERT INTO food (name, calories)
    VALUES (:name, :calories);

-- name: get-food-today
-- selects food for today
SELECT id,
       name,
       calories
FROM food;

-- name: delete-food!
-- deletes food by id
DELETE FROM food
  WHERE id = :id;

-- name: clear-food!
-- delete all rows from food table
DELETE FROM food;
