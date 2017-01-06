(ns emo-calorie.routes.emo-calorie-routes
  (:require [ring.util.response :as response]
            [compojure.core :refer :all]
            [emo-calorie.views.emo-calorie-layout :refer [common-layout]]
            [emo-calorie.models.query-defs :as query]
            [clojure.data.json :as json])
  (:import (java.time LocalDateTime)
           (java.text SimpleDateFormat)
           (java.util Date)))

(defn index-get [request]
  (common-layout
    [:p]))

(defn get-goal [request]
  (for [goal (query/get-goal-today)]
    (json/write-str goal)))

(defn post-goal [request]
  (let [goal (get-in request [:params :goal])]
    (query/clear-status!)
    (query/insert-goal-today<! {
                                :goal     (read-string goal)
                                :sdate    (.format (SimpleDateFormat. "MM/dd/yyyy") (Date.))
                                :calories 0})))

(defroutes emo-calorie-routes
           (GET "/" [] index-get)
           (GET "/getgoal" [] get-goal)
           (POST "/goal" [] post-goal))
