(ns emo-calorie.handler
  (:require [compojure.core :refer [defroutes routes]]
            [compojure.route :as route]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]]
            [emo-calorie.routes.emo-calorie-routes :refer [emo-calorie-routes]]))

(defn init
  []
  (println "Emo Calorie application is starting"))

(defroutes app-routes
  (route/not-found "Not Found"))

(def app (-> (routes emo-calorie-routes app-routes)
             (wrap-defaults (assoc-in site-defaults [:security :anti-forgery] false))))
