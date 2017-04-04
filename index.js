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

app.get("/api/v1/test", express.static(path.join(__dirname, "test")));

app.get("/api/v1/test", function(request, response) {
    response.sendFile(path.join(__dirname,"test/test.html"));
});
console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-    G13'S START MODULE    -XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");


var apigoals = require("./apis/goals.js");

// APIKEY

var api_key = "scraping";

// HELPER METHOD APIKEY

var checkApiKey =function (request,response){
    if(!request.query.apikey){
        console.error('WARNING: No apikey');
        response.sendStatus(401);
        return false;
    }  if (request.query.apikey !== api_key) {
        console.error('WARNING: Incorrect apikey was used!');
        response.sendStatus(403);
        return false;
    }
    return true;
};

    
//...............................................API GOALS.....Luciano..............................................................;//

var MongoClientGoals = require("mongodb").MongoClient;

var mdbURLGoal = "mongodb://luciano:aspire5536@ds137760.mlab.com:37760/lucianodb";

var dbGoal;

var luc = "/api/v1/goals";

MongoClientGoals.connect(mdbURLGoal, {
    native_parser: true
}, function(err, database) {
    if (err) {
        console.log("cant not connect to dbGoal:" + err);
        process.exit(1);

    }
    dbGoal= database.collection("goals");
    apigoals.register(app,dbGoal,luc,checkApiKey);
      app.listen(port, ()=> {
  console.log("Magic is happening on port " + port);  

});

});

// Base GET
/*
app.get("/", function(request, response) {
    console.log("INFO: Redirecting to /goals");
    response.redirect(301, "/goals");
});

//GET

app.get(luc + "/loadInitialData", (request, response) => {
    MongoClientGoals.connect(mdbURLGoal, {
        native_parser: true
    }, (error, database) => {
        if (error) {
            console.log("cannot db");
            process.exit();
        }
        
        dbGoal.find({}).toArray(function(error, tema_a) {
            if (error) {
                console.error("Error data from db");
                response.sendStatus(500);
            }
            else {
                    dbGoal.remove({});
                    dbGoal.insert([{
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
                    }])
                    
                    console.log("OK");
                    response.sendStatus(201);
                
            }
        });
    });
});

//POST a un recurso

app.post(luc +"/:city",(request,response)=>{
    response.sendStatus(405);
});


//GET a una coleccion

app.get(luc,(request,response)=>{
   console.log("INFO : new request to /goals");
   var from = request.query.from;
	var to = request.query.to;
	var all = request.query.all;
	var search = request.query.search;
	var apikey = request.query.apikey;
	var i = [];
	var result = [];

	
    dbGoal.find({}).toArray( function (err, goals) {
        
        goals.forEach(function(value,key){
            if(search == ""|| all == 1){
				i.push(value);
			}else{
				if(search == value.city || search == value.hour){
					i.push(value);	
				}
			}
		});
		if(all != 1){
			i.forEach(function(value,key){
				if(key+1 >= from && key+1 <= to){
					result.push(value);	
				}
			});
		}else{
			result = i;
		}
		
		var final = { 
			result: result, 
			total: i.length
		}

        
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending goals");
            response.send(final);
        } 
    });
});

//GET a un recurso

app.get(luc +"/:city",(request,response)=>{
    
    var city = request.params.city;
      if (!city) {
        console.log("WARNING: New GET request to /goals/:city without city, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET");
        dbGoal.find({"city" : city}).toArray(function(error, team_a) {
            if (error) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
                var filteredcity=team_a.filter((s)=>{
                    return (s.city.localeCompare(city,"en",{"sensitivity":"base"})===0);
                });
             
                if (filteredcity.length > 0) {
                    var c = filteredcity[0]; //since we expect to have exactly ONE goals with this city
                    console.log("INFO: Sending city");
                    response.send(c);
                } else {
                    console.log("WARNING: There are not any contact with city " + city);
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});

//POST a una coleccion

app.post(BASE_API_PATH + "/goals", function(request, response) {
    var newgoals = request.body;
    console.log(newgoals);
    if (!newgoals) {
        console.log("WARNING: New POST request to /results/ without city, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New POST request to /goals with body: " + JSON.stringify(newgoals, 2, null));
        if (!newgoals.city || !newgoals.hour || !newgoals.goals_first_team || !newgoals.goals_second_team || !newgoals.team_a || !newgoals.team_b ) {
            console.log("WARNING: The goals " + JSON.stringify(newgoals, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }
        else {
            dbGoal.find({}).toArray( function(err, goals) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    var ResultsBeforeInsertion = goals.filter((goals) => {
                        return (goals.city.localeCompare(goals.city, "en", {
                            'sensitivity': 'base'
                        }) === 0);
                    });
                    if (ResultsBeforeInsertion.length > 0) {
                        console.log("WARNING: The result " + JSON.stringify(goals, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    }
                    else {
                        console.log("INFO: Adding result " + JSON.stringify(goals, 2, null));
                        dbGoal.insert(goals);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});


//PUT a un recurso

app.put(luc +"/:city",(request,response)=>{
    
    var updatedGoal = request.body;
    var city = request.params.city;
    
    if (updatedGoal.city!=city) {
        console.log("WARNING: New PUT request to /goals/ without corner, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT");
         if (!updatedGoal.city || !updatedGoal.hour || !updatedGoal.goals_first_team || !updatedGoal.goals_second_team || !updatedGoal.team_a|| !updatedGoal.team_b) {
            console.log("WARNING: PUT incorrect");
            response.sendStatus(422); // unprocessable entity
        } else {
            
            dbGoal.update({city:updatedGoal.city},
            
           
            {
                city:updatedGoal.city,
                hour:updatedGoal.hour,
                goals_first_team:updatedGoal.goals_first_team,
                goals_second_team:updatedGoal.goals_second_team,
                team_a:updatedGoal.team_a,
                team_b:updatedGoal.team_b,
                
                
            });
            
            response.sendStatus(200);
        }
    }
    
});

//DELETE a un recurso

app.delete(luc+"/:city",(request,response)=>{
    var city=request.params.city;
    
     if (!city) {
        console.log("WARNING: New DELETE request to sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE r");
        dbGoal.remove({city: city}, {}, function (error, team_a) {
            if (error) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            }  else {
                    
                    console.log("deleted");
                    response.sendStatus(200); // not found
                }
            
        });
    }
});

//DELETE a una coleccion

app.delete(luc,(request,response)=>{
    
    console.log("INFO: New DELETE");
    dbGoal.remove({}, {multi: true}, function (error, team_a) {
        if (error) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            team_a=JSON.parse(team_a);
            if (team_a.n > 0) {
                console.log("INFO: All the goals have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            } else {
                console.log("WARNING: There are no goals to delete");
                response.sendStatus(404); // not found
            }
        }
    });
    
});


//PUT a una coleccion

app.put(luc,(request,response)=>{
    response.sendStatus(405);
});*/

//...............................................API RESULTS.....Victor..............................................................;//

var MongoClientCorner = require("mongodb").MongoClient;

var url = "mongodb://test:test@ds133670.mlab.com:33670/sandbox";

var dbC;

var vic = "/api/v1/corners";

MongoClientCorner.connect(url, {
    native_parser: true
}, function(err, database) {
    if (err) {
        console.log("cant not connect to dbGoal:" + err);
        process.exit(1);

    }
    dbC= database.collection("corners");


});

// Base GET
app.get("/", function(request, response) {
    console.log("INFO: Redirecting to /corners");
    response.redirect(301, "/corners");
});

//GET

app.get(vic + "/loadInitialData", (request, response) => {
    MongoClientCorner.connect(url, {
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
                    response.sendStatus(201);
                
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
    var country = request.params.country;
    console.log(country);
    if (!updatedCorner) {
        console.log("WARNING: New PUT request to /corners/ without establishment, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New PUT request to /corners/" + country + " with data " + JSON.stringify(updatedCorner, 2, null));
        if (!updatedCorner.country || !updatedCorner.year || !updatedCorner.corners1 || !updatedCorner.corners2 || !updatedCorner.corners3) {
            console.log("WARNING: The result " + JSON.stringify(updatedCorner, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }
        else {
            dbC.find({}).toArray( function(err, results) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    var resultsBeforeInsertion = results.filter((corner) => {
                        return (corner.country.localeCompare(country, "en", {
                            'sensitivity': 'base'
                        }) === 0);
                    });
                    if (resultsBeforeInsertion.length > 0) {
                        dbC.update({
                            country: country
                        }, updatedCorner);
                        console.log("INFO: Modifying corner with country " + country + " with data " + JSON.stringify(updatedCorner, 2, null));
                        response.send(updatedCorner); // return the updated result
                    }
                    else {
                        console.log("WARNING: There is not any result with country " + country);
                        response.sendStatus(404); // not found
                    }
                }
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
            }  else {
                    
                    console.log("deleted");
                    response.sendStatus(200); // not found
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
            corners1=JSON.parse(corners1);
            if (corners1.n > 0) {
                console.log("INFO: All the corners have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            } else {
                console.log("WARNING: There are no corners to delete");
                response.sendStatus(404); // not found
            }
        }
    });
    
});


//PUT a una coleccion

app.put(vic,(request,response)=>{
    response.sendStatus(405);
});


//"-----------------------------API RESULTS------Yopis--------------------------------------------------";
"use strict";
/* global __dirname */



var MongoClientresult = require('mongodb').MongoClient;

var mdbURLresult = "mongodb://sos1617-13:sos1617-13@ds137730.mlab.com:37730/sandbox";

var dbresult;

MongoClientresult.connect(mdbURLresult, {
    native_parser: true
}, function(err, database) {

    if (err) {
        console.log("CAN NOT CONEECT TO DB: " + err);
        process.exit(1);
    }

    dbresult = database.collection("results");

    //app.listen(port);
    //console.log("Magic is happening on port " + port);

});




// Base GET
app.get("/", function(request, response) {
    console.log("INFO: Redirecting to /");
    response.redirect(301, "/results");
});


// GET a collection
app.get(BASE_API_PATH + "/results", function(request, response) {
    console.log("INFO: New GET request to /results");
    dbresult.find({}).toArray(function(err, results) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        }
        else {
            console.log("INFO: Sending results: " + JSON.stringify(results, 2, null));
            response.send(results);
        }
    });
});

// GET a single resource
/*app.get(BASE_API_PATH + "/results/:city", function(request, response) {
    var city = request.params.city;
    console.log(city);
    if (!city) {
        console.log("WARNING: New GET request to /results/:city without country, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New GET request to /results/" + city);
        dbresult.find({
            "city": city
        }).toArray( function(err, filteredresults) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                console.log(filteredresults);
                if (filteredresults.length > 0) {
                    var result = filteredresults[0]; //since we expect to have exactly ONE establishment with this country
                    console.log("INFO: Sending result: " + JSON.stringify(result, 2, null));
                    response.send(result);
                }
                else if (city === "loadInitialData") {
                    dbresult.find({}).toArray(function(err, results) {
                        console.log(results);
                        if (err) {
                            console.error('Error while getting data from DB');
                        }
                        if (results.length === 0) {
                            results = [{
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
                        }];
                            console.log(results);
                            dbresult.insert(results);
                            response.sendStatus(201);
                        }
                        else {
                            console.log("results has more size than 0");
                            response.sendStatus(200);
                        }
                    });


                }
                else {
                    console.log("WARNING: There are not any city with " + city);
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});
*/

//Load Initial Data

app.get(BASE_API_PATH + "/results/loadInitialData",function(request, response) {
    
    dbresult.find({}).toArray(function(err,results){
        
         if (err) {
        console.error('WARNING: Error while getting initial data from DB');
        return 0;
    }
    
      if (results.length === 0) {
        console.log('INFO: Empty DB, loading initial data');

       var city = [{
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
                        }];
        dbresult.insert(city);
        response.sendStatus(201) //created
    } else {
        console.log('INFO: DB has ' + results.length + ' results ');
    }
});
});
// GET a collection de paises en un mismo año 

app.get(BASE_API_PATH + "/results/:foul", function (request, response) {
    var foul = request.params.foul;
    var city = request.params.foul;
    if(isNaN(request.params.foul.charAt(0))){
            if (!city) {
        console.log("WARNING: New GET request to /results/:city without name, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /city/" + city);
        dbresult.find({city:city}).toArray(function (err, results) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else if (results.length > 0) { 
                    var result = results; //since we expect to have exactly ONE contact with this name
                    console.log("INFO: Sending result: " + JSON.stringify(result, 2, null));
                    response.send(result);
                } else {
                    console.log("WARNING: There are not any result with city " + city);
                    response.sendStatus(404); // not found
                }
        });
}
    }else{
    if (!foul) {
        console.log("WARNING: New GET request to /results/:foul without foul, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /results/" + foul);
        dbresult.find({foul:foul}).toArray(function (err, results) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else if (results.length > 0) { 
                    var result = results; //since we expect to have exactly ONE contact with this name
                    console.log("INFO: Sending result: " + JSON.stringify(result, 2, null));
                    response.send(result);
                } else {
                    console.log("WARNING: There are not any result with foul " + foul);
                    response.sendStatus(404); // not found
                
                }
        });
}
}});

//GET a recurso concreto con 2 parametros

app.get(BASE_API_PATH + "/results/:city/:foul", function (request, response) {
    var city = request.params.city;
    var foul = request.params.foul;
    if (!city || !foul) {
        console.log("WARNING: New GET request to /results/:city without city or without foul, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /results/" + city + "/" + foul);
        dbresult.find({city:city, $and:[{foul:foul}]}).toArray(function (err, results) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else if (results.length > 0) { 
                    var result = results[0]; //since we expect to have exactly ONE contact with this name
                    console.log("INFO: Sending result: " + JSON.stringify(result, 2, null));
                    response.send(result);
                } else {
                    console.log("WARNING: There are not any city with city " + city +  "and foul " + foul);
                    response.sendStatus(404); // not found
                
                }
        });
}
});




//POST over a collectionwqrls
app.post(BASE_API_PATH + "/results", function(request, response) {
    var newresult = request.body;
    console.log(newresult);
    if (!newresult) {
        console.log("WARNING: New POST request to /results/ without city, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New POST request to /results with body: " + JSON.stringify(newresult, 2, null));
        if (!newresult.city || !newresult.foul || !newresult.goal_total || !newresult.loose || !newresult.victory || !newresult.year ||!newresult.name) {
            console.log("WARNING: The result " + JSON.stringify(newresult, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }
        else {
            dbresult.find({}).toArray( function(err, results) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    var ResultsBeforeInsertion = results.filter((result) => {
                        return (result.city.localeCompare(newresult.city, "en", {
                            'sensitivity': 'base'
                        }) === 0);
                    });
                    if (ResultsBeforeInsertion.length > 0) {
                        console.log("WARNING: The result " + JSON.stringify(newresult, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    }
                    else {
                        console.log("INFO: Adding result " + JSON.stringify(newresult, 2, null));
                        dbresult.insert(newresult);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});


//POST over a single resource
app.post(BASE_API_PATH + "/results/:city", function(request, response) {
    var city = request.params.city;
    console.log("WARNING: New POST request to /results/" + city + ", sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a collection
app.put(BASE_API_PATH + "/results", function(request, response) {
    console.log("WARNING: New PUT request to /results, sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a single resource
app.put(BASE_API_PATH + "/results/:city", function(request, response) {
    var updatedresult = request.body;
    var city = request.params.city;
    console.log(city);
    if (!updatedresult) {
        console.log("WARNING: New PUT request to /results-stats/ without establishment, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New PUT request to /result/" + city + " with data " + JSON.stringify(updatedresult, 2, null));
        if (!updatedresult.city || !updatedresult.foul || !updatedresult.goal_total || !updatedresult.loose || !updatedresult.victory || !updatedresult.year ||!updatedresult.name) {
            console.log("WARNING: The result " + JSON.stringify(updatedresult, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }
        else {
            dbresult.find({}).toArray( function(err, results) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    var resultsBeforeInsertion = results.filter((result) => {
                        return (result.city.localeCompare(city, "en", {
                            'sensitivity': 'base'
                        }) === 0);
                    });
                    if (resultsBeforeInsertion.length > 0) {
                        dbresult.update({
                            city: city
                        }, updatedresult);
                        console.log("INFO: Modifying result with city " + city + " with data " + JSON.stringify(updatedresult, 2, null));
                        response.send(updatedresult); // return the updated result
                    }
                    else {
                        console.log("WARNING: There is not any result with city " + city);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }
});


//DELETE over a collection
app.delete(BASE_API_PATH + "/results", function(request, response) {
    console.log("INFO: New DELETE request to /results");
    dbresult.remove({}, {
        multi: true
    }, function(err, numRemoved) {
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        }
        else {
            response.sendStatus(204);
        }
    });
});


//DELETE over a single resource
app.delete(BASE_API_PATH + "/results/:city", function(request, response) {
    var city = request.params.city;
    if (!city) {
        console.log("WARNING: New DELETE request to /results/:city without city, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New DELETE request to /results/" + city);
        dbresult.remove({
            city: city
        }, {}, function(err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
               response.sendStatus(204);
            }
        });
    }
});