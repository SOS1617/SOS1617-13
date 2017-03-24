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


app.use("/", express.static(path.join(__dirname, "public")));

console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-    G13'S START MODULE    -XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");




//...............................................API GOALS.....Luciano..............................................................;//

"use strict";
/* global __dirname */

var MongoClientGoal = require("mongodb").MongoClient;

var mdbURLGoal = "mongodb://luciano:aspire5536@ds137760.mlab.com:37760/lucianodb";

var dbGoal;


MongoClientGoal.connect(mdbURLGoal, {
    native_parser: true
}, function(err, database) {
    if (err) {
        console.log("cant not connect to dbGoal:" + err);
        process.exit(1);

    }
    dbGoal = database.collection("goals");

    app.listen(port);
    console.log("Magic is happening on port " + port);


});



// Base GET
app.get("/", function(request, response) {
    console.log("INFO: Redirecting to /goals");
    response.redirect(301, BASE_API_PATH + "/goals");
});

// GET a collection
app.get(BASE_API_PATH + "/goals", function(request, response) {
    console.log("INFO : new request to /goals");
    dbGoal.find({}).toArray(function(err, goals) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        }
        else {
            console.log("INFO: Sending goals: " + JSON.stringify(goals, 2, null));
            response.send(goals);
        }
    });
});


// GET a single resource
app.get(BASE_API_PATH + "/goals/:city", function(request, response) {
    var city = request.params.city;
    console.log(city);
    if (!city) {
        console.log("WARNING: New GET request to /goals/:city without city, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New GET request to /goals/" + city);
        dbGoal.find({
            "city": city
        }, function(err, filteredContacts) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                console.log(filteredContacts);
                if (filteredContacts.length > 0) {
                    var goals = filteredContacts[0]; //since we expect to have exactly ONE goals with this city
                    console.log("INFO: Sending goals: " + JSON.stringify(goals, 2, null));
                    response.send(goals);
                }
                else if (city === "loadInitialData") {
                    dbGoal.find({}).toArray(function(err, goals) {
                        console.log(goals);
                        if (err) {
                            console.error('Error while getting data from DB');
                        }
                        if (goals.length === 0) {
                            goals = [{
                                "city": "madrid",
                                "hour": "15:30",
                                "goals_first_team": 2,
                                "goals_second_team": 1,
                                "team_a": "madrid",
                                "team_b": "barça"

                            }, {
                                "city": "seville",
                                "hour": "17:40",
                                "goals_first_team": 1,
                                "goals_second_team": 0,
                                "team_a": "sevilla",
                                "team_b": "betis"
                            }, {
                                "city": "malaga",
                                "hour": "17:40",
                                "goals_first_team": 0,
                                "goals_second_team": 1,
                                "team_a": "malaga",
                                "team_b": "español"

                            }];
                            console.log(goals);
                            dbGoal.insert(goals);
                            response.sendStatus(201);
                        }
                        else {
                            console.log("Goals has more size than 0");
                            response.sendStatus(200);
                        }
                    });


                }
                else {
                    console.log("WARNING: There are not any contact with city " + city);
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});

//POST over a collection goals
app.post(BASE_API_PATH + "/goals", function(request, response) {
    var newGoals = request.body;
    if (!newGoals) {
        console.log("WARNING: New POST request to /goals/ without contact, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New POST request to /goals with body: " + JSON.stringify(newGoals, 2, null));
        if (!newGoals.city || !newGoals.hour || !newGoals.goals_first_team || !newGoals.goals_second_team || !newGoals.team_a || !newGoals.team_b) {
            console.log("WARNING: The goal " + JSON.stringify(newGoals, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }
        else {
            dbGoal.find({}, function(err, goals) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    var contactsBeforeInsertion = goals.filter((goal) => {
                        return (goal.citylocaleCompare(newGoals.city, "en", {
                            'sensitivity': 'base'
                        }) === 0);
                    });
                    if (contactsBeforeInsertion.length > 0) {
                        console.log("WARNING: The goal " + JSON.stringify(newGoals, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    }
                    else {
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
app.post(BASE_API_PATH + "/goals/:city", function(request, response) {
    var city = request.params.city;
    console.log("WARNING: New POST request to /goals/" + city + ", sending 405...");
    response.sendStatus(405);
});

//PUT over a collection 
app.put(BASE_API_PATH + "/goals", function(request, response) {
    console.log("WARNING: New PUT request to /goals, sending 405...");
    response.sendStatus(405);
});


//PUT over a single resource
app.put(BASE_API_PATH + "/goals/:city", function(request, response) {
    var updatedCity = request.body;
    var city = request.params.city;
    if (!updatedCity) {
        console.log("WARNING: New PUT request to /goals/ without goal, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New PUT request to /goals/" + city + " with data " + JSON.stringify(updatedCity, 2, null));
        if (!updatedCity.city || !updatedCity.hour || !updatedCity.goals_first_team || !updatedCity.goals_second_team || !updatedCity.team_a || !updatedCity.team_b) {
            console.log("WARNING: The goal " + JSON.stringify(updatedCity, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }
        else {
            dbGoal.find({}, function(err, goals) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    var contactsBeforeInsertion = goals.filter((goal) => {
                        return (goal.city.localeCompare(city, "en", {
                            'sensitivity': 'base'
                        }) === 0);
                    });
                    if (contactsBeforeInsertion.length > 0) {
                        dbGoal.update({
                            city: city
                        }, updatedCity);
                        console.log("INFO: Modifying goal with city " + city + " with data " + JSON.stringify(updatedCity, 2, null));
                        response.send(updatedCity); // return the updated goal
                    }
                    else {
                        console.log("WARNING: There are not any goal with city " + city);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }
});


//DELETE over a collection goals
app.delete(BASE_API_PATH + "/goals", function(request, response) {
    console.log("INFO: New DELETE request to /goals");
    dbGoal.remove({}, {
        multi: true
    }, function(err, numRemoved) {
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        }
        else {
            if (numRemoved > 0) {
                console.log("INFO: All the goals (" + numRemoved + ") have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            }
            else {
                console.log("WARNING: There are no goals to delete");
                response.sendStatus(404); // not found
            }
        }
    });
});


//DELETE over a single resource
app.delete(BASE_API_PATH + "/goals/:city", function(request, response) {
    var city = request.params.city;
    if (!city) {
        console.log("WARNING: New DELETE request to /goals/:city without city, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New DELETE request to /contacts/" + city);
        dbGoal.remove({
            city: city
        }, {}, function(err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                console.log("INFO: Contacts removed: " + numRemoved);
                if (numRemoved === 1) {
                    console.log("INFO: The contact with city " + city + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                }
                else {
                    console.log("WARNING: There are no goals to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});




//...............................................API RESULTS.....Victor..............................................................;//

var MongoClient = require("mongodb").MongoClient;

var url = "mongodb://test:test@ds133670.mlab.com:33670/sandbox";

var dbC;

var vic = "/api/v1/corners";

MongoClient.connect(url, {
    native_parser: true
}, function(err, database) {
    if (err) {
        console.log("cant not connect to dbGoal:" + err);
        process.exit(1);

    }
    dbC= database.collection("corners");


});

//GET

app.get(vic + "/loadInitialData", (request, response) => {
    MongoClient.connect(url, {
        native_parser: true
    }, (error, database) => {
        if (error) {
            console.log("cannot db");
            process.exit();
        }
        
        dbC.find({}).toArray(function(error, corners1) {
            if (error) {
                console.error("Error data from db");
                response.sendStatus(500);
            }
            else {
                    dbC.remove({});
                    dbC.insert([{
                        "country": "Spain",
                        "year": "2010",
                        "corner1": "2",
                        "corne2": "1",
                        "corner3": "0"
                    },{
                        "country": "Spain",
                        "year": "2011",
                        "corner1": "2",
                        "corne2": "1",
                        "corner3": "0"
                    },
                    {
                        "country": "Germany",
                        "year": "2011",
                        "corner1": "1",
                        "corne2": "0",
                        "corner3": "4"
                    }, {
                        "country": "Greece",
                        "year": "2014",
                        "corner1": "5",
                        "corne2": "3",
                        "corner3": "3"
                    }])
                    
                    console.log("OK");
                    response.sendStatus(200);
                
            }
        });
    });
});

//POST a un recurso

app.post(vic +"/:country",(request,response)=>{
    response.sendStatus(405);
});


//GET a una coleccion

app.get(vic,(request,response)=>{
   console.log("INFO : new request to /corners");
    dbC.find({}).toArray( function (err, corners1) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending corners");
            response.send(corners1);
        } 
    });
});

//GET a un recurso

app.get(vic +"/:country",(request,response)=>{
    
    var country = request.params.country;
      if (!country) {
        console.log("WARNING: New GET request to /corners/:country without country, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET");
        dbC.find({"country" : country}).toArray(function(error, corners1) {
            if (error) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
                var filteredCountry=corners1.filter((s)=>{
                    return (s.country.localeCompare(country,"en",{"sensitivity":"base"})===0);
                });
             
                if (filteredCountry.length > 0) {
                    var c = filteredCountry[0]; //since we expect to have exactly ONE corners with this city
                    console.log("INFO: Sending country");
                    response.send(c);
                } else {
                    console.log("WARNING: There are not any contact with country " + country);
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});

//POST a una coleccion

app.post(vic,(request,response)=>{
    
    var country=request.params.country;
    var newCorners = request.body;
    if (!newCorners) {
        console.log("WARNING: New POST request corners");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST correct body");
        if (!newCorners.country || !newCorners.year || !newCorners.corner1 || !newCorners.corner2 || !newCorners.corner3) {
            console.log("WARNING: POST incorrect");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbC.find({}).toArray(function (error, corners1) {
                if (error) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var cornersBeforeInsertion = corners1.filter((i) => {
                        return (i.country.localeCompare(country, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (cornersBeforeInsertion.length > 0) {
                        console.log("WARNING: The corner already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding corners");
                        dbC.insert(newCorners);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
    
});

//PUT a un recurso

app.put(vic +"/:country",(request,response)=>{
    
    var updatedCorner = request.body;
    
    if (!updatedCorner) {
        console.log("WARNING: New PUT request to /corners/ without corner, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT");
         if (!updatedCorner.country || !updatedCorner.year || !updatedCorner.corner1 || !updatedCorner.corner2 || !updatedCorner.corner3) {
            console.log("WARNING: PUT incorrect");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbC.update({country:updatedCorner.country},
            {
                country:updatedCorner.country,
                year:updatedCorner.year,
                corner1:updatedCorner.corner1,
                corner2:updatedCorner.corner2,
                corner3:updatedCorner.corner3,
            });
        }
    }
    
});

//DELETE a un recurso

app.delete(vic+"/:country",(request,response)=>{
    var country=request.params.country;
    
     if (!country) {
        console.log("WARNING: New DELETE request to sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE r");
        dbC.remove({country: country}, {}, function (error, corners1) {
            if (error) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: Corners removed: ");
                if (corners1 === 1) {
                    console.log("INFO: The corners has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                } else {
                    console.log("Corners deleted: "+corners1);
                    console.log("WARNING: There are no corners to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});

//DELETE a una coleccion

app.delete(vic,(request,response)=>{
    
    console.log("INFO: New DELETE");
    dbC.remove({}, {multi: true}, function (error, corners1) {
        if (error) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            if (corners1 > 0) {
                console.log("INFO: All the corners have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            } else {
                console.log("WARNING: There are no goals to delete");
                response.sendStatus(404); // not found
            }
        }
    });
    
});


//PUT a una coleccion

app.put(vic,(request,response)=>{
    response.sendStatus(405);
});