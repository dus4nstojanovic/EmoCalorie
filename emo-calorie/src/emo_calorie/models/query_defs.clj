(ns emo-calorie.models.query-defs
  (:require [environ.core :refer [env]]
            [yesql.core :refer [defqueries]]))

(defqueries "emo_calorie/models/emo_calories.sql" {:connection (env :database-url)})
