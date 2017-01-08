(ns emo-calorie.routes.emo-calorie-routes
  (:require [ring.util.response :as response]
            [compojure.core :refer :all]
            [emo-calorie.views.emo-calorie-layout :refer [common-layout]]
            [emo-calorie.models.query-defs :as query]
            [clojure.data.json :as json])
  (:import (java.time LocalDateTime)
           (java.text SimpleDateFormat)
           (java.util Date)))

(defn index-get
  "Index page"
  [request]
  (common-layout
    [:p]))

(defn get-goal
  "Gets goal for today"
  [request]
  (for [goal (query/get-goal-today)]
    (json/write-str goal)))

(defn post-goal
  "Sets goal for today and deletes all status and foods"
  [request]
  (let [goal (get-in request [:params :goal])]
    (query/clear-status!)
    (query/clear-food!)
    (query/insert-goal-today<! {
                                :goal     (read-string goal)
                                :sdate    (.format (SimpleDateFormat. "MM/dd/yyyy") (Date.))
                                :calories 0})))

(defn post-food
  "Adds food and updates calories"
  [request]
  (let [name (get-in request [:params :name])
        calories (get-in request [:params :calories])
        current (get-in request [:params :current])]
    (query/update-calories! {:calories (+ (read-string current) (read-string calories))})
    (str "" (get (query/insert-food-today<! {
                                             :name name
                                             :calories (read-string calories)}) :id) )))

(defn get-food
  "Gets foods inserted today"
  [request]
  (json/write-str (query/get-food-today)))

(defn remove-food
  "Removes food by specified id and updates calories"
  [request]
  (let [id (get-in request [:params :id])
        current (get-in request [:params :current])]
    (query/update-calories! {:calories (read-string current)})
    (str "" (query/delete-food<! {:id (read-string id)}))))

(defn reset
  "Deletes all foods and statuses"
  [request]
  (query/clear-status!)
  (str "" (query/clear-food!)))

(defroutes emo-calorie-routes
           (GET "/" [] index-get)
           (GET "/getgoal" [] get-goal)
           (GET "/getfood" [] get-food)
           (POST "/goal" [] post-goal)
           (POST "/food" [] post-food)
           (POST "/removefood" [] remove-food)
           (POST "/reset" [] reset))
