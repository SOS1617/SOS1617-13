//---------------------------------------------------------------------COMUN------------------------------------------------------------------------//
"use strict";
/* global __dirname */

var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require("path");

var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";


var app = express();

app.use(bodyParser.json()); //use default json enconding/decoding
app.use(helmet()); //improve security


//app.use("/", express.static(path.join(__dirname, "public")));


app.get("/api/v1/test", express.static(path.join(__dirname, "test")));

app.get("/api/v1/test", function(request, response) {
    response.sendFile(path.join(__dirname,"test/test.html"));
});

//-----------MongoCLIENT-----------------//

var MongoClientGoals = require("mongodb").MongoClient;
var MongoClientCorner = require("mongodb").MongoClient;
var MongoClientresult = require('mongodb').MongoClient;

//-------MongodbLink-----------//

var mdbURLGoal = "mongodb://luciano:aspire5536@ds137760.mlab.com:37760/lucianodb";
var url = "mongodb://test:test@ds133670.mlab.com:33670/sandbox";
var mdbURLresult = "mongodb://sos1617-13:sos1617-13@ds137730.mlab.com:37730/sandbox";

//---------VAR DB ------------->
var dbGoal;
var dbC;
var dbresult;


//---------VAR APIS------------->

var vic = "/api/v1/corners";
var luc = "/api/v1/goals";
var Llopisapi = "/api/v1/results";

//-----------APIS-----------//
var apigoals =require("./apis/goals.js");

var apiresults =require("./apis/results.js");

// APIKEY

var api_key = "scraping";

// HELPER METHOD APIKEY

var checkApiKeyFunction = function (request,response){
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


//-----------MongoClientLUCIANO----------//


MongoClientGoals.connect(mdbURLGoal, {
    native_parser: true
}, function(err, database) {
    if (err) {
        console.log("cant not connect to dbGoal:" + err);
        process.exit(1);

    }
    dbGoal= database.collection("goals");
    apigoals.register(app,dbGoal,luc,checkApiKeyFunction);
      app.listen(port, ()=> {
  console.log("Magic is happening on port " + port);  

});

});

//...............................................API RESULTS.....Victor..............................................................;//

//-------MongoclientVictor--------//


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
//"use strict";
/* global __dirname */




MongoClientresult.connect(mdbURLresult, {
    native_parser: true
}, function(err, database) {

    if (err) {
        console.log("CAN NOT CONEECT TO DB: " + err);
        process.exit(1);
    } 
    
    dbresult = database.collection("results");
    apiresults.register(app,dbresult,BASE_API_PATH,checkApiKeyFunction);


});
