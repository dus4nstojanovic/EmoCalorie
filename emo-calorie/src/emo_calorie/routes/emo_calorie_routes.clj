(ns emo-calorie.routes.emo-calorie-routes
  (:require [compojure.core :refer :all]
            [emo-calorie.views.emo-calorie-layout :refer [common-layout]]))

(defn example-get [request]
  (common-layout
    [:p "Example GET"]))

(defn example-post [request]
  (let [post-value (get-in request [:params :example-post])]
    (str "You posted: " post-value)))

(defroutes emo-calorie-routes
 (GET "/" [] example-get)
 (POST "/post" [] example-post))
