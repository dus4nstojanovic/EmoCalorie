# emo-calorie

Small clojure web application for daily use that calculates calories and shows emotions based on inserted daily goal and food.

The purpose of this application is to show clojure in action with the support of the following script languages, technologies and libraries:

- Script languages: Javascript (JQuery, Bootstrap, FontAwesome, Moment, Toastr), css
- Data access: Postgresql
- Libraries: hiccup, yesql, environ, data.json, compojure, ring, midje

## Prerequisites

You will need [Leiningen][] 2.0.0 or above installed.

[leiningen]: https://github.com/technomancy/leiningen

You will need [Posgresql] installed.

[posgresql]: https://www.postgresql.org

You will need two databases created (for running and testing).
You can change database names and passwords in profiles.clj


## Running

To start a web server for the application, run:

    lein ring server

To start tests for the application, run:

    lein with-profile test midje
    
## License

Copyright © 2017 Dušan Stojanović
