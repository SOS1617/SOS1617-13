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

var MongoClient = require("mongodb").MongoClient;

var mdbURLGoal= "mongodb://luciano:aspire5536@ds137730.mlab.com:37730/sandbox";

var dbGoal;


MongoClient.connect(mdbURLGoal, { native_parser: true}, function(err, database) {
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

// GET a collection goals
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
