(ns emo-calorie.handler
  (:require [compojure.core :refer [defroutes routes]]
            [compojure.route :as route]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]]
            [emo-calorie.routes.emo-calorie-routes :refer [emo-calorie-routes]]
            [emo-calorie.models.query-defs :as query]))

(defn init []
  (query/create-status-table-if-not-exists!)
  (query/create-food-table-if-not-exists!))

(defroutes app-routes
  (route/not-found "Not Found"))

(def app (-> (routes emo-calorie-routes app-routes)
             (wrap-defaults (assoc-in site-defaults [:security :anti-forgery] false))))
