"use strict";
/* global __dirname */

var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require("path");

var MongoClient = require("mongodb").MongoClient;

var mdbURL= "mongodb://sos1617-13:sos1617-13@ds137730.mlab.com:37730/sandbox";


var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";

var db, db1, db2;

MongoClient.connect(mdbURL, { native_parser: true}, function(err, database) {
    if (err) {
        console.log("cant not connect to db:" + err);
        process.exit(1);

    }
    db = database.collection("goals");
    db2 = database.collection("results");
    db1 = database.collection("corners");
    
    app.listen(port, ()=> {
  console.log("Magic is happening on port " + port);  
    

});
});

var app = express();

app.use(bodyParser.json()); //use default json enconding/decoding
app.use(helmet()); //improve security


/*var goals = [{
    "city" : "spain",
    "hour" : "15:30",
    "goals_first_team" : "2",
    "goals_second_team" : "1",
    "team_a" : "madrid",
    "team_b" : "barça"
    
},{
    "city" : "seville",
    "hour" : "17:40",
    "goals_first_team" : "1",
    "goals_second_team" : "0",
    "team_a" : "sevilla",
    "team_b" : "betis"
},{
    "city" : "malaga",
    "hour" : "17:40",
    "goals_first_team" : "0",
    "goals_second_team" : "1",
    "team_a" : "malaga",
    "team_b" : "español"
}];

var corners = [{
    "country" : "Spain",
    "year" : "2010",
    "corner1" : "2",
    "corne2" : "1",
    "corner3" : "0"
},{
    "country" : "Germany",
    "year" : "2011",
    "corner1" : "1",
    "corne2" : "0",
    "corner3" : "4"
},{
    "country" : "Greece",
    "year" : "2014",
    "corner1" : "5",
    "corne2" : "3",
    "corner3" : "3"
}];

var results = [{
    "city" : "seville",
    "foul" : "3",
    "goal_total" : "100",
    "loose" : "1",
    "victory" : "1",
    "year" : "2010",
    "name" : "betis"
    
},{
     "city" : "madrid",
    "foul" : "5",
    "goal_total" : "150",
    "loose" : "3",
    "victory" : "34",
    "year" : "2015",
    "name" : "madrid"
},{
     "city" : "barcelona",
    "foul" : "6",
    "goal_total" : "200",
    "loose" : "3",
    "victory" : "2",
    "year" : "2016",
    "name" : "barcelona"
}];*/


// Base GET goals
app.get("/", function (request, response) {
    console.log("INFO: Redirecting to /goals");
    response.redirect(301, BASE_API_PATH + "/goals");
    
});

// Base GET corners
app.get("/", function (request, response) {
    console.log("INFO: Redirecting to /corners");
    response.redirect(301, BASE_API_PATH + "/corners");
    
});

// Base GET results
app.get("/", function (request, response) {
    console.log("INFO: Redirecting to /results");
    response.redirect(301, BASE_API_PATH + "/results");
    
});



// GET a collection goals
app.get(BASE_API_PATH + "/goals", function (request, response) {
    console.log("INFO : new request to /goals");
     db.find({}).toArray( function (err, goals) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending goals: " + JSON.stringify(goals, 2, null));
            response.send(goals);
        }
    });
});

// GET a collection corners
app.get(BASE_API_PATH + "/corners", function (request, response) {
    console.log("INFO : new request to /corners");
    db1.find({}).toArray( function (err, corners) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending gocornersals: " + JSON.stringify(corners, 2, null));
            response.send(corners);
        }
    });
    //TBD
});

// GET a collection victorys
app.get(BASE_API_PATH + "/results", function (request, response) {
    console.log("INFO : new request to /results");
     db2.find({}).toArray( function (err, results) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending results: " + JSON.stringify(results, 2, null));
            response.send(results);
        }
    });
});



// GET a single resource goals city
app.get(BASE_API_PATH + "/goals/:city", function (request, response) {
    var city = request.params.city;
     if (!city) {
        console.log("WARNING: New GET request to /goals/:city without city, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /goals/" + city);
        db.find({"city" : city}, function (err, filteredContacts) {
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

// GET a single resource corners country
app.get(BASE_API_PATH + "/corners/:country", function (request, response) {
    var country = request.params.country;
      if (!country) {
        console.log("WARNING: New GET request to /corners/:country without country, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /corners/" + country);
        db1.find({"country" : country}, function (err, filteredContacts) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
             
                if (filteredContacts.length > 0) {
                    var corners = filteredContacts[0]; //since we expect to have exactly ONE corners with this city
                    console.log("INFO: Sending corners: " + JSON.stringify(corners, 2, null));
                    response.send(corners);
                } else {
                    console.log("WARNING: There are not any contact with country " + country);
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});

// GET a single resource results
app.get(BASE_API_PATH + "/results/:city", function (request, response) {
    var city = request.params.city;
      if (!city) {
        console.log("WARNING: New GET request to /results/:city without city, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /results/" + city);
        db2.find({"city" : city}, function (err, filteredContacts) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
             
                if (filteredContacts.length > 0) {
                    var results = filteredContacts[0]; //since we expect to have exactly ONE results with this city
                    console.log("INFO: Sending results: " + JSON.stringify(results, 2, null));
                    response.send(results);
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
            db.find({}, function (err, goals) {
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
                        db.insert(newGoals);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});

//POST over a collection corners
app.post(BASE_API_PATH + "/corners", function (request, response) {
    var newCorners = request.body;
    if (!newCorners) {
        console.log("WARNING: New POST request to /corners/ without contact, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to /corners with body: " + JSON.stringify(newCorners, 2, null));
        if (!newCorners.country || !newCorners.year || !newCorners.corner1 || !newCorners.corner2 || !newCorners.corner3) {
            console.log("WARNING: The corner " + JSON.stringify(newCorners, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            db1.find({}, function (err, corners) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var contactsBeforeInsertion = corners.filter((corner) => {
                        return (corner.countrylocaleCompare(newCorners.country, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (contactsBeforeInsertion.length > 0) {
                        console.log("WARNING: The corner " + JSON.stringify(newCorners, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding goal " + JSON.stringify(newCorners, 2, null));
                        db.insert(newCorners);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});

//POST over a collection results
app.post(BASE_API_PATH + "/results", function (request, response) {
    var newResults = request.body;
    if (!newResults) {
        console.log("WARNING: New POST request to /goals/ without contact, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to /goals with body: " + JSON.stringify(newResults, 2, null));
        if (!newResults.city || !newResults.foul || !newResults.goal_total || !newResults.loose || !newResults.victory || !newResults.year || !newResults.name) {
            console.log("WARNING: The result " + JSON.stringify(newResults, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            db2.find({}, function (err, results) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var contactsBeforeInsertion = results.filter((result) => {
                        return (result.citylocaleCompare(newResults.city, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (contactsBeforeInsertion.length > 0) {
                        console.log("WARNING: The result " + JSON.stringify(newResults, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding result " + JSON.stringify(newResults, 2, null));
                        db.insert(newResults);
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

//POST over a single resource corners
app.post(BASE_API_PATH + "/corners/:country", function (request, response) {
    var country = request.params.country;
    console.log("WARNING: New POST request to /corners/" + country + ", sending 405...");
    response.sendStatus(405);
});

//POST over a single resource results
app.post(BASE_API_PATH + "/results/:city", function (request, response) {
    var city = request.params.city;
    console.log("WARNING: New POST request to /results/" + city + ", sending 405...");
    response.sendStatus(405);
});


//PUT over a collection goals
app.put(BASE_API_PATH + "/goals", function (request, response) {
    console.log("WARNING: New PUT request to /goals, sending 405...");
    response.sendStatus(405);
});

//PUT over a collection corners
app.put(BASE_API_PATH + "/corners", function (request, response) {
    console.log("WARNING: New PUT request to /corners, sending 405...");
    response.sendStatus(405);
});

//PUT over a collection results
app.put(BASE_API_PATH + "/results", function (request, response) {
    console.log("WARNING: New PUT request to /results, sending 405...");
    response.sendStatus(405);
});


//PUT over a single resource goals
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
            db.find({}, function (err, goals) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var contactsBeforeInsertion = goals.filter((goal) => {
                        return (goal.city.localeCompare(city, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (contactsBeforeInsertion.length > 0) {
                        db.update({city: city}, updatedCity);
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
/*
//PUT over a single resource corners
app.put(BASE_API_PATH + "/corners/:country", function (request, response) {
    var updatedCountry = request.body;
    var country = request.params.country;
    if (!updatedCountry) {
        console.log("WARNING: New PUT request to /corners/ without corner, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT request to /corners/" + country + " with data " + JSON.stringify(updatedCountry, 2, null));
         if (!updatedCountry.country || !updatedCountry.year || !updatedCountry.corner1 || !updatedCountry.corner2 || !updatedCountry.corner3) {
            console.log("WARNING: The goal " + JSON.stringify(updatedCity, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            db.find({}, function (err, goals) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var contactsBeforeInsertion = goals.filter((goal) => {
                        return (goal.city.localeCompare(city, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (contactsBeforeInsertion.length > 0) {
                        db.update({city: city}, updatedCity);
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
});*/



//DELETE over a collection goals
app.delete(BASE_API_PATH + "/goals", function (request, response) {
    console.log("INFO: New DELETE request to /goals");
    db.remove({}, {multi: true}, function (err, numRemoved) {
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
        db.remove({city: city}, {}, function (err, numRemoved) {
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



