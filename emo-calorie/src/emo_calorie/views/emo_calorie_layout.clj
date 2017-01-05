(ns emo-calorie.views.emo-calorie-layout
  (:require [hiccup.page :refer [html5 include-css include-js]]))

(defn common-layout [& body]
  (html5
    [:head
     [:title "EmoCalorie"]
     (include-css "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
                  "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
                  "/css/toastr.min.css"
                  "/css/emo-calorie.css")
     (include-js "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"
                 "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
                 "/js/toastr.min.js"
                 "/js/emo-calorie.js")]
    [:body
     [:div.container-fluid
      [:div#calories-row.row
       [:div.col-xs-4.col-xs-offset-4.text-center
        [:span#caloriesToday {:data-toggle "tooltip" :data-placement "bottom" :title "Callories consumed today"} "1231"]]]
      [:div#smiley-row.row
       [:img#smiley {:src "/images/happy.png" :draggable "false" }]
       [:div#talking-container
        [:img#talking-balloon {:src "/images/talking-balloon.png"}]
        [:span#talking-balloon-text "FEED ME!"]
        ]]
      [:div#table-row.row
       [:table.table.table-striped.table-bordered.table-hover.table-condensed
        [:thead
         [:tr
          [:th "123456"]
          [:th "123445678910"]
          [:th "12345678"]]]
        [:tbody
         [:tr
          [:td "123"]
          [:td "123"]
          [:td "123"]
          ]]]]]

     ;modal dialog - add food
     [:div#addFoodModal.modal.fade {:role "dialog"}
      [:div.modal-dialog
       [:div.modal-content
        [:div.modal-header
         [:button.close {:data-dismiss "modal"} "&times;"]
         [:h4.modal-title
          [:i.fa.fa-cutlery.margin-r-5 {:aria-hidden "true"}] "Add food"]]
        [:div.modal-body
         [:div.form-group
          [:input#txtFoodName.form-control {:placeholder "Food name..."}]]
         [:div.form-group
          [:input#txtCalories.form-control {:placeholder "Food calories..."}]]]
        [:div.modal-footer
         [:button#addFood.btn.btn-primary {:type "button"} "Add"]
         [:button.btn.btn-default {:type "button" :data-dismiss "modal"} "Close"]]]]]

     ;modal dialog - set goal
     [:div#setGoalModal.modal.fade {:role "dialog" :data-backdrop "static" :data-keyboard "false"}
      [:div.modal-dialog
       [:div.modal-content
        [:div.modal-header
         [:h4.modal-title
          [:i.fa.fa-bullseye.margin-r-5 {:aria-hidden "true"}] "How much calories will you consume today?"]]
        [:div.modal-body
         [:div.form-group
          [:input#txtCaloriesToday.form-control {:placeholder "Calories..."}]]]
        [:div.modal-footer
         [:button#setCaloriesToday.btn.btn-primary {:type "button"} "Set"]]]]]

     ;spinner
     [:img#loading {:src "/images/pacman.gif"}]
     body]))
