(defproject emo-calorie "1.0.0"
  :description "Emo-calorie - emotional calories counter"
  :url "http://localhost:[PORT]/"
  :min-lein-version "2.5.0"

  :ring {:handler emo-calorie.handler/app
         :init    emo-calorie.handler/init}

  :dependencies [[org.clojure/clojure "1.8.0"]
                 [compojure "1.5.1"]
                 [ring/ring-defaults "0.2.1"]
                 [hiccup "1.0.5"]
                 [org.clojure/java.jdbc "0.7.0-alpha1"]
                 [org.postgresql/postgresql "9.4-1201-jdbc41"]
                 [yesql "0.5.3"]
                 [environ "1.0.0"]
                 [org.clojure/data.json "0.2.6"]]

  :plugins [[lein-ring "0.9.7"]
            [lein-environ "1.0.0"]]

  :profiles {:test-local {:dependencies [[midje "1.8.3"]
                                         [javax.servlet/servlet-api "2.5"]
                                         [ring/ring-mock "0.3.0"]]

                          :plugins [[lein-midje "3.2.1"]]}
             :test-env-vars {}
             :dev-env-vars  {}
             :test [:test-local :test-env-vars]
             :dev  [:dev-env-vars]
             :production {:ring {:open-browser? false
                                 :stacktraces?  false
                                 :auto-reload?  false}}})
