(ns emo-calorie.views.emo-calorie-layout
  (:require [hiccup.page :refer [html5 include-css include-js]]))

(defn common-layout [& body]
  (html5
    [:head
     [:title "EmoCalorie"]
     (include-css "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css")
     (include-css "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css")
     (include-css "/css/emo-calorie.css")
     (include-js "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js")
     (include-js "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js")
     (include-js "/js/emo-calorie.js")]
    [:body
     [:h1#page-title "Emotional calorie counter"]
     body]))
