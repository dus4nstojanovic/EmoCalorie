(ns emo-calorie.handler-test
  (:use midje.sweet)
  (:require [clojure.test :refer :all]
            [ring.mock.request :as mock]
            [emo-calorie.handler :refer :all]
            [emo-calorie.models.query-defs :as query]
            [clojure.data.json :as json])
  (:import (java.time LocalDateTime)
           (java.text SimpleDateFormat)
           (java.util Date)))

(defn get-from-json
  "Helper function for getting key from json response"
  [respSeq key]
  (get (json/read-str (first respSeq) :key-fn keyword) key))
(defn get-from-json-array
  "Helper function for getting key from json array"
  [resp key]
  (get (first (json/read-str resp :key-fn keyword)) key))

(facts "GET and POSTS tests"
       (with-state-changes [(before :facts (do (query/create-status-table-if-not-exists!) (query/create-food-table-if-not-exists!)))
                            (after :facts (do (query/clear-status!) (query/clear-food!)))]

                           (fact "Test / GET"
                                 (let [response (app (mock/request :get "/"))]
                                   (:status response) => 200))

                           (fact "Test /getgoal GET"
                                 (query/insert-goal-today<! {:goal 1500 :sdate (.format (SimpleDateFormat. "MM/dd/yyyy") (Date.)) :calories 0})
                                 (let [response (app (mock/request :get "/getgoal"))]
                                   (:status response) => 200
                                   (get-from-json (:body response) :goal) => 1500
                                   (get-from-json (:body response) :sdate) => (.format (SimpleDateFormat. "MM/dd/yyyy") (Date.))
                                   (get-from-json (:body response) :calories) => 0))

                           (fact "Test /getfood GET"
                                 (query/insert-food-today<! {:name "Cake" :calories 450})
                                 (let [response (app (mock/request :get "/getfood"))]
                                   (:status response) => 200
                                   (get-from-json-array (:body response) :name)  => "Cake"
                                   (get-from-json-array (:body response) :calories) => 450))

                           (fact "Test /goal POST"
                                 (query/insert-goal-today<! {:goal 1300 :sdate "11/12/2016" :calories 350})
                                 (query/insert-food-today<! {:name "Lollipop" :calories 200})
                                 (let [response (app (mock/request :post "/goal" {:goal 1500}))]
                                   (:status response) => 200
                                   (count (query/get-goal-today)) => 1
                                   (count (query/get-food-today)) => 0
                                   (get (first (query/get-goal-today)) :goal)  => 1500M))

                           (fact "Test /food POST"
                                 (query/insert-goal-today<! {:goal 1300 :sdate (.format (SimpleDateFormat. "MM/dd/yyyy") (Date.)) :calories 500})
                                 (let [response (app (mock/request :post "/food" {:name "Apple" :calories 40 :current 500}))]
                                   (:status response) => 200
                                   (get (first (query/get-food-today)) :name) => "Apple"
                                   (get (first (query/get-food-today)) :calories) => 40M
                                   (get (first (query/get-goal-today)) :calories) => 540M
                                   ))

                           (fact "Test /removefood POST"
                                 (query/insert-goal-today<! {:goal 1300 :sdate (.format (SimpleDateFormat. "MM/dd/yyyy") (Date.)) :calories 350})
                                 (def id (get (query/insert-food-today<! {:name "Coffee" :calories 230}) :id))
                                 (let [response (app (mock/request :post "/removefood" {:id id :current 120}))]
                                   (:status response) => 200
                                   (count (query/get-food-today)) => 0
                                   (get (first (query/get-goal-today)) :calories) => 120M))

                           (fact "Test /reset POST"
                                 (query/insert-goal-today<! {:goal 1800 :sdate (.format (SimpleDateFormat. "MM/dd/yyyy") (Date.)) :calories 350})
                                 (query/insert-food-today<! {:name "Donut" :calories 200})
                                 (query/insert-food-today<! {:name "Juice" :calories 150})
                                 (let [response (app (mock/request :post "/reset"))]
                                   (:status response) => 200
                                   (count (query/get-food-today)) => 0
                                   (count (query/get-goal-today)) => 0
                                   ))
                           ))

