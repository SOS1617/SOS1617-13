//---------------------------------------------------------------------COMUN------------------------------------------------------------------------//
var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require("path");

var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";


var app = express();

app.use(bodyParser.json()); //use default json enconding/decoding
app.use(helmet()); //improve security


app.use("/", express.static( path.join(__dirname,"public")));

console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-    G13'S START MODULE    -XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");




//...............................................API GOALS.....Luciano..............................................................;//

"use strict";
/* global __dirname */

var MongoClientGoal = require("mongodb").MongoClient;

var mdbURLGoal= "mongodb://luciano:aspire5536@ds137760.mlab.com:37760/lucianodb";

var dbGoal;


MongoClientGoal.connect(mdbURLGoal, { native_parser: true}, function(err, database) {
    if (err) {
        console.log("cant not connect to dbGoal:" + err);
        process.exit(1);

    }
    dbGoal = database.collection("goals");
    
    app.listen(port);
  console.log("Magic is happening on port " + port);  
    

});



// Base GET
app.get("/", function (request, response) {
    console.log("INFO: Redirecting to /goals");
    response.redirect(301, BASE_API_PATH + "/goals");
});

// GET a collection
app.get(BASE_API_PATH + "/goals", function (request, response) {
    console.log("INFO : new request to /goals");
     dbGoal.find({}).toArray( function (err, goals) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending goals: " + JSON.stringify(goals, 2, null));
            response.send(goals);
        }
    });
});


// GET a single resource
app.get(BASE_API_PATH + "/goals/:city", function (request, response) {
    var city = request.params.city;
     if (!city) {
        console.log("WARNING: New GET request to /goals/:city without city, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /goals/" + city);
        dbGoal.find({"city" : city}, function (err, filteredContacts) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
             
                if (filteredContacts.length > 0) {
                    var goals = filteredContacts[0]; //since we expect to have exactly ONE goals with this city
                    console.log("INFO: Sending goals: " + JSON.stringify(goals, 2, null));
                    response.send(goals);
                } else {
                    console.log("WARNING: There are not any contact with city " + city);
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});

//POST over a collection goals
app.post(BASE_API_PATH + "/goals", function (request, response) {
    var newGoals = request.body;
    if (!newGoals) {
        console.log("WARNING: New POST request to /goals/ without contact, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to /goals with body: " + JSON.stringify(newGoals, 2, null));
        if (!newGoals.city || !newGoals.hour || !newGoals.email || !newGoals.goals_first_team || !newGoals.goals_second_team || !newGoals.phone || !newGoals.email) {
            console.log("WARNING: The goal " + JSON.stringify(newGoals, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbGoal.find({}, function (err, goals) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var contactsBeforeInsertion = goals.filter((goal) => {
                        return (goal.citylocaleCompare(newGoals.city, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (contactsBeforeInsertion.length > 0) {
                        console.log("WARNING: The goal " + JSON.stringify(newGoals, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding goal " + JSON.stringify(newGoals, 2, null));
                        dbGoal.insert(newGoals);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});

//POST over a single resource goal
app.post(BASE_API_PATH + "/goals/:city", function (request, response) {
    var city = request.params.city;
    console.log("WARNING: New POST request to /goals/" + city + ", sending 405...");
    response.sendStatus(405);
});

//PUT over a collection 
app.put(BASE_API_PATH + "/goals", function (request, response) {
    console.log("WARNING: New PUT request to /goals, sending 405...");
    response.sendStatus(405);
});


//PUT over a single resource
app.put(BASE_API_PATH + "/goals/:city", function (request, response) {
    var updatedCity = request.body;
    var city = request.params.city;
    if (!updatedCity) {
        console.log("WARNING: New PUT request to /goals/ without goal, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT request to /goals/" + city + " with data " + JSON.stringify(updatedCity, 2, null));
         if (!updatedCity.city || !updatedCity.hour || !updatedCity.email || !updatedCity.goals_first_team || !updatedCity.goals_second_team || !updatedCity.phone || !updatedCity.email) {
            console.log("WARNING: The goal " + JSON.stringify(updatedCity, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbGoal.find({}, function (err, goals) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var contactsBeforeInsertion = goals.filter((goal) => {
                        return (goal.city.localeCompare(city, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (contactsBeforeInsertion.length > 0) {
                        dbGoal.update({city: city}, updatedCity);
                        console.log("INFO: Modifying goal with city " + city + " with data " + JSON.stringify(updatedCity, 2, null));
                        response.send(updatedCity); // return the updated goal
                    } else {
                        console.log("WARNING: There are not any goal with city " + city);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }
});


//DELETE over a collection goals
app.delete(BASE_API_PATH + "/goals", function (request, response) {
    console.log("INFO: New DELETE request to /goals");
    dbGoal.remove({}, {multi: true}, function (err, numRemoved) {
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            if (numRemoved > 0) {
                console.log("INFO: All the goals (" + numRemoved + ") have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            } else {
                console.log("WARNING: There are no goals to delete");
                response.sendStatus(404); // not found
            }
        }
    });
});


//DELETE over a single resource goals
app.delete(BASE_API_PATH + "/goals/:city", function (request, response) {
    var city = request.params.city;
    if (!city) {
        console.log("WARNING: New DELETE request to /goals/:city without city, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /contacts/" + city);
        dbGoal.remove({city: city}, {}, function (err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: Contacts removed: " + numRemoved);
                if (numRemoved === 1) {
                    console.log("INFO: The contact with city " + city + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                } else {
                    console.log("WARNING: There are no goals to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});




//...............................................API RESULTS.....Victor..............................................................;//

