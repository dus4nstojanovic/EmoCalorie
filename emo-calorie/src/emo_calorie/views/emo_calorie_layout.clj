(ns emo-calorie.views.emo-calorie-layout
  (:require [hiccup.page :refer [html5 include-css include-js]]))

(defn common-layout [& body]
  (html5
    [:head
     [:title "EmoCalorie"]
     [:link {:rel "icon" :type "image/x-icon" :href "/images/smiley.ico"}]
     (include-css "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
                  "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
                  "/css/toastr.min.css"
                  "/css/emo-calorie.css")
     (include-js "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"
                 "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
                 "/js/toastr.min.js"
                 "/js/moment.js"
                 "/js/emo-calorie.js")]
    [:body
     [:div.container-fluid
      [:div#calories-row.row
       [:div.col-xs-4.col-xs-offset-4.text-center
        [:span#caloriesToday {:data-toggle "tooltip" :data-placement "bottom" :title "Calories allowed today (kcal) | CLICK TO RESET"} "0"]
        [:span#goalText "Goal | kcal"]
        [:input#goalToday {:type "hidden" :value "0"}]]]
      [:div#smiley-row.row
       [:img#smiley {:src "/images/happy.png" :draggable "false" }]
       [:div#talking-container
        [:img#talking-balloon {:src "/images/talking-balloon.png"}]
        [:span#talking-balloon-text "FEED ME!"]
        ]]
      [:div#table-row.row
       [:table#foodTable.table.table-striped.table-hover.table-condensed
        {:data-toggle "tooltip" :data-placemenet "top" :title "Click on the row to remove food"}
        [:thead
         [:tr
          [:th "Ordinal"]
          [:th "Food name"]
          [:th "Calories"]]]
        [:tbody]]]]

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
