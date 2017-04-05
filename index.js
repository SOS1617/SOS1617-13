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
var apicorners =require("./apis/corners.js");
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
    apicorners.register(app,dbC,vic,checkApiKeyFunction);


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
